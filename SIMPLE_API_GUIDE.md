# Simple API Guide - Propzy Backend

## Base URL
```
http://localhost:5000
```

---

## 🔐 Authentication

### 1. User Register
**POST** `/api/users/register`

```json
{
  "email": "user@example.com",
  "password": "password123",
  "userName": "John Doe",
  "phone": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "userName": "John Doe",
    "role": "user"
  }
}
```

---

### 2. User Login
**POST** `/api/users/login`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "userName": "John Doe",
    "role": "user"
  }
}
```

---

### 3. Admin Login
**POST** `/api/auth/admin/login`

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin login successful",
  "token": "jwt_token_here",
  "admin": {
    "id": 1,
    "email": "admin@example.com",
    "userName": "Admin",
    "role": "admin"
  }
}
```

---

## 🏠 Property Management (User)

**Note:** All property endpoints require authentication header:
```
Authorization: Bearer your_jwt_token
```

### 4. Create Property
**POST** `/api/properties/create`

**Content-Type:** `multipart/form-data`

**Form Data:**
```javascript
{
  // Basic Details
  "purpose": "Sell",
  "propertyType": "Residential",
  "propertySubType": "Independent House / Villa",

  // Location
  "city": "Kolkata South",
  "locality": "Goragacha",
  "subLocality": "",
  "apartment": "",

  // Property Details
  "bedrooms": "2",
  "bathrooms": "2",
  "balconies": "1",
  "plotArea": "12000",
  "areaUnit": "sq.ft.",
  "totalFloors": "2",
  "availabilityStatus": "Ready to move",
  "propertyAge": "1-5 years",
  "ownership": "Freehold",

  // Price
  "expectedPrice": "5000000",
  "pricePerSqFt": "416",
  "priceNegotiable": true,

  // Description
  "propertyDescription": "Beautiful house...",

  // Media (Files)
  "photos": [File, File, ...],  // Multiple images
  "video": File,                 // One video

  // Amenities (JSON Strings)
  "amenities": ["Swimming Pool", "GYM"],
  "furnishing": "Furnished",
  "coveredParking": 1,
  "openParking": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Property posted successfully",
  "property": {
    "id": 1,
    "purpose": "Sell",
    "city": "Kolkata South",
    "status": "pending",
    "photos": ["url1", "url2"],
    "video": "video_url"
  }
}
```

---

### 5. Get All Approved Properties
**GET** `/api/properties`

**Query Params (optional):**
- `?city=Kolkata`
- `?propertyType=Residential`
- `?purpose=Sell`
- `?bedrooms=2`

**Response:**
```json
{
  "success": true,
  "count": 10,
  "properties": [...]
}
```

---

### 6. Get My Properties
**GET** `/api/properties/my`

Returns all properties posted by the logged-in user (all statuses: pending, approved, rejected)

---

### 7. Get Property by ID
**GET** `/api/properties/:propertyId`

Example: `/api/properties/1`

---

### 8. Update Property
**PUT** `/api/properties/:propertyId`

```json
{
  "expectedPrice": "5500000",
  "priceNegotiable": true,
  "propertyDescription": "Updated description"
}
```

---

### 9. Delete Property
**DELETE** `/api/properties/:propertyId`

---

### 10. Search Properties
**GET** `/api/properties/search?query=Kolkata`

---

## 👨‍💼 Admin Endpoints

**Note:** All admin endpoints require admin role token

### 11. Get All Properties (Admin)
**GET** `/api/admin/properties`

Returns all properties regardless of status (pending, approved, rejected)

---

### 12. Approve Property
**PATCH** `/api/admin/properties/:propertyId/approve`

Changes property status to "approved"

---

### 13. Reject Property
**PATCH** `/api/admin/properties/:propertyId/reject`

Changes property status to "rejected"

---

### 14. Delete Property (Admin)
**DELETE** `/api/admin/properties/:propertyId`

---

## 📋 Complete API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/register` | Register new user | ❌ |
| POST | `/api/users/login` | User login | ❌ |
| GET | `/api/users/me` | Get current user | ✅ User |
| PUT | `/api/users/username` | Update username | ✅ User |
| POST | `/api/auth/admin/login` | Admin login | ❌ |
| POST | `/api/properties/create` | Create property | ✅ User |
| GET | `/api/properties` | Get all approved properties | ✅ User |
| GET | `/api/properties/my` | Get my properties | ✅ User |
| GET | `/api/properties/search` | Search properties | ✅ User |
| GET | `/api/properties/:id` | Get property by ID | ✅ User |
| PUT | `/api/properties/:id` | Update property | ✅ User (Owner) |
| DELETE | `/api/properties/:id` | Delete property | ✅ User (Owner) |
| GET | `/api/admin/properties` | Get all properties (admin) | ✅ Admin |
| PATCH | `/api/admin/properties/:id/approve` | Approve property | ✅ Admin |
| PATCH | `/api/admin/properties/:id/reject` | Reject property | ✅ Admin |
| DELETE | `/api/admin/properties/:id` | Delete property (admin) | ✅ Admin |

---

## 🧪 Testing with Postman

### Step 1: Register a User
```
POST http://localhost:5000/api/users/register
Body (JSON):
{
  "email": "test@example.com",
  "password": "test123",
  "userName": "Test User"
}
```
Copy the `token` from response.

### Step 2: Create a Property
```
POST http://localhost:5000/api/properties/create
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
Body (form-data):
  purpose: Sell
  propertyType: Residential
  propertySubType: Independent House / Villa
  city: Kolkata
  locality: Goragacha
  bedrooms: 2
  bathrooms: 2
  expectedPrice: 5000000
  propertyDescription: Beautiful house
  photos: [Upload image files]
```

### Step 3: Admin Login
```
POST http://localhost:5000/api/auth/admin/login
Body (JSON):
{
  "email": "admin@example.com",
  "password": "admin123"
}
```
Copy the admin `token`.

### Step 4: Approve Property (Admin)
```
PATCH http://localhost:5000/api/admin/properties/1/approve
Headers:
  Authorization: Bearer ADMIN_TOKEN_HERE
```

---

## ⚙️ Environment Variables

Create `.env` file:
```env
# Database
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=propzy_db
DB_PORT=5432

# JWT
JWT_SECRET=your_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
```

---

## 🚀 Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Create database:**
```sql
CREATE DATABASE propzy_db;
```

3. **Create .env file** (see above)

4. **Start server:**
```bash
npm start
```

Server runs at: `http://localhost:5000`

---

## 📦 Features

✅ User registration and login
✅ Admin login
✅ Property posting with images/videos
✅ Property approval system (pending → approved/rejected)
✅ Search and filter properties
✅ User can manage their own properties
✅ Admin can manage all properties

---

## 🔑 Default Admin Account

**Important:** Create an admin user manually in the database:

```sql
INSERT INTO "Users" (email, password, "userName", role, "isActive", "createdAt", "updatedAt")
VALUES (
  'admin@propzy.com',
  '$2b$10$YourHashedPasswordHere',  -- Use bcrypt to hash password
  'Admin',
  'admin',
  true,
  NOW(),
  NOW()
);
```

Or use this Node.js script to generate password hash:
```javascript
const bcrypt = require('bcrypt');
const hash = bcrypt.hashSync('admin123', 10);
console.log(hash);
```

---

## 📝 Notes

- All properties start with `status: "pending"`
- Only admin can approve/reject properties
- Users can only see approved properties (except their own)
- Property owners can update/delete their own properties
- Photos and videos are uploaded to Cloudinary
