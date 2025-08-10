# 🚨 Security Antipatterns - NEVER DO THESE

## ❌ ERROR HANDLING ANTIPATTERNS

### **1. Exposing Internal Errors in Production (CRITICAL)**

```python
# ❌ NEVER DO THIS - Exposes sensitive information
@app.exception_handler(Exception)
async def debug_exception_handler(request: Request, exc: Exception):
    return JSONResponse({
        "error": str(exc),           # Exposes internal details
        "traceback": traceback.format_exc(),  # Shows code structure
        "locals": locals(),          # May contain secrets
        "request_data": await request.json()  # May contain passwords
    })
```

**Why this is dangerous:**
- 🔓 Exposes database schema, file paths, secrets
- 🔓 Reveals internal application structure  
- 🔓 Shows sensitive environment variables
- 🔓 Helps attackers understand vulnerabilities

### **2. Logging Sensitive Data**

```python
# ❌ NEVER DO THIS - Logs sensitive information
logger.info(f"User login: {email} with password {password}")
logger.error(f"Database error: {user_data}")  # May contain PII
logger.debug(f"SQL Query: {query}")  # May expose structure
```

**Why this is dangerous:**
- 🔓 Passwords and secrets in log files
- 🔓 PII data exposure in logs
- 🔓 Database queries reveal schema

### **3. Detailed Database Errors**

```python
# ❌ NEVER DO THIS - Exposes database details
try:
    user = db.query(User).filter(User.id == user_id).first()
except SQLAlchemyError as e:
    raise HTTPException(500, detail=str(e))  # Exposes DB schema
```

**Why this is dangerous:**
- 🔓 Reveals table names, column names
- 🔓 Shows database constraints
- 🔓 Exposes connection strings

## ✅ SECURE ERROR HANDLING PATTERNS

### **1. Environment-Aware Error Responses**

```python
# ✅ SECURE - Environment-aware error handling
@app.exception_handler(Exception)
async def secure_exception_handler(request: Request, exc: Exception):
    error_id = str(uuid.uuid4())
    
    # Log full details internally (with sanitization)
    logger.exception(f"Error [{error_id}]: {str(exc)}", extra={
        'path': str(request.url.path),
        'method': request.method,
        'error_id': error_id
    })
    
    # Return generic message in production
    if settings.ENVIRONMENT == "production":
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal server error",
                "error_id": error_id  # For support lookup only
            }
        )
    else:
        # Limited details in development
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal server error",
                "error_id": error_id,
                "type": type(exc).__name__  # Safe to show in dev
            }
        )
```

### **2. Secure Logging with Filtering**

```python
# ✅ SECURE - Sensitive data filtering
class SecurityFilter(logging.Filter):
    SENSITIVE_FIELDS = {'password', 'token', 'secret', 'key'}
    
    def filter(self, record):
        if hasattr(record, 'msg'):
            for field in self.SENSITIVE_FIELDS:
                if field in record.msg.lower():
                    record.msg = self._mask_sensitive_data(record.msg)
        return True

# ✅ SECURE - Structured security logging
log_security_event("failed_login", user_id=user.public_id, details={
    'ip_address': request.client.host,
    'user_agent': request.headers.get('user-agent'),
    # Note: Never log passwords or sensitive data
})
```

### **3. Generic Business Logic Errors**

```python
# ✅ SECURE - Generic user-facing messages
class UserService:
    @staticmethod
    async def authenticate_user(email: str, password: str):
        try:
            user = await User.find_one(User.email == email)
            if not user or not verify_password(password, user.hashed_password):
                # Log specific reason internally
                logger.warning(f"Failed login attempt for {email}")
                # Return generic message externally
                raise AuthenticationError("Invalid credentials")
        except DatabaseError as e:
            # Log specific database error internally
            logger.error(f"Database error during authentication: {str(e)}")
            # Return generic message externally  
            raise HTTPException(500, "Authentication service unavailable")
```

## 🔒 ID SECURITY ANTIPATTERNS

### **1. Exposing Sequential IDs**

```python
# ❌ NEVER DO THIS - Enumerable IDs
@router.get("/users/{user_id}")
async def get_user(user_id: int):  # Allows enumeration
    return await UserService.get_user_by_id(user_id)

# Attackers can do: GET /users/1, /users/2, /users/3, etc.
```

### **2. Using Only UUID as Primary Key**

```python
# ❌ INEFFICIENT - UUID as PK hurts performance
class User(Base):
    id = Column(UUID, primary_key=True)  # 4x slower JOINs
    # Foreign keys also UUIDs = performance nightmare
```

## ✅ SECURE ID PATTERNS

### **1. Dual ID System (Performance + Security)**

```python
# ✅ SECURE + PERFORMANT - Dual ID system
class User(Base):
    # Internal PK for performance
    id = Column(Integer, primary_key=True, index=True)
    # Public UUID for API security  
    public_id = Column(UUID, unique=True, nullable=False, default=uuid.uuid4)

# API uses public_id (secure)
@router.get("/users/{public_id}")
async def get_user(public_id: uuid.UUID):
    return await UserService.get_user_by_public_id(public_id)

# Internal operations use id (fast)
def get_user_orders(user_internal_id: int):
    return db.query(Order).filter(Order.user_id == user_internal_id).all()
```

## 🔐 AUTHENTICATION ANTIPATTERNS

### **1. Detailed Authentication Errors**

```python
# ❌ NEVER DO THIS - Enables user enumeration
if not user:
    raise HTTPException(401, "User does not exist")
if not verify_password(password, user.hashed_password):
    raise HTTPException(401, "Invalid password")
```

### **2. Password Policy Exposure**

```python
# ❌ NEVER DO THIS - Reveals password requirements
raise HTTPException(400, 
    "Password must be 8+ chars, contain uppercase, number, and special char")
```

## ✅ SECURE AUTHENTICATION PATTERNS

### **1. Generic Authentication Errors**

```python
# ✅ SECURE - Generic message for all auth failures
if not user or not verify_password(password, user.hashed_password):
    # Log specific failure reason internally
    log_security_event("failed_login", details={'email': email})
    # Return generic message externally
    raise AuthenticationError("Invalid credentials")
```

## 📝 LOGGING SECURITY CHECKLIST

### ✅ **DO Log These (Securely):**
- Authentication failures (with sanitized details)
- Authorization violations  
- Rate limiting triggers
- Suspicious activity patterns
- System errors (with error IDs)
- Performance metrics

### ❌ **NEVER Log These:**
- Passwords (plaintext or hashed)
- API keys, tokens, secrets
- Credit card numbers, SSNs
- Full request/response bodies
- Database connection strings
- Internal file paths in production

## 🚨 PRODUCTION SECURITY CHECKLIST

### **Environment Configuration:**
- [ ] `ENVIRONMENT=production` set
- [ ] `DEBUG=False` in production
- [ ] Generic error messages only
- [ ] Detailed logging for internal monitoring
- [ ] Error IDs for support correlation

### **Error Handling:**
- [ ] Custom exception handlers configured
- [ ] No stack traces in API responses
- [ ] Sensitive data filtering enabled
- [ ] Security events logged
- [ ] Error correlation IDs implemented

### **ID Security:**
- [ ] Public APIs use UUID/ObjectId only
- [ ] Internal operations use integer PKs
- [ ] No sequential ID enumeration possible
- [ ] Foreign key references secured

Remember: **Security through obscurity is not security, but information disclosure is definitely insecurity!**