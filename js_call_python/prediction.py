from transformers import BertTokenizer, BertForSequenceClassification
from transformers import XLNetTokenizer, XLNetForSequenceClassification
from transformers import RobertaTokenizer, RobertaForSequenceClassification
from transformers import AlbertTokenizer, AlbertForSequenceClassification
from torch.nn.functional import softmax
import torch
import re
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

# albert_tokenizer = AlbertTokenizer.from_pretrained("albert-base-v2")
# albert_model = AlbertForSequenceClassification.from_pretrained(
#     ALbert_model_path)
max_seq_length = 512


def preprocess_text(tokenizer, text):
    tokens = tokenizer.tokenize(tokenizer.decode(tokenizer.encode(
        text, add_special_tokens=True, max_length=max_seq_length, truncation=True)))
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
input_data = [
    'Skip to main content',
    '.in',
    'Delivering to Mumbai 400001\nUpdate location',
    'All',
    'EN',
    'Hello, sign in',
    'Account & Lists',
    'Returns\n& Orders',
    '0',
    'Cart',
    'Sign in',
    'New customer? Start here.',
    'All',
    'Fresh\n' +
    'Amazon miniTV\n' +
    'Sell\n' +
    'Best Sellers\n' +
    "Today's Deals\n" +
    'Mobiles\n' +
    'Electronics\n' +
    'Customer Service\n' +
    'New Releases\n' +
    'Prime\n' +
    'Gift Ideas\n' +
    'Home & Kitchen\n' +
    'Fashion\n' +
    'Amazon Pay\n' +
    'Computers\n' +
    'Books\n' +
    'Car & Motorbike\n' +
    'Toys & Games\n' +
    'Home Improvement\n' +
    'Sports, Fitness & Outdoors\n' +
    'Beauty & Personal Care\n' +
    'Coupons\n' +
    'Gift Cards\n' +
    'Health, Household & Personal Care\n' +
    'Grocery & Gourmet Foods\n' +
    'Video Games\n' +
    'Subscribe & Save\n' +
    'Baby\n' +
    'Pet Supplies\n' +
    'Audible\n' +
    'AmazonBasics\n' +
    'Kindle eBooks',
    'Previous slide',
    'Next slide',
    'Revamp your home in style',
    'Cushion covers, bedsheets & more',
    'Figurines, vases and more',
    'Home storage',
    'Lighting solutions',
    'Explore all',
    'Up to 75% off | Headphones',
    'Up to 75% off | boAt',
    'Up to 75% off | boult',
    'Up to 75% off | Noise',
    'Up to 75% off | Zebronics',
    'See all offers',
    'Up to 60% off | Styles for men',
    'Clothing',
    'Footwear',
    'Watches',
    'Bags & wallets',
    'End of season sale',
    'Sign in for your best experience\nSign in for your best experience',
    'Sign in securely',
    'Sponsored',
    'Get the perfect screen size | TVs Starting ₹6,999',
    'Budget TVs | Up to 60% off',
    '4K TVs | Up to 24 months No Cost EMI',
    'Big Screens | Up to 60% off',
    'Ultra Premium TVs | Up to 50% off',
    'See all',
    'Starting ₹99 | All your home improvement needs',
    'Spin mops, wipes & more',
    'Bathroom hardware & accessories',
    'Hammers, screwdrivers & more',
    'Extension boards, plugs & more',
    'Explore all',
    'Starting ₹139 | Amazon brands & more',
    'Starting ₹139 | Water bottles',
    'Starting ₹299 | Storage containers',
    'Starting ₹499 | Cookware',
    'Starting ₹399 | Racks & holders',
    'See more',
    'Baby essentials & fun toys | Amazon Brands & more',
    'Starting ₹179 | Diapers & wipes',
    'Starting ₹229 | Baby cardels & more',
    'Starting ₹169 | Soft toys',
    'Starting ₹399 | Outdoor games',
    'See more',
    'Today’s Deals\nSee all deals',
    'Up to 52% off',
    'Deal of the Day',
    'Best Offers from Top Brands\nBest Offers from Top Brands']
# input_data = json.loads(sys.argv[1])
for i, text in enumerate(input_data):
    predictions = predict_dark_patterns([bert_model, xlnet_model, roberta_model], [
                                        bert_tokenizer, xlnet_tokenizer, roberta_tokenizer], text)
    majority = max(set(predictions), key=predictions.count)
    output_data.append(majority)
print(output_data)
# print(json.dumps({"tokens": sys.argv[1], "prediction": output_data}))
# , xlnet_model, roberta_model, albert_model , xlnet_tokenizer, albert_tokenizer, roberta_tokenizer
