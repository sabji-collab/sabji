# Sobji Haat Backend API

Node.js/Express backend API for Sobji Haat vegetable marketplace.

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sobjihaat
JWT_SECRET=sobjihaat_secret_key_2025
```

## Running

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## Deployment to Railway

1. Connect your GitHub repository to Railway
2. Add environment variables in Railway dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
3. Railway will automatically detect and deploy

## API Documentation

See main README.md for API endpoint documentation.

