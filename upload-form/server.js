const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const generateFileName = require('./generateFileName');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const fileName = generateFileName(file.originalname);
    cb(null, fileName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit (increased from 10MB)
  },
  fileFilter: function (req, file, cb) {
    // Add file type restrictions if needed
    cb(null, true);
  }
});

// Google Sheets Configuration
const auth = new google.auth.GoogleAuth({
  keyFile: '../google-service-account.json', // Path to your service account file
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Define the sheet ID and range - UPDATE THESE WITH YOUR ACTUAL VALUES
const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1zjHHZAMFuwY9tE2HQAAE6RzqHw-9u0KodX0A5IqbdOM'; // Get this from your Sheet URL
const RANGE = 'Sheet1!A1'; // Adjust based on your sheet layout

// Function to append data to Google Sheets
async function appendToSheet(dataArray) {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE,
      valueInputOption: 'RAW',
      resource: {
        values: [dataArray],
      },
    });
    
    console.log('✅ Data successfully appended to Google Sheets');
  } catch (error) {
    console.error('❌ Error appending to Google Sheets:', error);
    throw error;
  }
}

// Test route
app.get('/test', (req, res) => {
  console.log('🧪 Test route hit');
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Routes
app.post('/upload', upload.any(), async (req, res) => {
  console.log('📥 Received a POST request to /upload');
  console.log('📋 Request body:', req.body);
  console.log('📁 Request files:', req.files);
  console.log('🔍 Request headers:', req.headers);
  
  try {
    if (!req.files || req.files.length === 0) {
      console.log('❌ No files uploaded');
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      path: file.path
    }));

    // Prepare data for Google Sheets
    const timestamp = new Date().toISOString();
    const sheetData = [
      timestamp, // Column A: Timestamp
      req.body.schoolName || '', // Column B: School Name
      req.body.campusName || '', // Column C: Campus Name
      req.body.dormBuilding || '', // Column D: Dorm/Building
      req.body.floor || '', // Column E: Floor
      req.body.year || '', // Column F: Year
      req.body.subRoomNumber || '', // Column G: Room Number
      req.body.primaryRoomNumber || '', // Column H: Primary Room Number
      req.body.subRoomOccupants || '', // Column I: Room Occupants
      req.body.primaryRoomOccupants || '', // Column J: Primary Room Occupants
      req.body.studentEmail || '', // Column K: Student Email
      req.body.privateBathroomCount || '', // Column L: Private Bathroom Count
      req.body.hasCommonSpace || '', // Column M: Has Common Space
      req.body.hasPrivateKitchen || '', // Column N: Has Private Kitchen
      req.body.hasPublicBathroom || '', // Column O: Has Public Bathroom
      req.body.hasPublicCommonSpace || '', // Column P: Has Public Common Space
      req.body.hasPublicKitchen || '', // Column Q: Has Public Kitchen
      req.body.hasPublicGameRoom || '', // Column R: Has Public Game Room
      req.body.amenities || '', // Column S: Amenities
      req.body.comments || '', // Column T: Comments
      uploadedFiles.length.toString(), // Column U: Number of Files
      uploadedFiles.map(f => f.filename).join(', ') // Column V: File Names
    ];

    // Try to append to Google Sheets (don't fail the upload if this fails)
    try {
      await appendToSheet(sheetData);
      console.log('📊 Data saved to Google Sheets');
    } catch (sheetsError) {
      console.error('⚠️ Google Sheets error (upload still successful):', sheetsError);
      // Don't throw the error - just log it and continue
    }

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles,
      sheetsSaved: true
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.post('/upload/multiple', upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      path: file.path
    }));

    res.json({
      message: 'Files uploaded successfully',
      files: files
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.log('🚨 Error occurred:', error);
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      console.log('❌ File too large:', error.message);
      return res.status(400).json({ 
        error: 'File too large', 
        details: 'Maximum file size is 50MB',
        code: 'FILE_TOO_LARGE'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      console.log('❌ Unexpected file field:', error.message);
      return res.status(400).json({ 
        error: 'Unexpected file field', 
        details: error.message,
        code: 'UNEXPECTED_FILE'
      });
    }
  }
  console.log('❌ General error:', error.message);
  res.status(500).json({ 
    error: 'Something went wrong', 
    details: error.message 
  });
});

app.listen(PORT, () => {
  console.log(`Upload server running on port ${PORT}`);
});
