from flask import Blueprint


mod = Blueprint('programme', __name__, url_prefix='/programme')

@mod.route('/', methods=['GET'])
def getAll():
    return "get all programme"