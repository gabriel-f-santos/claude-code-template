# 🚀 Fastify Vibecoding API

A lightning-fast API template built with Fastify, designed for rapid development and live coding sessions. Perfect for building CRUD APIs in minutes!

## ✨ Features

- **🚀 Fastify** - High-performance web framework
- **🗄️ Prisma ORM** - Type-safe database operations  
- **🔐 JWT Authentication** - Secure API access
- **✅ JSON Schema Validation** - Automatic request/response validation
- **📚 Swagger Documentation** - Interactive API explorer
- **🧪 Vitest Testing** - Fast and modern testing framework
- **🔄 Hot Reload** - Instant development feedback
- **🛡️ Security** - CORS, Rate limiting, Helmet

## 🏃‍♂️ Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd fastify-vibecoding-api
npm install

# Setup database
cp .env.example .env
npm run db:push

# Start development server
npm run dev

# Visit http://localhost:3000/docs for API documentation
```

## 📚 API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User authentication  
- `GET /api/users` - List users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/me` - Get current user profile (auth required)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products  
- `GET /api/products` - List products (with filtering)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/:id` - Update product (auth required)  
- `DELETE /api/products/:id` - Delete product (auth required)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/search/:term` - Search products

## 🛠️ Development

```bash
# Development server with hot reload
npm run dev

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Database management
npm run db:studio      # Open Prisma Studio
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run database migrations

# Linting
npm run lint
npm run lint:fix
```

## 🧪 Testing

The template includes comprehensive tests for all endpoints:

```bash
# Run all tests
npm test

# Run specific test file
npm test users.test.js

# Watch mode for development
npm run test:watch
```

## 🏗️ Project Structure

```
src/
├── routes/           # API route definitions
├── controllers/      # Request/response handlers  
├── services/         # Business logic layer
├── schemas/          # JSON Schema validation
├── plugins/          # Fastify plugins (DB, Auth)
├── utils/            # Helper functions
└── app.js           # Main application

tests/               # Test files
prisma/              # Database schema
```

## 🔧 Configuration

Key environment variables:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
CORS_ORIGIN="http://localhost:3000"
```

## 🚀 Deployment

This template is ready for deployment on:

- **Vercel** - Zero config deployment
- **Railway** - Simple database included
- **Docker** - Containerized deployment  
- **Traditional VPS** - PM2 process manager

## 📖 Learn More

- [Fastify Documentation](https://www.fastify.io/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Vitest Documentation](https://vitest.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - feel free to use this template for any project!

---

**Happy coding! 🚀**

For questions or support, check the `/docs` endpoint when running the server for interactive API documentation.