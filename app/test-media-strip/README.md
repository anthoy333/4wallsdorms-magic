# MediaStrip Logic Tests

## How to Run the Tests

### Option 1: Browser Test Page (Easiest) ✅

1. **Make sure your dev server is running:**
   ```bash
   npm run dev
   ```

2. **Open your browser and go to:**
   ```
   http://localhost:3000/test-media-strip
   ```

3. **Click the "Run All Tests" button**

4. **View the results** - You'll see:
   - ✅ or ❌ for each test
   - Detailed console output
   - Summary of all tests

### Option 2: Browser Console

1. **Open your browser's developer console** (F12)
2. **Navigate to any page** (like http://localhost:3000)
3. **In the console, type:**
   ```javascript
   import('/app/utils/__tests__/mediaStripLogic.test').then(m => m.runAllTests())
   ```

## What Gets Tested

- ✅ **Orientation Classification** - Tests that images are correctly classified as LANDSCAPE, PORTRAIT, or SQUAREISH
- ✅ **Cover Tile Selection** - Tests that plaque tiles are selected as cover, with proper fallbacks
- ✅ **Tile Sorting** - Tests that tiles are sorted correctly (cover first, then by priority)
- ✅ **Size Determination** - Tests that tile sizes are set correctly based on orientation and cover status

## Expected Results

All tests should pass ✅. If any fail, check:
- The test output for specific error messages
- The logic in `app/utils/mediaStripLogic.ts` and `app/utils/mediaOrientation.ts`
- Make sure all imports are correct

