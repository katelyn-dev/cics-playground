from flask import Blueprint


mod = Blueprint('form', __name__)

@mod.route("/submitForm")
def submit_form():
  return "Hello World"