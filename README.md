# Social Media Portal

A simple full-stack starter project for managing multiple brand social handles with separate agency and client logins. The backend is built with Express and uses a JSON file database for simplicity. The frontend is a React app powered by Vite.

## Features
- User registration and login with JWT authentication
- Agency and client account types
- Role support: admin, editor, developer, viewer
- Agency users can create brands and assign clients
- Clients can view only their own brands

## Development

### Backend
```
cd backend
npm install
npm start
```
The API server runs on http://localhost:3000.

### Frontend
```
cd frontend
npm install
npm run dev
```
The web app runs on http://localhost:5173 and proxies API requests to the backend.

## Testing
Both subprojects provide a placeholder `npm test` script:
```
cd backend && npm test
cd frontend && npm test
```
