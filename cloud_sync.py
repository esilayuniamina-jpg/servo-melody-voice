import firebase_admin
from firebase_admin import credentials, db
import time

# Inisialisasi Firebase Admin untuk terminal
# Menggunakan database URL yang sama dengan web
try:
    if not firebase_admin._apps:
        # Menggunakan default app dengan database URL
        firebase_admin.initialize_app(options={
            'databaseURL': 'https://servo-melody-default-rtdb.firebaseio.com'
        })
    
    ref = db.reference('chat_messages')
    
    def send_to_cloud(text, sender='bot'):
        ref.push({
            'sender': sender,
            'text': text,
            'timestamp': int(time.time() * 1000)
        })
        print(f"[Cloud Sync] Berhasil mengirim ke web: {text}")

except Exception as e:
    print(f"Cloud init error: {e}")
