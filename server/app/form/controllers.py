from flask import Blueprint, Flask, request, jsonify, make_response
from .models import Form, form_schema, forms_schema
from app import db, ma

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
  return "Hello World"

@mod.route("/emailNotification")
def email_notification():
  return "email notification"

@mod.route("/getForm")
def get_all_form():
  if "id" in request.args:
    form_id = request.args['id']
    form = Form.query.filter_by(id=form_id).first()
    if form:
      return make_response(form_schema.dump(form), 200)
    return make_response(jsonify({'message': 'form not found'}), 404)
  
  forms = Form.query.all()
  return forms_schema.dump(forms)