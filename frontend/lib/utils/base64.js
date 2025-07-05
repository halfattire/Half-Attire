/**
 * Convert file to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 string representation of the file
 */
export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Convert multiple files to base64 strings
 * @param {File[]} files - Array of files to convert
 * @returns {Promise<string[]>} - Array of base64 strings
 */
export const convertMultipleToBase64 = async (files) => {
  const promises = files.map(file => convertToBase64(file))
  return Promise.all(promises)
}

/**
 * Validate image file
 * @param {File} file - The file to validate
 * @param {number} maxSize - Maximum file size in bytes (default: 5MB)
 * @returns {boolean} - Whether the file is valid
 */
export const validateImageFile = (file, maxSize = 5 * 1024 * 1024) => {
  if (!file) return false
  if (!file.type.startsWith('image/')) return false
  if (file.size > maxSize) return false
  return true
}
