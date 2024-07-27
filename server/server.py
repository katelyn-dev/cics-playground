from flask import Flask, jsonify, redirect, url_for, render_template, request
from flask_cors import CORS
from requests import request as http_request
import urllib.parse
import os

app = Flask(__name__)
CORS(app)

GOOGLEAPIS_BASE_URL= "https://forms.googleapis.com/v1/forms"

CLIENT_ID = "377828949577-f3gik6l6i2mtvrvkosn335s3ui58eoj0.apps.googleusercontent.com"
CLIENT_ST = "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"
#  https://accounts.google.com/o/oauth2/auth?access_type=offline&approval_prompt=auto&client_id=377828949577-f3gik6l6i2mtvrvkosn335s3ui58eoj0.apps.googleusercontent.com&response_type=code&scope=https://www.googleapis.com/auth/spreadsheets&redirect_uri=http://localhost


@app.route("/")
def get_access_code():
    if(os.getenv('ACCESS_TOKEN') != None):
     return { "authorization" : "true"}
    auth_url = urllib.parse.urlunparse((
        'https', 'accounts.google.com', '/o/oauth2/v2/auth',
        '', urllib.parse.urlencode({
            "access_type": "offline",
            "approval_prompt": "auto",
            'client_id': CLIENT_ID,
            'redirect_uri': "http://localhost:3000",
            'response_type': "code",
            'scope': "https://www.googleapis.com/auth/forms.body",
        }), ''
    ))  

    print(auth_url)
    return { "auth_url" : auth_url}

@app.route("/auth", methods=['GET'])
def auth(): 
  print(os.getenv('ACCESS_TOKEN'))
  if(os.getenv('ACCESS_TOKEN') != None):
     return { "authorization" : "true"}
  
  code = request.args.get("code")
  # get refresh token/access token from access code
  url = "https://accounts.google.com/o/oauth2/token"
  data = {
      "grant_type": "authorization_code",
      "code": code,
      "client_id": CLIENT_ID,
      "client_secret": CLIENT_ST,
      "scope": "https://www.googleapis.com/auth/forms.body",
      "redirect_uri": "http://localhost:3000"
  }
  headers = {
      "content-type": "application/x-www-form-urlencoded"
  }

  r = http_request("POST", url, data=data, headers=headers)
  if(r.status_code == 200):
    os.environ['ACCESS_TOKEN'] = r.json()['access_token']
    access_token = os.getenv('ACCESS_TOKEN')
    print(access_token)
    return {"authorization" : "true"}
  else: 
    return r.text
  

@app.route("/submitForm")
def submit_form():
  return "Hello World"

if __name__ == "__main__": 
  app.run(host='0.0.0.0', debug=True, port=8080)