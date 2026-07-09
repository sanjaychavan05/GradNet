import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3Service.js";
import crypto from "crypto";

export async function uploadToS3({ buffer, mimetype, folder, originalName }) {
  const ext = originalName.split(".").pop();
  const key = `${folder}/${crypto.randomUUID()}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimetype
    })
  );

  return key;
}
