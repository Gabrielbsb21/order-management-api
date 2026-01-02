import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { LocalUploadProvider } from './providers/local.provider';

@Module({
  providers: [UploadService, LocalUploadProvider],
  exports: [UploadService],
})
export class UploadModule {}
