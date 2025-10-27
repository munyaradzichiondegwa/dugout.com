# Dugout App - AI Agent Instructions

## Project Architecture

This is a full-stack food ordering application with the following major components:

- Frontend: React + Vite application (in `/src`)
  - Uses Context API for state management (`src/context/`)
  - Custom hooks for auth, cart, and wallet functionality (`src/hooks/`)
  - Component-based architecture with shared components in `src/components/`
  - Services layer for API communication (`src/services/`)

- Backend: Express.js REST API (in `/backend`)
  - MVC architecture with controllers, models, and routes
  - MongoDB database (configured in `backend/config/database.js`)
  - JWT-based authentication
  - Middleware for auth, validation, and error handling

## Key Development Workflows

1. Running the application:
   ```bash
   # Frontend (root directory)
   npm run dev  # Starts Vite dev server

   # Backend (/backend directory)
   npm run dev  # Starts nodemon for auto-reloading
   ```

2. API Communication:
   - All API calls go through `src/services/api.js`
   - Base URL configured via `VITE_API_BASE_URL` environment variable
   - Automatically handles auth headers and error responses

## Project Conventions

1. Authentication:
   - JWT tokens stored as 'dugout_token' in localStorage
   - Protected routes use `middleware/auth.js`
   - Auth state managed through `AuthContext`

2. Error Handling:
   - Backend: Centralized error handler in `backend/middleware/errorHandler.js`
   - Frontend: API errors caught and handled in service layer

3. Data Flow:
   - Frontend state management via Context API
   - Services layer abstracts API communication
   - Controllers handle business logic
   - Models define data structure and validation

## Integration Points

1. External Services:
   - Twilio for OTP (configured in `backend/utils/sendOTP.js`)
   - MongoDB (connection string in environment variables)

2. Cross-Component Communication:
   - Context API for global state (`AuthContext`, `CartContext`)
   - Custom hooks for reusable logic
   - Event-based communication for real-time updates

## Common Tasks

1. Adding new API endpoints:
   1. Create route in `backend/routes/`
   2. Implement controller in `backend/controllers/`
   3. Add model if needed in `backend/models/`
   4. Add corresponding service in `src/services/`

2. Adding new features:
   1. Create components in `src/components/`
   2. Add routes in frontend if needed
   3. Implement necessary API endpoints
   4. Add context/hooks if needed for state management

## Environment Setup

Required environment variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT signing
- `TWILIO_ACCOUNT_SID`: Twilio account SID
- `TWILIO_AUTH_TOKEN`: Twilio auth token
- `VITE_API_BASE_URL`: Backend API URL for frontend