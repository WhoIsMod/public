# Sensorium Patient Portal

Complete patient portal application with Django REST Framework backend and React Native frontend.

## Features

- Patient Registration & Login (OMANG-based authentication)
- Medical Data Entry (heart rate, conditions, chronic illnesses, race, sex, etc.)
- Appointment Booking System
- Medical Staff Listing
- Online Pharmacy
- Payment System for Bills
- Digital Medical Document Storage
- AI Document Interpreter (Llama-based)
- Hospital Navigation & API Integration

## Tech Stack

### Backend
- Django 4.2.7
- Django REST Framework
- JWT Authentication
- SQLite Databases (4-5 databases)
- Llama AI Model Integration
- Celery & Redis for async tasks

### Frontend
- React Native with Expo
- React Navigation
- React Native Paper (Material Design)
- Axios for API calls

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Run development server:
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start Expo development server:
```bash
npm start
```

4. Run on platform:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for Web

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Patient registration
- `POST /api/auth/login/` - Patient login
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Patients
- `GET /api/patients/profile/` - Get patient profile
- `PATCH /api/patients/profile/` - Update patient profile

### Medical Records
- `POST /api/medical/create/` - Create medical record
- `GET /api/medical/list/` - List medical records
- `GET /api/medical/<id>/` - Get medical record detail
- `PATCH /api/medical/<id>/` - Update medical record
- `DELETE /api/medical/<id>/` - Delete medical record

### Appointments
- `POST /api/appointments/create/` - Book appointment
- `GET /api/appointments/list/` - List appointments
- `GET /api/appointments/<id>/` - Get appointment detail
- `POST /api/appointments/<id>/cancel/` - Cancel appointment

### Staff
- `GET /api/staff/list/` - List medical staff
- `GET /api/staff/<id>/` - Get staff detail

### Pharmacy
- `GET /api/pharmacy/medications/` - List medications
- `GET /api/pharmacy/medications/<id>/` - Get medication detail
- `GET /api/pharmacy/prescriptions/` - List prescriptions
- `POST /api/pharmacy/orders/create/` - Create order
- `GET /api/pharmacy/orders/` - List orders

### Payments
- `GET /api/payments/bills/` - List bills
- `GET /api/payments/bills/<id>/` - Get bill detail
- `POST /api/payments/process/<bill_id>/` - Process payment
- `GET /api/payments/list/` - List payments

### Documents
- `POST /api/documents/upload/` - Upload document
- `GET /api/documents/list/` - List documents
- `GET /api/documents/<id>/` - Get document detail
- `GET /api/documents/<id>/download/` - Download document
- `DELETE /api/documents/<id>/` - Delete document

### AI Agent
- `POST /api/ai/interpret/<document_id>/` - Interpret document
- `GET /api/ai/interpretations/` - List interpretations
- `GET /api/ai/interpretations/<id>/` - Get interpretation detail

## Environment Variables

Create a `.env` file in the backend directory:

```
SECRET_KEY=your-secret-key-here
DEBUG=True
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

## Database Structure

The application uses multiple SQLite databases:
- `db.sqlite3` - Default Django database
- `patients_db.sqlite3` - Patient data
- `medical_db.sqlite3` - Medical records
- `appointments_db.sqlite3` - Appointments
- `pharmacy_db.sqlite3` - Pharmacy data

## Testing

Run backend tests:
```bash
cd backend
python manage.py test
```

## Production Deployment

1. Set `DEBUG=False` in settings
2. Configure proper database (PostgreSQL recommended)
3. Set up AWS S3 for file storage
4. Configure Stripe for payments
5. Set up Celery workers for async tasks
6. Use environment variables for sensitive data

## License

MIT License
