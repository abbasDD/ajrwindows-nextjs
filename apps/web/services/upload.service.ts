import { Buckets } from "@/constant/constant";
import { createClient } from "@/lib/supabase/client";
import { decode } from "base64-arraybuffer";

class UploadService {
  private static instance: UploadService;
  private supabase = createClient();

  public static getInstance(): UploadService {
    if (!UploadService.instance) UploadService.instance = new UploadService();
    return UploadService.instance;
  }

  public async uploadFile(
    file: File,
    bucket: (typeof Buckets)[keyof typeof Buckets],
    path: string,
  ): Promise<string | null> {
    if (!file) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        upsert: false,
      });
    if (error) throw error;

    const { data: urlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    return urlData.publicUrl;
  }
  public async uploadBase64OrReturnUrl(
    imageString: string,
    bucketName: (typeof Buckets)[keyof typeof Buckets],
    path: string,
  ): Promise<string> {
    if (!imageString.startsWith("data:image")) {
      return imageString;
    }

    try {
      const base64Data = imageString?.split(",")[1];
      const contentType = imageString?.split(";")[0]?.split(":")[1];
      const fileName = `${crypto.randomUUID()}.png`;
      const filePath = `${path}/${fileName}`;
      const { error } = await this.supabase.storage
        .from(bucketName)
        .upload(filePath, decode(base64Data as string), {
          contentType,
          upsert: false,
        });
      if (error) throw error;
      const { data: urlData } = this.supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      return urlData.publicUrl;
    } catch (err) {
      console.error("Upload failed, returning original string:", err);
      return imageString;
    }
  }
  public async deleteFile(
    bucket: (typeof Buckets)[keyof typeof Buckets],
    filePath: string,
  ) {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([filePath]);
    if (error) throw error;
  }
}
export const bucket = UploadService.getInstance();
