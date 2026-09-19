import * as crypto from 'crypto';

function encodeForm(params: Record<string, any>, prefix = ''): string[] {
  const pairs: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      pairs.push(...encodeForm(value, fullKey));
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (v && typeof v === 'object') pairs.push(...encodeForm(v, `${fullKey}[${i}]`));
        else pairs.push(`${encodeURIComponent(`${fullKey}[${i}]`)}=${encodeURIComponent(v)}`);
      });
    } else if (value !== undefined && value !== null) {
      pairs.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`);
    }
  }
  return pairs;
}

export async function createCheckoutSession(params: {
  secretKey: string;
  priceAED: number;
  productName: string;
  successUrl: string;
  cancelUrl: string;
  metadata: Record<string, string>;
}) {
  const body = encodeForm({
    mode: 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    line_items: [
      {
        price_data: {
          currency: 'aed',
          product_data: { name: params.productName },
          unit_amount: Math.round(params.priceAED * 100),
        },
        quantity: 1,
      },
    ],
    metadata: params.metadata,
  }).join('&');

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${params.secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || `Stripe error (${res.status})`);
  }
  return data as { id: string; url: string };
}

// تحقق من إمضاء Stripe يدويًا (خوارزمية HMAC SHA-256 الرسمية) بدون مكتبة stripe
export function verifyStripeSignature(
  rawBody: Buffer,
  signatureHeader: string,
  webhookSecret: string,
): boolean {
  if (!signatureHeader) return false;
  const parts = Object.fromEntries(
    signatureHeader.split(',').map((p) => p.split('=') as [string, string]),
  );
  const timestamp = parts['t'];
  const signature = parts['v1'];
  if (!timestamp || !signature) return false;

  const signedPayload = `${timestamp}.${rawBody.toString('utf8')}`;
  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload, 'utf8')
    .digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
                                                             }
