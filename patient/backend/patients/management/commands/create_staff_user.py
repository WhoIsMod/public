"""Create a staff user for the portal. Usage: python manage.py create_staff_user --username staff1 --password secret123 --email staff@hospital.com"""
from django.core.management.base import BaseCommand
from patients.models import Patient


class Command(BaseCommand):
    help = 'Create a staff user for the Staff Portal'

    def add_arguments(self, parser):
        parser.add_argument('--username', required=True, help='Username for staff login')
        parser.add_argument('--password', required=True, help='Password')
        parser.add_argument('--email', default='staff@example.com', help='Email')
        parser.add_argument('--first-name', default='Staff', dest='first_name')
        parser.add_argument('--last-name', default='User', dest='last_name')

    def handle(self, *args, **options):
        username = options['username']
        if Patient.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f'User {username} already exists'))
            return
        omang = f'STAFF-{username}'[:20]
        if Patient.objects.filter(omang=omang).exists():
            omang = f'STAFF{Patient.objects.count()}-{username}'[:20]
        user = Patient.objects.create(
            username=username,
            email=options['email'],
            first_name=options['first_name'],
            last_name=options['last_name'],
            omang=omang,
            cellphone='+2677000000',
            next_of_kin_name='N/A',
            next_of_kin_contact='N/A',
            location='N/A',
            address='N/A',
            is_staff=True,
        )
        user.set_password(options['password'])
        user.save()
        self.stdout.write(self.style.SUCCESS(f'Staff user "{username}" created. Login at /staff-login'))
