import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

/**
 * Save uploaded file to local public directory
 * For production, replace this with cloud storage (S3, R2, etc.)
 */
export async function saveFileLocally(
  file: File,
  type: 'medical-records' | 'prescriptions'
): Promise<string> {
  try {
    // Read file as array buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}-${originalName}`

    // Define paths
    const uploadDir = join(process.cwd(), 'public', 'uploads', type)
    const filepath = join(uploadDir, filename)

    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Write file to disk
    await writeFile(filepath, buffer)

    // Return public URL
    return `/uploads/${type}/${filename}`
  } catch (error) {
    console.error('Error saving file:', error)
    throw new Error('Failed to save file')
  }
}

/**
 * Save multiple files
 */
export async function saveFilesLocally(
  files: File[],
  type: 'medical-records' | 'prescriptions'
): Promise<string[]> {
  const urls: string[] = []
  
  for (const file of files) {
    const url = await saveFileLocally(file, type)
    urls.push(url)
  }
  
  return urls
}

