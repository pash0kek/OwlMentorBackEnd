from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from email.message import EmailMessage
import ssl
import smtplib

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit_form():

    files = request.files.getlist('files')

    email_sender = 'bazhutov.business@gmail.com'
    email_password = 'lcft wbah xiac jvqp'
    email_receiver = 'paulbazhutov@gmail.com'

    subject = 'OHHS New File Request!'

    body = f"""
    We got a new file request from OHHS!!!:

    Make sure to upload this file to a chatbot as soon as possible!!!!
    """

    em = EmailMessage()
    em['From'] = email_sender
    em['To'] = email_receiver
    em['Subject'] = subject
    em.set_content(body)

    # Attach files to the email
    for file in files:
        file_data = file.read()
        file_name = file.filename
        em.add_attachment(file_data, maintype='application', subtype='octet-stream', filename=file_name)

    context = ssl.create_default_context()

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
            smtp.login(email_sender, email_password)
            smtp.send_message(em)
    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True)