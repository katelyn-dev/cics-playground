from flask import Blueprint, Flask, request, jsonify, make_response
from .models import Form, form_schema, forms_schema
from app import db, ma
from app.email.EmailController import EmailController
from app.config import Config

mod = Blueprint('form', __name__)

@mod.route("/createForm", methods=['POST'])
def create_form():
  data = request.get_json()

  if not isinstance(data, dict):
    return jsonify({"error": "Invalid data format, expected a dictionary"}), 400
  
  form_model = Form()
  form_model.create_form(data)

  return jsonify({"message": "Form created successfully"}), 201

@mod.route("/submitForm", methods=['POST'])
def submit_form():
  return "Form submited"

@mod.route("/emailNotification", methods=["POST"])
def email_notification():
  data = request.get_json()
  if not isinstance(data, dict):
    return jsonify({"error": "Invalid data format, expected a dictionary"}), 400
  
  email_controller = EmailController(Config.EMAILJS_SERVICE_ID, Config.EMAILJS_USERID, Config.EMAILJS_FROM_NAME, Config.EMAILJS_ACCESS_TOKEN, Config.EMAILJS_TEMPLATE_ID)
  email_controller.send_email(data.get('toEmail'),data.get('toName'),data.get('registrationDetail'), data.get('registrationFee'), data.get('paymentLink'))

  return "Email sent"

@mod.route("/getForm", methods=["GET"])
def get_all_form():
  if "id" in request.args:
    form_id = request.args['id']
    form = Form.query.filter_by(id=form_id).first()
    if form:
      return make_response(form_schema.dump(form), 200)
    return make_response(jsonify({'message': 'form not found'}), 404)
  
  forms = Form.query.all()
  return forms_schema.dump(forms)