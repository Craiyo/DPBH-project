from transformers import BertTokenizer, BertForSequenceClassification
from transformers import XLNetTokenizer, XLNetForSequenceClassification
from transformers import RobertaTokenizer, RobertaForSequenceClassification
from transformers import AlbertTokenizer, AlbertForSequenceClassification
from torch.nn.functional import softmax
import torch
from torch.utils.data import TensorDataset, DataLoader
import sys
import json

# Paths to the fine-tuned models
bert_model_path = r"C:\Users\ayush\Documents\Models\DPBH_BERT_Fine_Tuned_Model"
roberta_model_path = r"C:\Users\ayush\Documents\Models\DPBH_ROBERTO_Fine_Tuned_Model"
xlnet_model_path = r"C:\Users\ayush\Documents\Models\DPBH_XLNet_Fine_Tuned_Model"
ALbert_model_path = r"C:\Users\ayush\Documents\Models\DPBH_ALBERT_Fine_Tuned_Model"

# Load models and tokenizers
bert_tokenizer = BertTokenizer.from_pretrained(bert_model_path)
bert_model = BertForSequenceClassification.from_pretrained(bert_model_path)

xlnet_tokenizer = XLNetTokenizer.from_pretrained('xlnet-base-cased')
xlnet_model = XLNetForSequenceClassification.from_pretrained(xlnet_model_path)

roberta_tokenizer = RobertaTokenizer.from_pretrained("roberta-base")
roberta_model = RobertaForSequenceClassification.from_pretrained(
    roberta_model_path)

albert_tokenizer = AlbertTokenizer.from_pretrained("albert-base-v2")
albert_model = AlbertForSequenceClassification.from_pretrained(
    ALbert_model_path)

max_seq_length = 512


def preprocess_text(tokenizer, text):
    tokens = tokenizer.encode(
        text, add_special_tokens=True, max_length=max_seq_length, truncation=True)
    return tokens


def predict_dark_patterns(models, tokenizers, input_text):
    votes = []

    for model, tokenizer in zip(models, tokenizers):
        input_ids = tokenizer.encode(preprocess_text(
            tokenizer, input_text), return_tensors='pt', max_length=max_seq_length, truncation=True)
        with torch.no_grad():
            outputs = model(input_ids)
        probs = softmax(outputs.logits, dim=1).squeeze()
        predicted_category = torch.argmax(probs).item()
        votes.append(predicted_category)

    return votes


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


output_data = []
input_data = json.loads(sys.argv[1])
for i, text in enumerate(input_data):
    predictions = predict_dark_patterns([bert_model, xlnet_model, roberta_model], [
                                        bert_tokenizer, xlnet_tokenizer, roberta_tokenizer], text)
    majority = max(set(predictions), key=predictions.count)
    output_data.append(majority)

print(json.dumps({"tokens": input_data, "predictions": output_data}))
