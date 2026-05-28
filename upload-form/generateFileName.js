const crypto = require('crypto');
const path = require('path');

/**
 * Generates a unique filename for uploaded files
 * @param {string} originalName - The original filename
 * @returns {string} - A unique filename with timestamp and random hash
 */
function generateFileName(originalName) {
  // Get file extension
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  
  // Generate timestamp
  const timestamp = Date.now();
  
  // Generate random hash
  const randomHash = crypto.randomBytes(8).toString('hex');
  
  // Create sanitized base name (remove special characters)
  const sanitizedBaseName = baseName
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toLowerCase()
    .substring(0, 50); // Limit length
  
  // Combine all parts
  const fileName = `${sanitizedBaseName}_${timestamp}_${randomHash}${ext}`;
  
  return fileName;
}

/**
 * Generates a simple unique filename with just timestamp and hash
 * @param {string} originalName - The original filename
 * @returns {string} - A simple unique filename
 */
function generateSimpleFileName(originalName) {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const randomHash = crypto.randomBytes(4).toString('hex');
  
  return `file_${timestamp}_${randomHash}${ext}`;
}

/**
 * Generates a filename preserving original name with uniqueness
 * @param {string} originalName - The original filename
 * @returns {string} - Filename with preserved original name
 */
function generatePreservedFileName(originalName) {
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  const timestamp = Date.now();
  
  // Sanitize the original name
  const sanitizedName = baseName
    .replace(/[^a-zA-Z0-9\-_]/g, '_')
    .toLowerCase();
  
  return `${sanitizedName}_${timestamp}${ext}`;
}

module.exports = generateFileName;
module.exports.generateSimpleFileName = generateSimpleFileName;
module.exports.generatePreservedFileName = generatePreservedFileName;
