import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const s3Client = new S3Client({
    region: process.env.PRIVATE_AWS_REGION || "",
    credentials: {
      accessKeyId: process.env.PRIVATE_AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.PRIVATE_AWS_SECRET_ACCESS_KEY || "",
    },
  });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
      return NextResponse.json({ success: false, error: 'No file provided or file is empty' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const date = Math.floor(new Date().getTime() / 1000)
    const url = `${process.env.PRIVATE_AWS_CLOUDFRONT_URL}/dev/${date}_${file.name.trim().toLowerCase().replace(/ /g, '_')}`;

    const params = {
      Bucket: process.env.PRIVATE_AWS_BUCKET_NAME || "",
      Key: `dev/${date}_${file.name.trim().toLowerCase().replace(/ /g, '_')}`,
      Body: buffer,
      ContentType: file.type,
    };

    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);

    return NextResponse.json({ success: true, data: response, url }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'An unknown error occurred' }, { status: 500 });
  }
}
