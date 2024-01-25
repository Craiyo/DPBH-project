from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import BertTokenizer, BertForSequenceClassification
from torch.nn.functional import softmax
import torch
from torch.utils.data import TensorDataset, DataLoader

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load BERT model and tokenizer
bert_model_path = r"C:\Users\ayush\Documents\Models\DPBH_BERT_Fine_Tuned_Model"
bert_tokenizer = BertTokenizer.from_pretrained(bert_model_path)
bert_model = BertForSequenceClassification.from_pretrained(bert_model_path)

max_seq_length = 512


def preprocess_text(tokenizer, text):
    tokens = tokenizer.tokenize(tokenizer.decode(tokenizer.encode(
        text, add_special_tokens=True, max_length=max_seq_length, truncation=True)))
    return tokens


def predict_dark_patterns_bert(tokenizer, model, input_text):
    input_ids = tokenizer.encode(preprocess_text(
        tokenizer, input_text), return_tensors='pt', max_length=max_seq_length, truncation=True)

    with torch.no_grad():
        outputs = model(input_ids)

    probs = softmax(outputs.logits, dim=1).squeeze()
    predicted_category = torch.argmax(probs).item()

    return predicted_category


def perform_semantic_analysis(model, tokenizer, new_texts):
    # Tokenize the new text samples
    new_encodings = tokenizer(list(new_texts), truncation=True, padding=True)

    # Convert to PyTorch tensor
    new_dataset = TensorDataset(
        torch.tensor(new_encodings['input_ids']),
        torch.tensor(new_encodings['attention_mask'])
    )

    new_loader = DataLoader(new_dataset, batch_size=8, shuffle=False)

    model.eval()
    all_preds = []

    with torch.no_grad():
        for batch in new_loader:
            inputs = {'input_ids': batch[0], 'attention_mask': batch[1]}
            outputs = model(**inputs)
            logits = outputs.logits
            preds = torch.argmax(logits, dim=1)
            all_preds.extend(preds.cpu().numpy())

    return all_preds


@app.route('/', methods=['POST'])
def main():
    if request.method == 'POST':
        output = []
        data = request.get_json().get('tokens')
        if data:
            # semantic_analysis_results = perform_semantic_analysis(
            #     bert_model, bert_tokenizer, data)
            for i, token in enumerate(data):

                prediction = predict_dark_patterns_bert(
                    bert_tokenizer, bert_model, token)
                # Include semantic analysis result in the output
                output.append({'token': token, 'prediction': prediction})
                # 'semantic_analysis': semantic_analysis_results[i]})
        else:
            return jsonify({'error': 'No "tokens" provided in the request'}), 400

        return jsonify(output)


if __name__ == '__main__':
    app.run(debug=True)
