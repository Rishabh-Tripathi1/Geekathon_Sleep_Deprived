from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import PyPDF2
from transformers import T5ForConditionalGeneration, T5Tokenizer
from docx import Document
from claude import Claude
import os
import PyPDF2

app = Flask(__name__)
CORS(app)

@app.route('/regenerate',methods=['POST'])
def regenerate_output():
    prompt = f"""Regenerate the summary in more understandable terms"""
    response=claude.get_answer(prompt)

    return jsonify({'message': response}), 200

@app.route('/qna',methods=['POST'])
def qna_func():

    question = request.get_json()["question"]
    prompt = f"""Give precise answer in 2 lines to the question: {question} from the data provided earlier"""
    response=claude.get_answer(prompt)

    return jsonify({'message': response}), 200


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



if __name__ == '__main__':
    cookie = "sessionKey=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; cf_clearance=YdjTthpKaRMejFWCKoV8C8WMyVIMVJXchzHJr10x8qM-1700339937-0-1-d8629b3f.b09edf77.8f63c4df-0.2.1700339937; stripe_sid=fa549f07-df25-4ae9-ada6-96c75684bf12110e44; cf_bm=MqZedKMXP4EW56IJQGdk2BsF2VpcZ2AQzV605UVhyfc-1700341297-0-AfpdDCu2D/nFvOCJZUg3oN2Um7ve83xMeFQwXvGHfyMyblHUmbSC+7Lt2YQ6oFp7g+le0YifTeittx8MNw5wzDg=; intercom-session-lupk8zyo=WjVSS0JMUm5yWWZRYys3NFFMdHlXUmZhVWFjTVIzNThSQm53bC9xWHFHbHZwSmx2NStLUlo5U3B0QXhPMzlpNS0taUdlaWdMK1VKaE9QMXhRalpleURNZz09--40d6966e57280ae6deb3046080513299da536f2f"
    claude = Claude(cookie)
    app.run(debug=True)
