import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from RAGpreprocessor import MedicalBillAnalyzer

app = Flask(__name__)
CORS(app) 

# Configuration
UPLOAD_FOLDER = 'temp_uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize your analyzer
analyzer = MedicalBillAnalyzer()
analyzer.build_knowledge_base()

@app.route('/analyze', methods=['POST'])
def analyze_bill():
    # 1. Use getlist to catch EVERY file sent under the key 'file'
    if 'file' not in request.files:
        return jsonify({"error": "No files uploaded"}), 400
   
    uploaded_files = request.files.getlist('file')
    language = request.form.get('language', 'English')
    
    filepaths = []
    
    try:
        # 2. Loop through the list and save each one
        for file in uploaded_files:
            if file.filename == '':
                continue
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            filepaths.append(filepath)

        if not filepaths:
            return jsonify({"error": "No valid files processed"}), 400

        # 3. Pass the WHOLE list of paths to your OCR logic
        # Your extract_text method is already built to handle this!
        extracted_text = analyzer.extract_text(filepaths)
       
        # 4. Run RAG Analysis on the combined text
        summary = analyzer.analyze(extracted_text, language)
       
        # 5. Cleanup ALL files after processing
        for path in filepaths:
            if os.path.exists(path):
                os.remove(path)
       
        return jsonify({"summary": summary})

    except Exception as e:
        # Cleanup any files that were saved before the crash
        for path in filepaths:
            if os.path.exists(path):
                os.remove(path)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)