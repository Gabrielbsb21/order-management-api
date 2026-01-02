export interface UploadProvider {
  upload(file: Express.Multer.File): Promise<string>;
}
