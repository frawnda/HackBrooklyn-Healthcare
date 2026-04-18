import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from RAGpreprocessor import MedicalBillAnalyzer

app = Flask(__name__)
CORS(app) # Allows React to talk to Flask

# Configuration
UPLOAD_FOLDER = 'temp_uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize your analyzer
analyzer = MedicalBillAnalyzer()
# Ensure the DB is ready on startup
analyzer.build_knowledge_base()

@app.route('/analyze', methods=['POST'])
def analyze_bill():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    # Language is sent as a string (English, Español, Français)
    language = request.form.get('language', 'English')
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save file temporarily
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    try:
        # 1. Extract Text using your OCR logic
        # We pass it as a list because your method expects image_paths array
        extracted_text = analyzer.extract_text([filepath])
        
        # 2. Run RAG Analysis
        summary = analyzer.analyze(extracted_text, language)
        
        # Cleanup file after processing
        os.remove(filepath)
        
        return jsonify({"summary": summary})

    except Exception as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)