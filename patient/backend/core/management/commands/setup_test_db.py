"""
Create and populate the test database with hashed data.
Run with: python manage.py setup_test_db

Creates test_db.sqlite3. When running tests (python manage.py test), Django uses
this database with USE_HASHED_STORAGE=True, so all sensitive data is hashed/encrypted.
"""
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.conf import settings
import os


class Command(BaseCommand):
    help = 'Create test database (migrations only; use with USE_HASHED_STORAGE for hashed data)'

    def handle(self, *args, **options):
        test_db_path = settings.DATABASES['test_db']['NAME']
        self.stdout.write(f'Setting up test database at {test_db_path}')

        if os.path.exists(test_db_path):
            os.remove(test_db_path)
            self.stdout.write('Removed existing test database')

        call_command('migrate', '--database=test_db', verbosity=2)
        self.stdout.write(self.style.SUCCESS(
            'Test database ready. Run tests with: python manage.py test '
            '(USE_HASHED_STORAGE is auto-enabled during tests)'
        ))
