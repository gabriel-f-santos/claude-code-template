# 🏗️ Vibecoding Architecture Rules

## ✅ ALWAYS DO

### Database & Security
1. **Dual ID Pattern**: Use DualIdMixin (id + public_id) for all entities
2. **Async Everywhere**: All database methods are async
3. **SQLAlchemy 2.0**: Use select() instead of query()
4. **AsyncSession**: Use Depends(get_async_session) always
5. **Proper Relationships**: ForeignKey + relationship() well defined
6. **Migrations**: Alembic for all schema changes
7. **Never Expose Internal ID**: APIs use public_id only

### Code Patterns
8. **Async Validation**: Pydantic schemas for all inputs/outputs  
9. **Service Layer**: Business logic in services (UserService, etc.)
10. **Structured Logging**: Use correlation IDs and JSON formatting
11. **Secure Error Handling**: Generic messages in production
12. **Test Coverage**: Async tests for all features

## ❌ NEVER DO

### Security Anti-Patterns
1. **Expose Internal IDs**: Never return Integer PK in APIs
2. **Log Sensitive Data**: passwords, tokens, secrets, PII
3. **Detailed Error Messages**: No stack traces in production responses
4. **JWT Token Logging**: Never log complete JWT tokens

### Technical Anti-Patterns
5. **Sync/Async Mix**: Never mix sync and async operations
6. **Old Query Syntax**: Avoid legacy query() methods
7. **Missing Await**: Every database operation needs await
8. **Blocking Operations**: Avoid event loop blocking
9. **Skip Async Testing**: Every feature needs async tests
10. **Poor Session Management**: AsyncSession lifecycle is critical
11. **Raw Exception Handling**: Use global exception handlers

## 🔄 Development Process

### Before Adding Feature
1. Define async patterns and relationships
2. Plan dual ID implementation  
3. Consider security implications
4. Design error handling strategy

### During Development
1. Start with model using DualIdMixin
2. Create Alembic migration
3. Build service with AsyncSession
4. Create API with secure error handling
5. Write comprehensive async tests

### After Implementation
1. Test manually via FastAPI docs
2. Run async test suite
3. Verify security patterns
4. Check logging and error handling

## 🎯 Feature Checklist

- [ ] Model uses DualIdMixin
- [ ] Migration applied
- [ ] Service implements async CRUD
- [ ] API exposes only public_id
- [ ] Schemas defined with validation
- [ ] Async tests with database
- [ ] Error handling with correlation IDs
- [ ] Secure logging without sensitive data
- [ ] Performance indexes added
- [ ] Documentation updated