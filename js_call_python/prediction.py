from transformers import pipeline
from collections import Counter
from transformers import AlbertForSequenceClassification, AlbertTokenizer
from transformers import BertTokenizer, BertForSequenceClassification
from transformers import XLNetTokenizer, XLNetForSequenceClassification
from transformers import RobertaTokenizer, RobertaForSequenceClassification
from torch.nn.functional import softmax
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

# Sentiment analysis model
sentiment_analyzer_1 = pipeline(
    'sentiment-analysis', model=bert_model, tokenizer=bert_tokenizer)
sentiment_analyzer_2 = pipeline(
    'sentiment-analysis', model=xlnet_model, tokenizer=xlnet_tokenizer)
sentiment_analyzer_3 = pipeline(
    'sentiment-analysis', model=roberta_model, tokenizer=roberta_tokenizer)


def get_majority_vote(predictions):
    predicted_labels = [prediction['label'] for prediction in predictions]
    majority_vote_label = Counter(predicted_labels).most_common(1)[0][0]
    return majority_vote_label


max_seq_length = 512

# Map
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


output_data_strings = []
input_data = json.loads(sys.argv[1])
# input_data = ["You are dumb", "20% Off", "I bought a new car", "Flash Sale - Ends Today!", "Exclusive 24-Hour Access for VIP Members Only!", "spring clearance event",
#               "summer flash sale", "back-to-school special", "fall exclusive deal", "holiday gift guide special", "today's exclusive anniversary offer", "limited-time birthday discount",
#               "exclusive loyalty member deal", "limited-time reward member offer", "today's loyalty program special", "exclusive referral program discount", "limited-time friend referral offer",
#               "exclusive social media follower deal", "today's Twitter/Facebook/Instagram offer", "limited-time email subscriber special", "today's newsletter subscriber deal"]
sentiment_result_1 = sentiment_analyzer_1(input_data)
sentiment_result_2 = sentiment_analyzer_2(input_data)
sentiment_result_3 = sentiment_analyzer_3(input_data)

for i, text in enumerate(input_data):
    bert_result = get_majority_vote([sentiment_result_1[i]])
    roberta_result = get_majority_vote([sentiment_result_2[i]])
    xlnet_result = get_majority_vote([sentiment_result_3[i]])

    all_results = [bert_result, roberta_result, xlnet_result]
    counted_results = Counter(all_results)
    final_result = counted_results.most_common(1)[0][0]
    output_data_strings.append(final_result)

output_data = [dark_pattern_mapping[item] for item in output_data_strings]
# print({"tokens": input_data, "predictions": output_data})
print(json.dumps({"tokens": input_data, "predictions": output_data}))
