from flask import Blueprint, request

from requests import request as http_request
import urllib.parse
import os
import json

mod = Blueprint('auth', __name__)
GOOGLEAPIS_BASE_URL= "https://forms.googleapis.com/v1/forms"


@mod.route('/')
def index():
    return mod.send_static_file('index.html')

@mod.errorhandler(404)
def not_found(e):
    return mod.send_static_file('index.html')

# @mod.route("/")
# def get_access_code():
    
#     if(os.getenv('ACCESS_TOKEN') != None):
#      return { "authorization" : "true"}
#     secrets = get_secrets()
#     auth_url = urllib.parse.urlunparse((
#         'https', 'accounts.google.com', '/o/oauth2/v2/auth',
#         '', urllib.parse.urlencode({
#             "access_type": "offline",
#             "approval_prompt": "auto",
#             'client_id': secrets.get("client_id"),
#             'redirect_uri': "http://localhost:3000",
#             'response_type': "code",
#             'scope': "https://www.googleapis.com/auth/forms.body",
#         }), ''
#     ))  

#     print(auth_url)
#     return { "auth_url" : auth_url}

# def get_secrets():
#   with open('client_secrets.json') as secrets_file:
#     secrets = json.load(secrets_file)
#     return secrets

# @mod.route("/auth", methods=['GET'])
# def auth(): 
#   print(os.getenv('ACCESS_TOKEN'))
#   if(os.getenv('ACCESS_TOKEN') != None):
#      return { "authorization" : "true"}
  
#   code = request.args.get("code")

#   secrets = get_secrets()
#   # get refresh token/access token from access code
#   url = "https://accounts.google.com/o/oauth2/token"
#   data = {
#       "grant_type": "authorization_code",
#       "code": code,
#       "client_id": secrets.get("client_id"),
#       "client_secret": secrets.get("client_secret"),
#       "scope": "https://www.googleapis.com/auth/forms.body",
#       "redirect_uri": "http://localhost:3000"
#   }
#   headers = {
#       "content-type": "application/x-www-form-urlencoded"
#   }

#   r = http_request("POST", url, data=data, headers=headers)
#   if(r.status_code == 200):
#     os.environ['ACCESS_TOKEN'] = r.json()['access_token']
#     access_token = os.getenv('ACCESS_TOKEN')
#     print(access_token)
#     return {"authorization" : "true"}
#   else: 
#     return r.text
  