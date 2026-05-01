import { apiUpload } from '../httpClient'

export class UploadAPI {
  /**
   * Universal method to upload a media file (Image/Video) to the Spring Boot backend
   * The Spring Boot endpoint should expect a MultipartFile part named "file"
   */
  static async uploadMedia(file: File, folder: string = 'general'): Promise<{ url: string }> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      
      return await apiUpload('/api/upload', formData)
    } catch (error) {
      console.error('Error uploading media:', error)
      throw error
    }
  }

  /**
   * Helper method to upload multiple files concurrently
   */
  static async uploadMultipleMedia(files: File[], folder: string = 'general'): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadMedia(file, folder))
    const results = await Promise.all(uploadPromises)
    return results.map(res => res.url)
  }
}
