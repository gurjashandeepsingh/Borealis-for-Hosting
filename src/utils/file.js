import { v4 as uuidv4 } from "uuid";
import { S3 } from "@aws-sdk";

const compressImage = async (image) => {
  const metadata = await sharp(image).metadata();
  let qualityPercentage = 4;
  if (metadata.size) {
    const fileSizeInKb = metadata.size / 1024;
    qualityPercentage =
      (100 * 100) / fileSizeInKb > 4 ? (100 * 100) / fileSizeInKb : 4;
  }
  qualityPercentage = qualityPercentage > 100 ? 100 : qualityPercentage;
  const updatedWidth =
    metadata.width && metadata.width > 1000 ? 1000 : metadata.width;

  const webp = await sharp(image)
    .toFormat("webp", { quality: parseInt(qualityPercentage.toFixed(0), 10) })
    .resize({ fastShrinkOnLoad: true, width: updatedWidth })
    .toBuffer();
  return webp;
};

const uploadImage = async (data) => {
  const image = Buffer.from(data, "utf-8");
  const compressedImage = await compressImage(image);
  const s3 = new S3({
    accessKeyId: Config.AWS_ACCESS_KEY_ID,
    region: Config.AWS_S3_REGION,
    secretAccessKey: Config.AWS_SECRET_KEY_ID,
  });
  const uploadedImage = await s3
    .upload({
      ACL: "public-read",
      Body: compressedImage,
      Bucket: Config.AWS_S3_BUCKET,
      ContentType: "image/webp",
      Key: `${uuidv4()}.webp`,
    })
    .promise();
  return uploadedImage.Location;
};
