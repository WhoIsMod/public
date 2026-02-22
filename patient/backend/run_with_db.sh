#!/bin/sh
# Run backend with DB (SQLite by default). Use from a normal terminal so venv Python is used.
set -e
cd "$(dirname "$0")"
if [ -d venv ] && [ -f venv/bin/python ]; then
    . venv/bin/activate
    python manage.py migrate --noinput
    exec python manage.py runserver 0.0.0.0:8000
else
    echo "No venv found. Create one: python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi
