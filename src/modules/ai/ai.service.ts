import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ListingsService } from '../listings/listings.service';
import { ChatDto } from './dto/chat.dto';
import { CompleteListingDto } from './dto/complete-listing.dto';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const CHAT_MODEL = 'claude-haiku-4-5-20251001';
const VISION_MODEL = 'claude-sonnet-5';

@Injectable()
export class AiService {
  constructor(private readonly listingsService: ListingsService) {}

  private apiKey(): string {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      throw new InternalServerErrorException(
        'AI assistant is not configured (missing ANTHROPIC_API_KEY)',
      );
    }
    return key;
  }

  private async callClaude(body: Record<string, any>) {
    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': this.apiKey(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new InternalServerErrorException(
        `AI provider error (${res.status}): ${text.slice(0, 300)}`,
      );
    }

    return res.json();
  }

  // ---------- ميزة 1: مساعد محادثة للزوار ----------
  async chat(dto: ChatDto) {
    const listings = await this.listingsService.findAll();
    const contextListings = listings.slice(0, 30).map((l: any) => ({
      id: l.id,
      make: l.make,
      model: l.model,
      year: l.year,
      price: l.price,
      city: l.city,
      damageType: l.damageType,
      isFeatured: l.isFeatured,
    }));

    const system = [
      'You are the AI shopping assistant for MAD3OOM, a fixed-price marketplace for damaged/salvage cars in the Gulf region.',
      'Reply in the same language the visitor writes in (Arabic or English).',
      'Only recommend listings that appear in AVAILABLE_LISTINGS below — never invent a car that is not there.',
      'When you recommend a listing, mention its id, make, model, year, price and city so the app can link to it.',
      'Be concise, friendly, and helpful. If asked something unrelated to buying/selling cars on this platform, politely redirect.',
      '',
      `AVAILABLE_LISTINGS: ${JSON.stringify(contextListings)}`,
    ].join('\n');

    const messages = [
      ...(dto.history || []).map((h) => ({ role: h.role, content: h.content })),
      { role: 'user', content: dto.message },
    ];

    const data = await this.callClaude({
      model: CHAT_MODEL,
      max_tokens: 600,
      system,
      messages,
    });

    const reply = (data.content || [])
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('\n')
      .trim();

    return { reply: reply || '...' };
  }

  // ---------- ميزة 2: مساعد البائع (Complete with AI) ----------
  async completeListing(dto: CompleteListingDto, files: Array<{ buffer: Buffer; mimetype: string }>) {
    if (!files?.length) {
      throw new BadRequestException('At least one photo is required');
    }

    const imageBlocks = files.slice(0, 4).map((f) => ({
      type: 'image',
      source: {
        type: 'base64',
        media_type: f.mimetype || 'image/jpeg',
        data: f.buffer.toString('base64'),
      },
    }));

    // نجيب متوسط سعر سيارات مشابهة من قاعدة البيانات الحقيقية عشان نرشد تقدير السعر
    const allListings = await this.listingsService.findAll();
    const similar = allListings.filter(
      (l: any) =>
        (!dto.make || String(l.make).toLowerCase() === dto.make.toLowerCase()) &&
        (!dto.model || String(l.model).toLowerCase() === dto.model.toLowerCase()),
    );
    const avgPrice = similar.length
      ? Math.round(similar.reduce((s: number, l: any) => s + Number(l.price || 0), 0) / similar.length)
      : null;

    const system = [
      'You assist sellers on MAD3OOM, a fixed-price marketplace for damaged/salvage cars in the Gulf region.',
      'Look at the provided photos and any known details, then respond with ONLY a JSON object (no markdown, no prose, no code fences) with exactly these keys:',
      '{"make":string,"model":string,"year":number|null,"damageType":string,"description":string,"suggestedPriceAED":number,"confidence":"low"|"medium"|"high"}',
      'The "description" must be 2-3 sentences written in Arabic, honest about visible damage, suitable for a listing page.',
      avgPrice
        ? `Similar listings already on the platform for this make/model currently average ${avgPrice} AED — weigh this alongside visible condition when suggesting a price.`
        : 'No directly comparable listings were found on the platform, so base the price estimate on general Gulf-market knowledge for a damaged vehicle of this type.',
    ].join('\n');

    const knownDetails = [
      dto.make && `make: ${dto.make}`,
      dto.model && `model: ${dto.model}`,
      dto.year && `year: ${dto.year}`,
      dto.city && `city: ${dto.city}`,
      dto.notes && `seller notes: ${dto.notes}`,
    ]
      .filter(Boolean)
      .join(', ');

    const data = await this.callClaude({
      model: VISION_MODEL,
      max_tokens: 700,
      system,
      messages: [
        {
          role: 'user',
          content: [
            ...imageBlocks,
            {
              type: 'text',
              text: knownDetails
                ? `Known details so far: ${knownDetails}. Analyze the photos and fill in the rest.`
                : 'Analyze the photos and fill in the listing details.',
            },
          ],
        },
      ],
    });

    const raw = (data.content || [])
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('\n')
      .trim();

    try {
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return { ...parsed, comparableAveragePriceAED: avgPrice };
    } catch {
      throw new InternalServerErrorException('AI response could not be parsed');
    }
  }

  // ---------- ميزة 3: صوت المساعد (ElevenLabs) ----------
  async speak(text: string): Promise<Buffer> {
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key) {
      throw new InternalServerErrorException(
        'Voice assistant is not configured (missing ELEVENLABS_API_KEY)',
      );
    }
    const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'audio/mpeg',
          'xi-api-key': key,
        },
        body: JSON.stringify({
          text: text.slice(0, 800),
          model_id: 'eleven_flash_v2_5',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      },
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new InternalServerErrorException(
        `Voice provider error (${res.status}): ${errText.slice(0, 300)}`,
      );
    }

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
