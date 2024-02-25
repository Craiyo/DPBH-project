from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)  # Enable CORS for your Flask app

classifier = pipeline('text-classification',
                      model='crayo1902/ensemble-roberta')

dark_pattern_mapping = {
    'Urgency': 0,
    'Not Dark Pattern': 1,
    'Scarcity': 2,
    'Misdirection': 3,
    'Social Proof': 4,
    'Obstruction': 5,
    'Sneaking': 6,
    'Forced Action': 7
}


@app.route('/', methods=['POST'])
def main():
    if request.method == 'POST':
        print("Data received by sever")
        output = []
        data = request.get_json()
        if 'tokens' in data:
            tokens = data['tokens']
            for token in tokens:
                prediction = classifier(token)
                output_data = [dark_pattern_mapping[prediction['label']]
                               for prediction in prediction]
                output.append({'token': token, 'prediction': output_data[0]})
        print(output)
        print("data sent to extension")
        return jsonify(output)
    else:
        return jsonify({'error': 'No "tokens" provided in the request'}), 400


if __name__ == '__main__':
    app.run(debug=True)
