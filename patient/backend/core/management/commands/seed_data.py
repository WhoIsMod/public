"""
Generate dummy data for the whole app: patients, staff, appointments (bookings),
medical records, documents, pharmacy, payments.
Run: python manage.py seed_data
"""
import random
from datetime import datetime, timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.conf import settings

from patients.models import Patient
from staff.models import MedicalStaff
from appointments.models import Appointment
from medical_records.models import MedicalRecord
from documents.models import MedicalDocument
from pharmacy.models import Medication, Prescription, Order
from payments.models import Bill, Payment
from ai_agent.models import AIInterpretation


# Dummy data constants
FIRST_NAMES = ['Thabo', 'Amanda', 'Kago', 'Lerato', 'Tshepo', 'Naledi', 'Kagiso', 'Bontle', 'Oarabile', 'Precious']
LAST_NAMES = ['Molefe', 'Sithole', 'Nkosi', 'Dlamini', 'Khumalo', 'Mthembu', 'Zulu', 'Ndaba', 'Mahlangu', 'Sibanda']
OMANGS = ['200101001', '200102002', '200103003', '200104004', '200105005', '200106006', '200107007', '200108008']
STAFF_NAMES = [
    ('Dr. Sarah Moyo', 'CARDIOLOGY', 'MBChB, FCP'), ('Dr. James Tembo', 'GENERAL', 'MBChB'),
    ('Dr. Grace Banda', 'PEDIATRICS', 'MBChB, DCH'), ('Dr. David Phiri', 'SURGERY', 'MBChB, MMed'),
    ('Dr. Mary Ngoma', 'DERMATOLOGY', 'MBChB, DD'),
]
DEPARTMENTS = ['Cardiology', 'General Practice', 'Pediatrics', 'Surgery', 'Outpatient']
MED_NAMES = [
    ('Paracetamol', 'Acetaminophen', '500mg tablets', '10.00'),
    ('Amoxicillin', 'Amoxicillin', '500mg capsules', '45.00'),
    ('Ibuprofen', 'Ibuprofen', '400mg tablets', '25.00'),
    ('Lisinopril', 'Lisinopril', '10mg tablets', '35.00'),
    ('Metformin', 'Metformin', '850mg tablets', '30.00'),
]
DOC_TYPES = ['LAB_REPORT', 'PRESCRIPTION', 'DISCHARGE_SUMMARY', 'MEDICAL_CERTIFICATE', 'OTHER']
BILL_TYPES = ['CONSULTATION', 'MEDICATION', 'LAB_TEST', 'PROCEDURE']


class Command(BaseCommand):
    help = 'Create dummy data: patients, staff, appointments, documents, pharmacy, payments'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Clear existing data first (patients, staff, etc.)')

    def handle(self, *args, **options):
        if options.get('clear'):
            self._clear_data()
        self._ensure_media_dirs()
        patients = self._create_patients()
        staff_list = self._create_staff()
        self._create_appointments(patients, staff_list)
        self._create_medical_records(patients)
        medications = self._create_medications()
        self._create_prescriptions_orders(patients, medications)
        self._create_bills_payments(patients)
        docs = self._create_documents(patients)
        self._create_ai_interpretations(patients, docs)
        self.stdout.write(self.style.SUCCESS('Seed data created. Login with OMANG e.g. 200101001 / password123'))

    def _ensure_media_dirs(self):
        media = getattr(settings, 'MEDIA_ROOT', None)
        if media:
            for sub in ['medical_documents', 'staff_profiles', 'medications']:
                (media / sub).mkdir(parents=True, exist_ok=True)

    def _clear_data(self):
        AIInterpretation.objects.all().delete()
        MedicalDocument.objects.all().delete()
        Payment.objects.all().delete()
        Bill.objects.all().delete()
        Order.objects.all().delete()
        Prescription.objects.all().delete()
        Medication.objects.all().delete()
        Appointment.objects.all().delete()
        MedicalRecord.objects.all().delete()
        MedicalStaff.objects.all().delete()
        Patient.objects.filter(is_superuser=False).delete()
        self.stdout.write('Cleared existing data.')

    def _create_patients(self):
        patients = []
        default_password = 'password123'
        for i, omang in enumerate(OMANGS[:6]):
            p, _ = Patient.objects.get_or_create(
                username=f'patient_{omang}',
                defaults={
                    'first_name': FIRST_NAMES[i % len(FIRST_NAMES)],
                    'last_name': LAST_NAMES[i % len(LAST_NAMES)],
                    'email': f'patient{i+1}@test.com',
                    'omang': omang,
                    'cellphone': f'+2677{random.randint(100000, 999999)}',
                    'next_of_kin_name': f'Kin of {FIRST_NAMES[i]}',
                    'next_of_kin_contact': '+26771234567',
                    'location': 'Gaborone',
                    'address': f'{100 + i} Test Street, Gaborone',
                    'is_staff': False,
                    'is_active': True,
                },
            )
            if not p.password or p.password.startswith('!'):  # unusable
                p.set_password(default_password)
                p.save()
            patients.append(p)
        self.stdout.write(f'Created {len(patients)} patients.')
        return patients

    def _create_staff(self):
        staff_list = []
        for i, (name, specialty, qual) in enumerate(STAFF_NAMES):
            s, _ = MedicalStaff.objects.get_or_create(
                license_number=f'LIC-{1000 + i}',
                defaults={
                    'name': name,
                    'specialty': specialty,
                    'qualification': qual,
                    'email': f'staff{i+1}@hospital.bw',
                    'phone': f'+2677{random.randint(200000, 299999)}',
                    'department': DEPARTMENTS[i % len(DEPARTMENTS)],
                    'bio': f'Experienced {specialty.lower()} specialist.',
                    'is_available': random.choice([True, True, False]),
                },
            )
            staff_list.append(s)
        self.stdout.write(f'Created {len(staff_list)} staff.')
        return staff_list

    def _create_appointments(self, patients, staff_list):
        count = 0
        for _ in range(15):
            p = random.choice(patients)
            s = random.choice(staff_list)
            dt = timezone.now() + timedelta(days=random.randint(-7, 14), hours=random.randint(8, 16))
            _, created = Appointment.objects.get_or_create(
                patient=p, staff=s, appointment_date=dt,
                defaults={
                    'duration_minutes': random.choice([30, 45, 60]),
                    'reason': random.choice(['Check-up', 'Follow-up', 'New complaint', 'Routine']),
                    'status': random.choice(['PENDING', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
                },
            )
            if created:
                count += 1
        self.stdout.write(f'Created {count} appointments.')

    def _create_medical_records(self, patients):
        for i, p in enumerate(patients[:4]):
            for j in range(random.randint(1, 2)):
                rec_id = f'REC-{p.omang}-{i}{j}'
                if MedicalRecord.objects.filter(record_id=rec_id).exists():
                    continue
                MedicalRecord.objects.create(
                    patient=p,
                    record_id=rec_id,
                    heart_rate=random.randint(60, 95),
                    blood_pressure_systolic=random.randint(110, 130),
                    blood_pressure_diastolic=random.randint(70, 85),
                    temperature=Decimal(str(round(36.5 + random.random(), 1))),
                    weight=Decimal(str(round(60 + random.random() * 30, 1))),
                    height=Decimal(str(165 + random.randint(0, 25))),
                    race=random.choice(['AFRICAN', 'AFRICAN', 'OTHER']),
                    sex=random.choice(['M', 'F']),
                    chronic_illness=random.choice(['None', 'Hypertension', 'Diabetes', '']) or '',
                )
        self.stdout.write('Created medical records.')

    def _create_medications(self):
        meds = []
        for i, (name, generic, dosage, price) in enumerate(MED_NAMES):
            m, _ = Medication.objects.get_or_create(
                name=name,
                defaults={
                    'generic_name': generic,
                    'description': f'Common medication for various conditions.',
                    'dosage': dosage,
                    'price': Decimal(price),
                    'stock_quantity': random.randint(50, 500),
                    'requires_prescription': random.choice([True, False]),
                },
            )
            meds.append(m)
        self.stdout.write(f'Created {len(meds)} medications.')
        return meds

    def _create_prescriptions_orders(self, patients, medications):
        for p in patients[:4]:
            med = random.choice(medications)
            Prescription.objects.get_or_create(
                patient=p, medication=med,
                defaults={
                    'quantity': random.randint(1, 3),
                    'instructions': 'Take as directed.',
                    'prescribed_by': random.choice([s.name for s in MedicalStaff.objects.all()[:3]]),
                    'status': random.choice(['PENDING', 'FILLED']),
                },
            )
        for i, p in enumerate(patients[:3]):
            med = random.choice(medications)
            order_num = f'ORD-{timezone.now().strftime("%Y%m%d")}-{1000 + i}'
            if Order.objects.filter(order_number=order_num).exists():
                continue
            Order.objects.create(
                patient=p,
                order_number=order_num,
                items=[{'medication': med.id, 'quantity': 1}],
                total_amount=med.price,
                shipping_address=p.address or 'Patient address',
                status=random.choice(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']),
            )
        self.stdout.write('Created prescriptions and orders.')

    def _create_bills_payments(self, patients):
        for i, p in enumerate(patients):
            bill_num = f'BILL-{timezone.now().strftime("%Y%m%d")}-{2000 + i}'
            if Bill.objects.filter(bill_number=bill_num).exists():
                continue
            amount = Decimal(str(round(50 + random.random() * 450, 2)))
            bill = Bill.objects.create(
                patient=p,
                bill_number=bill_num,
                bill_type=random.choice(BILL_TYPES),
                description='Consultation and tests',
                amount=amount,
                tax_amount=Decimal('0'),
                total_amount=amount,
                due_date=timezone.now().date() + timedelta(days=30),
                status=random.choice(['PENDING', 'PENDING', 'PAID', 'OVERDUE']),
            )
            if bill.status == 'PAID':
                Payment.objects.create(
                    bill=bill, patient=p,
                    payment_number=f'PAY-{3000 + i}',
                    amount=bill.total_amount,
                    payment_method=random.choice(['CARD', 'CASH', 'MOBILE_MONEY']),
                    transaction_id=f'TXN-{random.randint(100000, 999999)}',
                    status='COMPLETED',
                )
        self.stdout.write('Created bills and payments.')

    def _create_documents(self, patients):
        docs = []
        for p in patients[:4]:
            for k in range(2):
                title = f'{random.choice(DOC_TYPES)} - {p.last_name} {k+1}'
                if MedicalDocument.objects.filter(patient=p, title=title).exists():
                    continue
                d = MedicalDocument.objects.create(
                    patient=p,
                    document_type=random.choice(DOC_TYPES),
                    title=title,
                    description='Sample document for testing.',
                    date_issued=timezone.now().date() - timedelta(days=random.randint(1, 90)),
                    file=None,
                )
                docs.append(d)
        self.stdout.write(f'Created {len(docs)} document records.')
        return docs

    def _create_ai_interpretations(self, patients, docs):
        for d in docs[:3]:
            if AIInterpretation.objects.filter(document=d).exists():
                continue
            AIInterpretation.objects.create(
                document=d, patient=d.patient,
                original_text='Sample lab result text.',
                interpreted_text='Interpreted summary.',
                summary='Summary: routine findings.',
                key_findings=['Finding 1', 'Finding 2'],
                recommendations=['Follow up in 6 months.'],
                confidence_score=Decimal('0.92'),
            )
        self.stdout.write('Created AI interpretations.')
