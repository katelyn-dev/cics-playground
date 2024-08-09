import json
from flask import Blueprint, Flask, request, jsonify, make_response
from .models import Form, form_schema, forms_schema
from app import db, ma
from .email_controller import EmailController
from app.config import Config
from datetime import datetime
from sqlalchemy import and_

mod = Blueprint('form', __name__)

"""
    Expected JSON payload:
    {
        "form_json": "{"First Name": "Text",....},
        "created_by": "Kin",
        "form_prefix": "Test"
        "last_updated_by": "Kin",
        "start_time": "2024-08-01"
    }
"""
@mod.route("/createForm", methods=['POST'])
def create_form():
  data = request.get_json()

  if not isinstance(data, dict):
    return jsonify({"error": "Invalid data format, expected a dictionary"}), 400
  
  form_model = Form()
  form_id = form_model.create_form(data)

  return jsonify({"form_id": form_id, "message": f"Form created successfully with form_id: {form_id}"}), 201


@mod.route("/updateForm", methods=['POST'])
def update_form():
  data = request.get_json()

  if not isinstance(data, dict):
    return jsonify({"error": "Invalid data format, expected a dictionary"}), 400
  
  form_id = data.get('form_id')
  form_json = str(data.get('form_json'))

  form = Form.query.filter_by(form_id=form_id)
  if not form:
      return jsonify({"error": f"No form found with form_id: {form_id}"}), 404

  Form.query.update(Form.form_json).where(Form.id == form_id).values(form_json)
  db.session.commit()
  print("hi")
  return jsonify({"form_id": form_id, "message": "Form updated successfully"}), 200


@mod.route("/submitForm", methods=['POST'])
def submit_form():

  data = request.get_json()

  # Mapping of fields to tables
  class_fields = {
      'class_group_id', 'class_name_eng', 'class_name_zhcn', 'class_name_zhhk',
      'has_subclass', 'subclass_group_id', 'has_extra_attributes', 'extra_attributes_name',
      'extra_attributes', 'class_start', 'class_end', 'start_time', 'last_modified_time'
  }
  contact_fields = {
      'application_id', 'student_id', 'guardian_full_name', 'guardian_relationship',
      'emergency_contact_name', 'emergency_relationship', 'emergency_phone'
  }
  student_fields = {
      'lastname', 'firstname', 'gender', 'phone_number', 'email', 'identity_status',
      'date_of_birth', 'age', 'age_group', 'address_street', 'address_city',
      'address_postal_code', 'country_of_origin', 'length_of_residence', 'is_first_time_apply',
      'is_followed_ig', 'is_signed', 'is_consent', 'is_paid', 'comment', 'start_time',
      'last_modified_time'
  }



  return "Form submited"


"""
    Expected JSON payload:
    {
        "toEmail": "example@example.com",      # Required. The recipient's email address.
        "toName": "Recipient Name",            # Required. The recipient's name.
        "registrationDetail": "Details here",  # Required. Registration details.
        "registrationFee": "100",              # Required. Registration fee amount.
        "paymentLink": "http://example.com"    # Required. Payment link.
    }
"""
@mod.route("/emailNotification", methods=["POST"])
def email_notification():
  data = request.get_json()
  if not isinstance(data, dict):
    return jsonify({"error": "Invalid data format, expected a dictionary"}), 400
  
  email_controller = EmailController(Config.EMAILJS_SERVICE_ID, Config.EMAILJS_USERID, Config.EMAILJS_FROM_NAME, Config.EMAILJS_ACCESS_TOKEN, Config.EMAILJS_TEMPLATE_ID)
  email_controller.send_email(data.get('to_email'),data.get('to_name'),data.get('registration_detail'), data.get('registration_fee'), data.get('payment_link'))

  return "Email sent"


"""
    Query parameters:
    - class_group_id: The ID of the form to retrieve.
"""
@mod.route("/getFormIdByClassId", methods=["GET"])
def get_form_id_by_class_id():
  if "id" in request.args:
    id = request.args['id']
    print(id)
    form = Form.query.filter_by(class_group_id=id).first()
    if form:
        return make_response(jsonify({'form_id': form.form_id}), 200)
    return make_response(jsonify({'message': 'form not found'}), 404)
  
  forms = Form.query.all()
  form_id = [form.form_id for form in forms]
  return  make_response(jsonify({'form_id': form_id}), 200)


"""
    Query parameters:
    - form_id: The ID of the form to retrieve.
"""
@mod.route("/getFormByFormId", methods=["GET"])
def get_form_by_form_id():
  if "id" in request.args:
    id = request.args['id']
    form = Form.query.filter_by(form_id=id).first()
    if form:
        return make_response(jsonify({'form_json': form.form_json}), 200)
    return make_response(jsonify({'message': 'form not found'}), 404)
  
  forms = Form.query.all()
  form_json = [form.form_json for form in forms]
  return  make_response(jsonify({'form_json': form_json}), 200)


# http://127.0.0.1:8080/searchForm?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
"""
    Query parameters:
    - startDate (optional): The start date for the search in YYYY-MM-DD format.
    - endDate (optional): The end date for the search in YYYY-MM-DD format.
    - formID (optional): The form ID to search
    - isActive (optional): Specific the form status to search
"""
@mod.route("/z", methods=["GET"])
def searchForm():
    query_params = request.args
    try:
        filters = Form.apply_filters(query_params)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    if filters:
        # Apply filters to query
        forms = Form.query.filter(*filters).all()
        if forms:
            return make_response(forms_schema.dump(forms), 200)
        return make_response(jsonify({'message': 'form not found'}), 404)
    else:
        return jsonify({"error": "Missing query parameters"}), 400
