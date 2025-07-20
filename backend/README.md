# Guinea Exam Insights - Backend Setup & API Documentation

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Build the Project
```bash
npm run build
```

### 3. Import Data (Optional)
```bash
npm run import-data
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## 📊 API Endpoints

### Health Check
- **GET** `/health` - Check if the server is running

### Exam Results
- **GET** `/api/exam/results` - Get exam results with filters
  - Query Parameters:
    - `year` (number): Exam year (e.g., 2025)
    - `examType` (string): Exam type (e.g., "BEPC")
    - `region` (string): Region filter
    - `school` (string): School name filter
    - `mention` (string): Mention filter (TBIEN, BIEN, ABIEN, PASSABLE)
    - `searchQuery` (string): Search query
    - `searchType` (string): Search type (name, pv, school)
    - `limit` (number): Results per page (default: 100)
    - `offset` (number): Pagination offset (default: 0)

### Statistics
- **GET** `/api/exam/stats/dashboard` - Get dashboard statistics
  - Required: `year`, `examType`
- **GET** `/api/exam/stats/regions` - Get regional statistics
  - Required: `year`, `examType`
- **GET** `/api/exam/stats/schools` - Get school statistics
  - Required: `year`, `examType`
  - Optional: `region`

### Metadata
- **GET** `/api/exam/metadata/years` - Get available years
- **GET** `/api/exam/metadata/exam-types` - Get available exam types
- **GET** `/api/exam/metadata/regions` - Get available regions
  - Optional: `year`, `examType`

## 📁 Project Structure

```
backend/
├── src/
│   ├── database/
│   │   ├── database.ts      # Database connection manager
│   │   └── schema.ts        # TypeScript interfaces
│   ├── routes/
│   │   └── examRoutes.ts    # API route handlers
│   ├── services/
│   │   └── examService.ts   # Business logic
│   ├── utils/
│   │   └── csvImporter.ts   # CSV data import utility
│   ├── scripts/
│   │   ├── importData.ts    # Data import script
│   │   └── testDatabase.ts  # Database test script
│   └── server.ts            # Main server file
├── data/                    # CSV data files
├── dist/                    # Compiled JavaScript
└── package.json
```

## 🔧 Configuration

The application uses SQLite for the database. The database file is created automatically at:
`backend/data/exams.db`

## 📝 Sample API Calls

### Get Dashboard Stats
```bash
curl "http://localhost:3001/api/exam/stats/dashboard?year=2025&examType=BEPC"
```

### Search for Students
```bash
curl "http://localhost:3001/api/exam/results?year=2025&examType=BEPC&searchQuery=DIALLO&searchType=name&limit=10"
```

### Get Regional Statistics
```bash
curl "http://localhost:3001/api/exam/stats/regions?year=2025&examType=BEPC"
```

## 🐛 Troubleshooting

### Database Issues
- Make sure the `backend/data/` directory exists
- Check file permissions for SQLite database
- Run the test script: `npx ts-node src/scripts/testDatabase.ts`

### Import Issues
- Verify CSV file format matches expected headers
- Check file path in import script
- Ensure sufficient disk space for SQLite database

### Server Issues
- Check if port 3001 is available
- Verify all dependencies are installed
- Check console for detailed error messages

## 📊 Data Format

The CSV import expects the following column structure:
- IRE (Region)
- Rang (Rank)
- ex (Ex-aequo marker: X or empty)
- Prénoms et Noms (Student name)
- Centre (Exam center)
- PV (PV Number)
- Origine (School origin)
- Mention (Grade: TBIEN, BIEN, ABIEN, PASSABLE)

## 🔗 Integration with Frontend

The backend is designed to work with the React frontend. Set the API base URL in your frontend to:
`http://localhost:3001/api`

CORS is configured to allow requests from:
- `http://localhost:8081` (Vite dev server)
- `http://localhost:5173` (Vite alternative port)
- `http://localhost:3000` (Create React App)
