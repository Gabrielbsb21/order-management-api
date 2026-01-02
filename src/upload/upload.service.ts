import { Injectable } from '@nestjs/common';
//import { UploadProvider } from './upload-provider.interface';
import { LocalUploadProvider } from './providers/local.provider';

@Injectable()
export class UploadService {
  constructor(private readonly provider: LocalUploadProvider) {}

  upload(file: Express.Multer.File) {
    return this.provider.upload(file);
  }
}
