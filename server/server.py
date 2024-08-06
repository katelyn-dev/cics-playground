from app import create_app
from flask_cors import CORS

app = create_app()
CORS(app) #do not remove. for cors header 

if __name__ == "__main__": 
  app.run(host='0.0.0.0', debug=True, port=8080)