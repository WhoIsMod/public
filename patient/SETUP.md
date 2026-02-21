# Quick Setup Guide

## Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

## Backend Setup (5 minutes)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Frontend Setup (5 minutes)

```bash
cd frontend
npm install
npm run dev
```

## Testing the Application

1. **Backend**: Visit http://localhost:8000/admin to access Django admin
2. **Frontend**: Open http://localhost:5173 in your browser

The frontend is a **PWA** (Progressive Web App). You can install it from the browser for an app-like experience on desktop and mobile.

## Default Credentials

After creating superuser, you can:
- Login to admin panel
- Create test patients via admin
- Test API endpoints via http://localhost:8000/api/

## API Testing

Use Postman or curl to test endpoints:

```bash
# Register patient
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "password2": "testpass123",
    "first_name": "Test",
    "last_name": "User",
    "omang": "123456789",
    "cellphone": "+26712345678",
    "next_of_kin_name": "Kin Name",
    "next_of_kin_contact": "+26787654321",
    "location": "Gaborone",
    "address": "123 Main St"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"omang": "123456789", "password": "testpass123"}'
```

## Troubleshooting

### Backend Issues
- Ensure all migrations are applied: `python manage.py migrate`
- Check database files are created in backend directory
- Verify Python version: `python --version`

### Frontend Issues
- Clear cache: `rm -rf node_modules && npm install`
- Ensure backend is running on port 8000 (API is proxied)

### AI Model Issues
- Llama model download may take time on first run
- Ensure sufficient disk space (model is ~13GB)
- For testing, fallback interpretation will work without model

## Test Database & Hashed Storage

When running tests (`python manage.py test`), sensitive data is automatically hashed:
- **OMANG**: Stored as HMAC-SHA256 hash (one-way)
- **cellphone, address, etc.**: Encrypted with Fernet (reversible for display)

To create the test database manually:
```bash
python manage.py setup_test_db
```

To use hashed storage for development, set in `.env`:
```
USE_HASHED_STORAGE=True
```

## Next Steps

1. Configure environment variables in `.env`
2. Set up AWS S3 for file storage
3. Configure Stripe for payments
4. Set up Redis for Celery tasks
5. Deploy to production servers
