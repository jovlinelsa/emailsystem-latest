# import imaplib
# import email
# from flask import Flask, jsonify

# app = Flask(__name__)

# # IMAP Server and Email Credentials
# IMAP_SERVER = 'imap.gmail.com'
# EMAIL_ACCOUNT = 'draaft001@gmail.com'
# PASSWORD = 'hxrvnhczikjuwlva'  # Generate this in your Google Account settings

# @app.route('/get-emails', methods=['GET'])
# def get_emails():
#     try:
#         # Connect to Gmail IMAP server
#         mail = imaplib.IMAP4_SSL(IMAP_SERVER)
#         mail.login(EMAIL_ACCOUNT, PASSWORD)
#         mail.select('inbox')  # Open inbox folder

#         # Search and fetch email IDs
#         status, email_ids = mail.search(None, 'ALL')
#         email_ids = email_ids[0].split()

#         email_data = []
#         for email_id in email_ids[-10:]:  # Fetch the last 10 emails
#             status, data = mail.fetch(email_id, '(RFC822)')
#             msg = email.message_from_bytes(data[0][1])

#             # Parse email headers
#             subject = msg["subject"]
#             sender = msg["from"]
#             date = msg["date"]

#             # Parse snippet from email body
#             snippet = ""
#             if msg.is_multipart():
#                 for part in msg.walk():
#                     if part.get_content_type() == "text/plain":
#                         snippet = part.get_payload(decode=True).decode('utf-8', errors='ignore')[:100]
#                         break
#             else:
#                 snippet = msg.get_payload(decode=True).decode('utf-8', errors='ignore')[:100]

#             email_data.append({
#                 "id": email_id.decode(),
#                 "subject": subject,
#                 "from": sender,
#                 "date": date,
#                 "snippet": snippet
#             })

#         mail.logout()
#         return jsonify(email_data)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     app.run(debug=True)
