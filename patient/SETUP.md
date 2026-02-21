# Quick Setup Guide

## Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

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
npm start
```

## Testing the Application

1. **Backend**: Visit http://localhost:8000/admin to access Django admin
2. **Frontend**: 
   - Scan QR code with Expo Go app (mobile)
   - Press `w` for web browser
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

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
- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Expo CLI version: `expo --version`

### AI Model Issues
- Llama model download may take time on first run
- Ensure sufficient disk space (model is ~13GB)
- For testing, fallback interpretation will work without model

## Next Steps

1. Configure environment variables in `.env`
2. Set up AWS S3 for file storage
3. Configure Stripe for payments
4. Set up Redis for Celery tasks
5. Deploy to production servers
