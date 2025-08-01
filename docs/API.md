# 🔌 GameCraft Pro Ultimate - API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

כל ה-endpoints המוגנים דורשים JWT token בכותרת:
```
Authorization: Bearer <your-jwt-token>
```

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Body:**
```json
{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com", 
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "subscription": "free"
  }
}
```

### Login User
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Grant Admin Access 🔐
```http
POST /api/auth/admin-access
Authorization: Bearer <token>
```

**Body:**
```json
{
  "accessCode": "lotemronkaplan21"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin access granted successfully",
  "user": {
    "role": "admin"
  }
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
```

**Body:**
```json
{
  "fullName": "Updated Name",
  "preferences": {
    "theme": "dark",
    "language": "he"
  }
}
```

### Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
```

**Body:**
```json
{
  "oldPassword": "currentPassword",
  "newPassword": "newSecurePass123"
}
```

### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

## 🎮 Games Endpoints

### Get User Games
```http
GET /api/games
Authorization: Bearer <token>
```

### Create Game
```http
POST /api/games
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "My Awesome Game",
  "description": "A cool platformer game",
  "category": "platformer",
  "isPublic": true
}
```

## 👤 User Endpoints

### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

## 🤖 AI Endpoints

### Generate Content
```http
POST /api/ai/generate
Authorization: Bearer <token>
```

**Body:**
```json
{
  "type": "code-generation",
  "prompt": "Create a simple jump function",
  "options": {
    "language": "javascript"
  }
}
```

## 🖼️ Assets Endpoints

### Get User Assets
```http
GET /api/assets
Authorization: Bearer <token>
```

### Upload Asset
```http
POST /api/assets/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

## 👑 Admin Endpoints

**Note:** Requires admin role or valid admin access code

### Get Admin Stats
```http
GET /api/admin/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1234,
    "activeUsers": 1200,
    "adminUsers": 5,
    "recentUsers": 89,
    "gamesCreated": 567,
    "securityChecks": 456,
    "securityIncidents": 0
  }
}
```

### Get All Users
```http
GET /api/admin/users?page=1&limit=10
Authorization: Bearer <token>
```

### Update User
```http
PUT /api/admin/users/:id
Authorization: Bearer <token>
```

**Body:**
```json
{
  "role": "admin",
  "isActive": true
}
```

### Delete User
```http
DELETE /api/admin/users/:id
Authorization: Bearer <token>
```

### Get System Logs
```http
GET /api/admin/logs
Authorization: Bearer <token>
```

## 📊 Analytics Endpoints

### Get Analytics
```http
GET /api/analytics
Authorization: Bearer <token>
```

## 📤 Export Endpoints

### Export Game
```http
POST /api/export/:gameId
Authorization: Bearer <token>
```

**Body:**
```json
{
  "platform": "web",
  "optimization": "production",
  "compression": true
}
```

## 🛒 Marketplace Endpoints

### Get Marketplace Items
```http
GET /api/marketplace
Authorization: Bearer <token>
```

## 🏥 Health Check

### Server Health
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-01T12:00:00.000Z",
  "uptime": 12345,
  "environment": "development",
  "version": "10.0.0"
}
```

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": "Error message here",
  "details": [] // Optional validation details
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Sensitive Operations**: 1 request per minute
- **File Uploads**: 10 requests per hour

## File Upload Limits

- **Maximum File Size**: 100MB
- **Supported Formats**: 
  - Images: JPG, PNG, GIF, SVG
  - Audio: MP3, WAV, OGG
  - Video: MP4, WebM
  - Documents: JSON, TXT

## Webhooks (Coming Soon)

Future webhook support for:
- Game published
- User registered
- Payment completed
- Export finished

---

**🔐 Admin Access Code: `lotemronkaplan21`**