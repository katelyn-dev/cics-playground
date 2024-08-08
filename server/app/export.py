from flask import Blueprint, jsonify, make_response, request

from app import db
from .models import Programme, programme_schema, programmes_schema
from datetime import datetime

mod = Blueprint('programmes', __name__)