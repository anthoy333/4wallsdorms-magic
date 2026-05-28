# Google Sheets Integration Setup

## 🔧 Configuration Required

### 1. Get Your Google Sheet ID
1. Create a new Google Sheet or use an existing one
2. Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`
3. Replace `your_google_sheet_id_here` in the server.js file with your actual Sheet ID

### 2. Set Up Environment Variables (Optional)
Create a `.env` file in the upload-form directory:
```
GOOGLE_SHEET_ID=your_actual_sheet_id_here
PORT=3001
```

### 3. Share Your Google Sheet
1. Open your Google Sheet
2. Click "Share" button
3. Add the service account email: `sheets-access@wallsdorms-sheets-integration.iam.gserviceaccount.com`
4. Give it "Editor" permissions

## 📊 Data Structure

The server will automatically create columns with this structure:
- **A**: Timestamp
- **B**: School Name
- **C**: Campus Name
- **D**: Dorm/Building
- **E**: Floor
- **F**: Year
- **G**: Room Number
- **H**: Primary Room Number
- **I**: Room Occupants
- **J**: Primary Room Occupants
- **K**: Student Email
- **L**: Private Bathroom Count
- **M**: Has Common Space
- **N**: Has Private Kitchen
- **O**: Has Public Bathroom
- **P**: Has Public Common Space
- **Q**: Has Public Kitchen
- **R**: Has Public Game Room
- **S**: Amenities
- **T**: Comments
- **U**: Number of Files
- **V**: File Names

## 🚀 Testing

1. Start your server: `npm start`
2. Test the connection: `http://localhost:3001/test`
3. Submit a form to see data appear in your Google Sheet

## 🔒 Security Notes

- The `google-service-account.json` file is already in `.gitignore`
- Never commit your Google Sheet ID to version control
- Keep your service account credentials secure
