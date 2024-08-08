from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from app.programme.models import Application

mod = Blueprint('payment', __name__)

@mod.route('/payment.html', methods=["GET"])
def payment():
    application_id = request.args.get('applicationId')
    if not application_id:
        return jsonify({"error": "Missing parameter"}), 400

    # Check if the application ID exists in the database
    application = Application.query.filter_by(id=application_id).first()
    if not application:
        return jsonify({"error": "Application not found"}), 400

    return render_template('payment.html', applicationId=application_id)

@mod.route('/process_payment', methods=["GET"])
def process_payment():
    application_id = request.args.get('applicationId')
    Application.makePayment(application_id, True)
    return render_template('confirmation.html')

@mod.route('/confirmation', methods=["GET"])
def confirmation():
    return render_template('confirmation.html')