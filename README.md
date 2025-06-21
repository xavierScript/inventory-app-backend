# Inventory App Backend

A simple Express.js backend for inventory management with role-based authentication.

## Features

- **Authentication System**: JWT-based authentication with user registration and login
- **Role-Based Access Control**: Admin and user roles with different permissions
- **Product Management**: CRUD operations for products with role-based restrictions
- **SQLite Database**: Lightweight database for data persistence
- **Input Validation**: Request validation using express-validator
- **CORS Support**: Configured for frontend integration

## User Roles

### Admin

- Can create, read, update, and delete products
- Can manage user accounts
- Full access to all features

### User

- Can only read/view products
- Cannot modify or delete products
- Limited access to features

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the backend directory:

```bash
cd inventory-app-backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

   - Copy `config.env` and modify as needed
   - Change the JWT_SECRET for production

4. Start the server:

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## Default Admin Account

A default admin account is automatically created:

- **Username**: admin
- **Password**: admin123

**Important**: Change these credentials in production!

## API Endpoints

### Authentication

#### Register User

```
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "role": "user" // optional, defaults to "user"
}
```

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### Get Profile

```
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Update Profile

```
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newemail@example.com",
  "password": "newpassword123"
}
```

### Products

#### Get All Products

```
GET /api/products
Authorization: Bearer <token>
```

#### Get Single Product

```
GET /api/products/:id
Authorization: Bearer <token>
```

#### Create Product (Admin Only)

```
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 29.99,
  "quantity": 100,
  "category": "Electronics"
}
```

#### Update Product (Admin Only)

```
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 39.99,
  "quantity": 50
}
```

#### Delete Product (Admin Only)

```
DELETE /api/products/:id
Authorization: Bearer <token>
```

#### Search Products

```
GET /api/products/search/:query
Authorization: Bearer <token>
```

### Health Check

```
GET /api/health
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Error Responses

The API returns consistent error responses:

```json
{
  "message": "Error description"
}
```

For validation errors:

```json
{
  "errors": [
    {
      "msg": "Validation error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: All inputs are validated and sanitized
- **Role-Based Access**: Different permissions for different user roles
- **CORS Protection**: Configured CORS for frontend integration

## Development

### Project Structure

```
inventory-app-backend/
├── database.js          # Database setup and initialization
├── server.js            # Main server file
├── config.env           # Environment variables
├── package.json         # Dependencies and scripts
├── middleware/
│   └── auth.js          # Authentication middleware
├── routes/
│   ├── auth.js          # Authentication routes
│   └── products.js      # Product management routes
└── README.md            # This file
```

### Adding New Features

1. Create new route files in the `routes/` directory
2. Add middleware in the `middleware/` directory if needed
3. Register new routes in `server.js`
4. Update this README with new endpoints

## Production Considerations

1. **Environment Variables**: Use proper environment variables for sensitive data
2. **JWT Secret**: Use a strong, unique JWT secret
3. **Database**: Consider using a production database like PostgreSQL
4. **HTTPS**: Enable HTTPS in production
5. **Rate Limiting**: Implement rate limiting for API endpoints
6. **Logging**: Add proper logging for production monitoring
7. **Backup**: Implement database backup strategies

## License

ISC
