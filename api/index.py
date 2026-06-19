import sys
import os

# Make backend importable from the serverless function
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from main import app  # noqa: F401  — Vercel picks up `app` as the ASGI handler
