import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { env } from '@usefultools/utils';
import { S3 } from 'aws-sdk';


@Module({
  controllers: [UploadController],
  providers: [
    UploadService,
    {
      provide: 'S3_CLIENT',
      useFactory: () => {
        const STORE_DRIVER = env.getAsStr('STORAGE_DRIVER');
        const accessKeyId =
          STORE_DRIVER === 's3' ? env.getAsStr('AWS_ACCESS_KEY_ID') : undefined;
        const secretAccessKey =
          STORE_DRIVER === 's3' ? env.getAsStr('AWS_ACCESS_SECRET') : undefined;

        const region =
          STORE_DRIVER === 's3' ? env.getAsStr('AWS_REGIONN') : 'auto';

        return new S3({
          accessKeyId,
          secretAccessKey,
          region,
          signatureVersion: 'v4',
        });
      },
    },
    {
      provide: 'UPLOAD_CONFIG',
      useFactory: () => {
            const STORAGE_DRIVER = (env.getAsStr('STORAGE_DRIVER') || 's3')
            return {
                driver: STORAGE_DRIVER,
                bucket: STORAGE_DRIVER === 's3' ? env.getAsStr('AWS_BUCKET') : undefined,
                piblicUrl: null
            }
      },
    },
  ],
  exports: [UploadService],
})
export class UploadModule {}
