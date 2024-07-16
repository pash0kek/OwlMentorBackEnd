from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import base64
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    data = request.json  # Directly get the JSON data
    files = data.get('files', [])

    for file in files:
        name = file.get('name')
        data_url = file.get('dataURL')
        # Extract the base64 data from the data URL
        header, encoded = data_url.split(",", 1)
        data = base64.b64decode(encoded)
        # Save the file
        with open(os.path.join(UPLOAD_FOLDER, name), 'wb') as f:
            f.write(data)

    return jsonify({'status': 'success', 'message': 'Files uploaded successfully'})

@app.route('/delete', methods=['POST'])
def delete_file():
    data = request.json
    file_name = data.get('file_name')
    file_path = os.path.join(UPLOAD_FOLDER, file_name)
    
    if os.path.exists(file_path):
        os.remove(file_path)
        return jsonify({'status': 'success', 'message': f'{file_name} deleted successfully'})
    else:
        return jsonify({'status': 'error', 'message': f'{file_name} not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
