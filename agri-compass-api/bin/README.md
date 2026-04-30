# Agri Compass API - Spring Boot Backend

This is the Spring Boot REST API backend for the Agri Compass project.

## Stack
- **Java 17** + **Spring Boot 3.4**
- **Spring Security + OAuth2 Resource Server** (Clerk JWT validation)
- **Spring Data JPA** + **SQLite** (Turso-compatible)
- **Lombok** for boilerplate reduction

## Prerequisites
1. **Java 17+** installed (e.g., from [Adoptium](https://adoptium.net/))
2. **Maven 3.9+** installed (or use the included `mvnw` wrapper)
3. A **Clerk** account with a published app

## Configuration

Edit `src/main/resources/application.properties` and fill in:

```properties
# Replace with your Clerk domain (from your Clerk Dashboard → API Keys)
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=https://your-app.clerk.accounts.dev/.well-known/jwks.json

# CORS: add your Vercel URL when deployed
cors.allowed-origins=http://localhost:5173,https://your-app.vercel.app
```

## Running Locally

```bash
# Option 1: Using Maven directly (if Maven is installed)
mvn spring-boot:run

# Option 2: Using Maven Wrapper (no Maven installation needed)
./mvnw spring-boot:run    # Mac/Linux
mvnw.cmd spring-boot:run  # Windows
```

The API will start at `http://localhost:8080`

## Project Structure

```
src/main/java/com/agricompass/api/
├── AgriCompassApiApplication.java  ← Main entry point
├── config/
│   ├── SecurityConfig.java         ← Clerk JWT + CORS
│   └── WebConfig.java              ← Static file serving
├── controller/
│   ├── PostController.java         ← /api/posts
│   ├── FarmController.java         ← /api/farms
│   ├── ProfileController.java      ← /api/profiles
│   ├── UploadController.java       ← /api/upload (MultipartFile)
│   ├── AiController.java           ← /api/ai/chat
│   └── DataController.java         ← /api/market-prices, /api/schemes, /api/crops, /api/weather
├── entity/                         ← JPA entities (auto-create DB tables)
└── repository/                     ← Spring Data JPA repositories
```

## File Uploads

Files upload to `POST /api/upload` with `multipart/form-data`.  
In **development**, files are saved to the `uploads/` folder locally.  
For **production**, uncomment the S3 block in `UploadController.java`.

## Deploying to Production

Options for hosting your Spring Boot API:
- **Railway** (easiest - free tier available)
- **Render** (free tier, good for hobby projects)
- **AWS Elastic Beanstalk** (great for resume)
- **Google Cloud Run** (serverless, scales to zero)

After deploying, set your Vercel frontend's `VITE_API_URL` to your hosted API URL.
