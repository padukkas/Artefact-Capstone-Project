from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import json
import paralleldots


file = open('words.json')
data = json.load(file)
file.close()

paralleldots.set_api_key('9ffT4kl5LZXKn8pMOoXT1MeW8YsQjjrFpcQ9AqqWiQI')

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/process/', methods=['POST'])
@cross_origin()
def process_text():
    request_data = request.get_json()
    text = request_data['text']

    replaced = replace_bad_words(text)
    emotions = get_emotion(text)

    return jsonify({'message': replaced, 'emotions': emotions })

def get_emotion(text):
  return paralleldots.sentiment(text)['sentiment']

def replace_bad_words(text):
  replaced = ''
  for word in text.split(' '):
    is_replaced = False
    for x in data['words']:
      if word.lower() == x['value']:
        replaced += x['replace']
        is_replaced = True
        break

    if not is_replaced:
      replaced += word
    replaced += " "

  return replaced.strip()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3005)