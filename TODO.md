# Project Run Plan - Agri Compass v3

**Status:** Starting implementation

**Approved Plan Steps:**
## 1. Frontend Setup & Run
- [x] Step 1.1: Create .env with VITE_API_URL=http://localhost:8080
- [x] Step 1.2: npm install (ensure deps)
- [x] Step 1.3: npm run dev (start Vite server ~port 5173 - ACTIVE)

## 2. Backend Setup & Run
- [x] Step 2.1: Update agri-compass-api/src/main/resources/application.properties with user's API keys
- [ ] Step 2.2: Manual: cd agri-compass-api && apache-maven-3.9.6/bin/mvn.cmd spring-boot:run (Windows shell issue)
- [ ] Step 2.3: Verify API endpoints (e.g., http://localhost:8080/api/health or logs)

## 3. Verification
- [x] Step 3.1: Frontend at http://localhost:5173/


## 3. Verification
- [ ] Step 3.1: Open http://localhost:5173
- [ ] Step 3.2: Test key pages (Dashboard, Weather, Market Prices, AI Agent)
- [ ] Step 3.3: Check TODO.md updates

**Notes:**
- Backend uses SQLite (agricompass.db auto-creates).
- User has API keys; will ask for them to update properties.
- Windows: use mvnw.cmd

**Next:** Create .env, then npm run dev.

