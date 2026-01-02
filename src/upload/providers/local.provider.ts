import { Injectable } from '@nestjs/common';
import { UploadProvider } from '../upload-provider.interface';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class LocalUploadProvider implements UploadProvider {
  async upload(file: Express.Multer.File): Promise<string> {
    const uploadsDir = path.resolve(process.cwd(), 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const fileName = `${uuid()}-${file.originalname}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    return `http://localhost:3000/uploads/${fileName}`;
  }
}
