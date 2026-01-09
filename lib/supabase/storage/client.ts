import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";
import { getSupabaseBrowserClient } from "../browser-client";

type UploadResponse = {
  imageUrl: string;
  error: string;
};

type UploadArgs = {
  file: File;
  bucket: string;
  folder?: string;
};

async function getStorage() {
  const supabase = await getSupabaseBrowserClient();
  return supabase.storage;
}

export async function uploadImage({
  file,
  bucket,
  folder,
}: UploadArgs): Promise<UploadResponse> {
  const fileName = file.name;
  const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1);
  const path = `${folder ? folder + "/" : ""}${uuidv4()}.${fileExtension}`;

  let compressedFile: File | Blob = file;

  try {
    compressedFile = await imageCompression(file, {
      maxSizeMB: 1,
    });
  } catch (error) {
    console.error(error);
    return { imageUrl: "", error: "Image compression failed" };
  }

  const storage = await getStorage();

  const { data, error } = await storage
    .from(bucket)
    .upload(path, compressedFile);

  if (error) {
    return { imageUrl: "", error: "Image upload failed" };
  }

  const imageUrl = `${process.env
    .NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${
    data?.path
  }`;

  return { imageUrl, error: "" };
}
