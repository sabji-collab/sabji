# Sobji Haat - Full Stack Vegetable Marketplace

A full-stack vegetable marketplace application with backend API and frontend interface.

## Project Structure

```
├── backend/          # Node.js/Express backend API
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   └── railway.json  # Railway deployment config
├── frontend/         # Frontend files
│   └── js/          # JavaScript files
│       ├── api.js    # API utility functions
│       └── config.js # Configuration
├── index.html       # Main frontend file
└── vercel.json      # Vercel deployment config
```

## Setup Instructions

### Backend Setup (Railway)

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

3. **Deploy to Railway**
   - Push your code to GitHub
   - Connect your repository to Railway
   - Add environment variables in Railway dashboard:
     - `MONGODB_URI`: Your MongoDB connection string (use MongoDB Atlas for cloud database)
     - `JWT_SECRET`: A secure random string
   - Railway will automatically detect and deploy

4. **Get Railway URL**
   - After deployment, copy your Railway app URL (e.g., `https://your-app.railway.app`)
   - Update the API URL in `index.html` (line ~3817):
     ```javascript
     window.API_BASE_URL = 'https://your-app.railway.app/api';
     ```

### Frontend Setup (Vercel)

1. **Update API URL**
   - Open `index.html`
   - Find the script tag near the end (around line 3817)
   - Update `window.API_BASE_URL` with your Railway backend URL

2. **Deploy to Vercel**
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel` in the project root
   - Or connect your GitHub repository to Vercel dashboard
   - Vercel will automatically deploy

## Features

- **Product Management**: Add, edit, delete products with categories
- **Order Management**: Place orders, track order status
- **Stock Management**: Real-time stock updates
- **Admin Panel**: Full admin dashboard for managing products, settings, and orders
- **Pincode Management**: Configure delivery charges by pincode
- **WhatsApp Integration**: Orders sent to WhatsApp for confirmation

## API Endpoints

### Products
- `GET /api/products` - Get all products (optional: `?category=indian`)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `PUT /api/products/:id/stock` - Update stock (Admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/:id` - Get order by ID (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### Business Info
- `GET /api/business-info` - Get business information
- `PUT /api/business-info` - Update business info (Admin only)

### Admin
- `POST /api/admin/login` - Admin login

## Default Admin Credentials

- Username: `admin`
- Password: `sobjihaat2025`

**Important**: Change the default password after first login in production!

## MongoDB Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Add it to Railway environment variables as `MONGODB_URI`

## Development

### Run Backend Locally
```bash
cd backend
npm install
npm run dev  # Uses nodemon for auto-reload
```

### Run Frontend Locally
- Use any static file server or open `index.html` directly
- Make sure to update `API_BASE_URL` to `http://localhost:5000/api` for local development

## Notes

- The backend automatically initializes with default products and business info on first run
- All admin operations require authentication token
- Orders are saved to database and also sent via WhatsApp
- Stock updates are reflected in real-time

