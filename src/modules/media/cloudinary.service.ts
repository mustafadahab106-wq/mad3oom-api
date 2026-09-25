import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  uploadBuffer(
    fileBuffer: Buffer,
    folder = 'mad3oom/listings',
  ): Promise<{ secure_url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            {
              width: 1600,
              height: 1200,
              crop: 'limit',
              quality: 'auto:good',
            },
            {
              overlay: {
                font_family: 'Arial',
                font_size: 54,
                font_weight: 'bold',
                text: 'مدعوم | MAD3OOM',
              },
              color: '#FFFFFF',
              opacity: 42,
              gravity: 'south',
              y: 38,
              border: '2px_solid_rgb:202020',
            },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );

      stream.end(fileBuffer);
    });
  }
}
