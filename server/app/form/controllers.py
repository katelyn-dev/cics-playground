from flask import Blueprint, Flask, request, jsonify, make_response
from .models import Form, form_schema, forms_schema
from app import db, ma
from app.email.EmailController import EmailController
from app.config import Config
from datetime import datetime

mod = Blueprint('form', __name__)

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
  email_controller.send_email(data.get('toEmail'),data.get('toName'),data.get('registrationDetail'), data.get('registrationFee'), data.get('paymentLink'))

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
    - startDate (required): The start date for the search in YYYY-MM-DD format.
    - endDate (required): The end date for the search in YYYY-MM-DD format.
"""
@mod.route("/searchForm", methods=["GET"])
def searchForm():
    start_date_str = request.args.get('startDate')
    end_date_str = request.args.get('endDate')

    if start_date_str and end_date_str:
        # Convert the string parameters to date objects
        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format"}), 400
        
        # Query the database for forms within the specified date range
        forms = Form.query.filter(
            Form.start_time >= start_date,
            Form.start_time <= end_date
        ).all()
        
        if forms:
          return make_response(forms_schema.dump(forms), 200)
        return make_response(jsonify({'message': 'form not found'}), 404)
    else:
        return jsonify({"error": "Missing startTime or endTime parameter"}), 400