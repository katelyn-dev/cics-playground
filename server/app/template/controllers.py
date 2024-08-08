from flask import Blueprint, Flask, request, jsonify, make_response
from .models import Form_Template
from datetime import datetime
from sqlalchemy import and_

mod = Blueprint('template', __name__)

"""
   Query parameters:
    - target_audience: The target audience of the form to retrieve.
"""
@mod.route("/getTemplate", methods=['GET'])
def get_form_template():
  target_audience = request.args['targetAudience']
  form = Form_Template.query.filter_by(name=target_audience).first()
  if form:
      return make_response(jsonify({'form_json': form.form_json}), 200)
  return make_response(jsonify({'message': 'form not found'}), 404)



