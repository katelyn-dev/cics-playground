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

  return jsonify({"message": f"Form created successfully with form_id: {form_id}"}), 201


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
    - id (optional): The ID of the form to retrieve.
"""
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


# http://127.0.0.1:8080/searchForm?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
"""
    Query parameters:
    - startDate (optional): The start date for the search in YYYY-MM-DD format.
    - endDate (optional): The end date for the search in YYYY-MM-DD format.
    - formID (optional): The form ID to search
    - isActive (optional): Specific the form status to search
"""
@mod.route("/searchForm", methods=["GET"])
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
