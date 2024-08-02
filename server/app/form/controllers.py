from flask import Blueprint


mod = Blueprint('form', __name__)

@mod.route("/createForm")
def create_form():
  return "create form"

@mod.route("/submitForm")
def submit_form():
  return "Hello World"

@mod.route("/emailNotification")
def email_notification():
  return "email notification"
