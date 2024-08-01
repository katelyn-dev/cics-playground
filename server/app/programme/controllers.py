from flask import Blueprint, jsonify, make_response, request

from app import db
from .models import Programme, programme_schema, programmes_schema

mod = Blueprint('programmes', __name__)

@mod.route('/programme', methods=['GET'])
def getAll():
    if 'id' in request.args:
        programme_id = request.args['id']
        print(programme_id)

        programme = Programme.query.filter_by(id=programme_id).first()
        if programme:
            return make_response(programme_schema.dump(programme), 200)
        return make_response(jsonify({'message': 'programme not found'}), 404)

    programmes = Programme.query.all()
    return programmes_schema.dump(programmes)


@mod.route('/saveProgramme', methods=['POST'])
def saveProgramme():
    return "TODO saveProgramme()"


#POST /searchProgramme?id=&startDate=?&endDate=?
@mod.route('/searchProgramme', methods=['POST'])
def searchProgramme():
    return "TODO searchProgramme()"