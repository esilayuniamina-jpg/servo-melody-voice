import time
import firebase_admin
from firebase_admin import credentials, db

# Inisialisasi Firebase database
if not firebase_admin._apps:
    firebase_admin.initialize_app(options={
        'databaseURL': 'https://servo-melody-default-rtdb.firebaseio.com'
    })

ref = db.reference('chat_messages')

print("=== JEMBATAN TERMINAL KE WEB AKTIF ===")
print("Ketik pesan di sini untuk dikirim ke web dan dibunyikan secara suara otomatis.")
print("Ketik 'exit' untuk keluar.\n")

while True:
    try:
        user_input = input("Pesan dari Terminal: ").strip()
        if user_input.lower() == 'exit':
            break
        if not user_input:
            continue

        # Kirim ke cloud sebagai bot/system message
        ref.push({
            'sender': 'bot',
            'text': user_input,
            'timestamp': int(time.time() * 1000)
        })
        print(f"-> Terkirim ke web: '{user_input}' (Web akan otomatis bersuara!)\n")
    except KeyboardInterrupt:
        break

print("Keluar dari program jembatan.")
