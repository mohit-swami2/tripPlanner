const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

let client;

const requiredEnv = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'AWS_BUCKET_NAME',
];

const isS3Configured = () =>
  requiredEnv.every((key) => Boolean(process.env[key]?.trim()));

const getS3Client = () => {
  if (!isS3Configured()) return null;
  if (!client) {
    client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return client;
};

const getBucketName = () => process.env.AWS_BUCKET_NAME;

const getPresignedUrlExpirySeconds = () =>
  Number(process.env.AWS_PRESIGNED_URL_EXPIRES_SECONDS) || 3600;

const uploadObject = async (key, body, contentType) => {
  const s3 = getS3Client();
  if (!s3) throw new Error('S3 is not configured');

  await s3.send(
    new PutObjectCommand({
      Bucket: getBucketName(),
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return key;
};

const getPresignedGetUrl = async (key) => {
  const s3 = getS3Client();
  if (!s3) throw new Error('S3 is not configured');

  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: getBucketName(),
      Key: key,
    }),
    { expiresIn: getPresignedUrlExpirySeconds() }
  );
};

const deleteObject = async (key) => {
  const s3 = getS3Client();
  if (!s3) return;

  await s3.send(
    new DeleteObjectCommand({
      Bucket: getBucketName(),
      Key: key,
    })
  );
};

const verifyBucketAccess = async () => {
  const s3 = getS3Client();
  if (!s3) {
    return { ok: false, message: 'Missing AWS environment variables' };
  }

  await s3.send(new HeadBucketCommand({ Bucket: getBucketName() }));
  return { ok: true, bucket: getBucketName(), region: process.env.AWS_REGION };
};

module.exports = {
  isS3Configured,
  uploadObject,
  getPresignedGetUrl,
  deleteObject,
  verifyBucketAccess,
};
