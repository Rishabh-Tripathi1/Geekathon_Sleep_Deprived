from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
from transformers import T5ForConditionalGeneration, T5Tokenizer
from docx import Document


app = Flask(__name__)
CORS(app)

# To generate summary
def generate_summary(text):
    model = T5ForConditionalGeneration.from_pretrained("t5-base")
    tokenizer = T5Tokenizer.from_pretrained("t5-base")

    inputs = tokenizer.encode("summarize: " + text, return_tensors="pt", max_length=1000, truncation=True)

    outputs = model.generate(inputs, max_length=1000, min_length=100, length_penalty=2.0, num_beams=4, early_stopping=True)

    summary = tokenizer.decode(outputs[0])

    return summary

# Text extractor from PDF
def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)

        text = ''
        for page in reader.pages:
            text += page.extract_text()
    return text

# Text extractor from DOCX
def extract_text_from_docx(docx_path):
    doc = Document(docx_path)
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save the file to a desired location or process it as needed
    file.save(f'uploads/{file.filename}')

    return jsonify({'message': 'File uploaded successfully'}), 200

@app.route('/generate_summary', methods=['POST'])
def process_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    uploaded_file = request.files['file']
    if uploaded_file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    file_path = '/path/to/save/uploaded/file'
    uploaded_file.save(file_path)

    if file_path.lower().endswith('.pdf'):
        text = extract_text_from_pdf(file_path)
    elif file_path.lower().endswith('.docx'):
        text = extract_text_from_docx(file_path)
    else:
        return jsonify({'error': 'Unsupported file type'}), 400

    summary = generate_summary(text)

    return jsonify({'summary': summary}), 200

if __name__ == '__main__':
    app.run(debug=True)
