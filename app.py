from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import PyPDF2
# from transformers import T5ForConditionalGeneration, T5Tokenizer
# from docx import Document
import spacy
from spacy.lang.en.stop_words import STOP_WORDS
from string import punctuation
from heapq import nlargest
from spacy.lang.en import English

app = Flask(__name__)
CORS(app)


def generate_summary(text):
    stopwords = list(STOP_WORDS)
    nlp = spacy.load('en_core_web_sm')
    doc = nlp(text)
    tokens = [token.text for token in doc]
    word_frequencies = {}
    for word in doc:
        if word.text.lower() not in stopwords:
            if word.text.lower() not in punctuation:
                if word.text not in word_frequencies.keys():
                    word_frequencies[word.text] = 1
                else:
                    word_frequencies[word.text] += 1
    max_frequency = max(word_frequencies.values())

    for word in word_frequencies.keys():
        word_frequencies[word] = word_frequencies[word] / max_frequency
    sentence_tokens = [sent for sent in doc.sents]
    sentence_scores = {}
    for sent in sentence_tokens:
        for word in sent:
            if word.text.lower() in word_frequencies.keys():
                if sent not in sentence_scores.keys():
                    sentence_scores[sent] = word_frequencies[word.text.lower()]
                else:
                    sentence_scores[sent] += word_frequencies[word.text.lower()]

    select_length = int(len(sentence_tokens) * 0.3)
    summary = nlargest(select_length, sentence_scores, key=sentence_scores.get)
    
    return summary

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)

        text = ''
        for page in reader.pages:
            text += page.extract_text()
    return text

# def extract_text_from_docx(docx_path):
#     doc = Document(docx_path)
#     text = ""
#     for paragraph in doc.paragraphs:
#         text += paragraph.text + "\n"
#     return text

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save the file to a desired location or process it as needed
    file.save(f'uploads/{file.filename}')

    # Store file information in the variable
    global uploaded_file_info
    uploaded_file_info = {'name': file.filename}

    paragraph = "This is a simple paragraph"

    return jsonify({'message': paragraph}), 200


@app.route('/generate_summary', methods=['POST'])
def process_file():
    global uploaded_file_info

    if not uploaded_file_info:
        return jsonify({'error': 'No file uploaded'})

    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'})

    uploaded_file = request.files['file']
    if uploaded_file.filename == '':
        return jsonify({'error': 'No file selected'})

    # file_path = '/path/to/save/uploaded/file'
    # uploaded_file.save(file_path)

    file_path = 'uploads/'+uploaded_file_info['name']

    if file_path.lower().endswith('.pdf'):
        text = extract_text_from_pdf(file_path)
    # elif file_path.lower().endswith('.docx'):
    #     text = extract_text_from_docx(file_path)
    else:
        return jsonify({'error': 'Unsupported file type'})

    summary = generate_summary(text)

    return jsonify({'summary': summary})

if __name__ == '__main__':
    # Load the T5 model and tokenizer once when the application starts
    # model = T5ForConditionalGeneration.from_pretrained("t5-base")
    # tokenizer = T5Tokenizer.from_pretrained("t5-base")
    app.run(debug=True)
