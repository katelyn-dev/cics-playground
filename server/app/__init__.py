from flask import Flask, jsonify, redirect, url_for, render_template, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from app.config import Config


db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize SQLAlchemy with the app
    db.init_app(app)
    
    with app.app_context():
        # Import routes here to avoid circular imports
        from app.auth.controllers import mod as auth_module
        from app.programme.controllers import mod as prog_module
        from app.form.controllers import mod as form_module

        # register blueprint
        app.register_blueprint(auth_module)
        app.register_blueprint(prog_module)
        app.register_blueprint(form_module)

    return app
