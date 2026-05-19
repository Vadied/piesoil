import { Storage } from '@google-cloud/storage'

// Lazily initialised so module import does not fail when GCS credentials are
// absent (e.g. during `next build` in CI without service-account key files).
let _storage: Storage | null = null

function getStorage(): Storage {
  if (!_storage) {
    _storage = new Storage()
  }
  return _storage
}

function getBucketName(): string {
  const name = process.env.GCS_BUCKET_NAME
  if (!name) {
    throw new Error('GCS_BUCKET_NAME environment variable is required')
  }
  return name
}

/**
 * Upload a file buffer to GCS and return the public HTTPS URL.
 *
 * The bucket must be configured with uniform public read access
 * (allUsers: roles/storage.objectViewer) so the returned URL is directly
 * accessible without a signed URL.
 */
export async function uploadFile(
  filename: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const bucketName = getBucketName()
  const file = getStorage().bucket(bucketName).file(filename)
  await file.save(buffer, { contentType, resumable: false })
  return `https://storage.googleapis.com/${bucketName}/${filename}`
}

/**
 * Delete a file from GCS. Resolves silently if the file does not exist.
 */
export async function deleteFile(filename: string): Promise<void> {
  const file = getStorage().bucket(getBucketName()).file(filename)
  await file.delete({ ignoreNotFound: true })
}
