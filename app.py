from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import PyPDF2
from transformers import T5ForConditionalGeneration, T5Tokenizer
from docx import Document
from claude import Claude

import os
import PyPDF2
# Path to the PDF file you want to summarize
pdf_path = '/content/drive/MyDrive/code/test2.pdf'

app = Flask(__name__)
CORS(app)


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

    data = text()
    output = summarize(data)

    return jsonify({'message': output}), 200

def text():
    file_path = 'uploads/'+uploaded_file_info['name']

    text = ""

    if '.pdf' in uploaded_file_info['name']:
        with open(file_path, 'rb') as file:
    
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text()

    elif '.txt' in uploaded_file_info['name']:
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()

    else:
        doc = Document(file_path)
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"

    print(type(uploaded_file_info['name']))

    return text

def summarize(text):
    prompt = f"""Summarize the following data: {text}
            Answer only in paragraphs"""
    response=claude.get_answer(prompt)

    print("Text Summarized")
    return response

# def qna():


if __name__ == '__main__':
    cookie = "sessionKey=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; intercom-device-id-lupk8zyo=651ccf97-6e06-44b1-a97e-29fb8aa82698; intercom-session-lupk8zyo=Z3BlZWxndDdJWWZLeEJvQTQ2VDRzZkxodGVadVlTVTZia1Nxdmh5NG42MFpCQzZodWFTV2IwRXh2N3ZkYmJtaC0tcXdValdsSzk5YjE3MkVDeWRXVXF4Zz09--cc78dfce84f8d49efeb24cef12375f554f1d4bf6; __cf_bm=bMdS1QviYFnm4k8cLF5p8BshvtT4AHUsIJkGyY3lCUI-1700282335-0-ARUe6pu1HRkBDXsftSDsJICG4JIVSwW0sjI+HxSIae87Z3EFH8jvc0Y2gBbkh6u3hFj9/LU3cFyCfRLvsc9KTJU="
    claude = Claude(cookie)
    app.run(debug=True)
