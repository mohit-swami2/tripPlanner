/**
 * Verifies S3 bucket access and a test upload under UPLOAD_PATH (e.g. uploads2/).
 * Usage: node scripts/verifyS3.js
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const crypto = require('crypto');
const { verifyBucketAccess, uploadObject, getPresignedGetUrl, deleteObject } = require('../src/shared/services/s3');
const { getUploadPrefix } = require('../src/shared/utils/fileUrl');

const run = async () => {
  console.log('Checking S3 configuration...');

  const head = await verifyBucketAccess();
  if (!head.ok) {
    console.error('S3 check failed:', head.message);
    process.exit(1);
  }

  console.log('Bucket accessible:', head.bucket, `(${head.region})`);

  const prefix = getUploadPrefix();
  const testKey = `${prefix}/verify-${Date.now()}-${crypto.randomUUID()}.txt`;
  const body = Buffer.from('tripPlanner-s3-verify');

  await uploadObject(testKey, body, 'text/plain');
  console.log('Test upload OK:', testKey);

  const url = await getPresignedGetUrl(testKey);
  console.log('Presigned URL generated (expires per AWS_PRESIGNED_URL_EXPIRES_SECONDS)');

  await deleteObject(testKey);
  console.log('Test object deleted');

  console.log('\nS3 setup is working. Object prefix:', prefix + '/');
  console.log('Sample presigned URL:', url.slice(0, 80) + '...');
};

run().catch((err) => {
  console.error('S3 verification failed:', err.message || err);
  process.exit(1);
});
