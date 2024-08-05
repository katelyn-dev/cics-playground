from flask import Blueprint, jsonify, make_response, request

from app import db
from .models import Programme, programme_schema, programmes_schema
from datetime import datetime

mod = Blueprint('programmes', __name__)

# http://127.0.0.1:8080/programme?id=1
"""
    Query parameters:
    - id (optional): The ID of the class to retrieve. Return all classes if ID is not provided
"""
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

# http://127.0.0.1:8080/searchProgramme?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
"""
    Query parameters:
    - startDate (required): The start date for the search in YYYY-MM-DD format.
    - endDate (required): The end date for the search in YYYY-MM-DD format.
"""
@mod.route('/searchProgramme', methods=['GET'])
def searchProgramme():
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
        programmes = Programme.query.filter(
            Programme.class_start >= start_date,
            Programme.class_start <= end_date
        ).all()
        
        if programmes:
          return make_response(programmes_schema.dump(programmes), 200)
        return make_response(jsonify({'message': 'classes not found'}), 404)
    else:
        return jsonify({"error": "Missing startDate or endDate parameter"}), 400

# http://127.0.0.1:8080/saveProgramme 
"""
    Example JSON payload:
    {
        "class_group_id": "CL2001",
        "class_name_eng": "Summer 2024 Specific Skills Camp (Age 10-14)",
        "class_name_zhcn": "2024技能夏令营 (10-14 岁)",
        "class_name_zhhk": "2024技能夏令營 (10-14 歲)",
        "class_start": "2024-07-30",
        "class_end": "2024-09-15",
        "extra_attributes": {
            "extra_attributes": [
                "Before Care (7:30am to 9:00am)",
                "After Care (3:00pm to 6:00pm)",
                "Before and After Care (7:30am to 9:00am & 3:00pm to 6:00pm)",
                "Do not need"
            ]
        },
        "extra_attributes_name": "Before and/or After Camp Option",
        "has_extra_attributes": "T",
        "has_subclass": "T",
        "start_time": "2024-07-25T02:54:08",
        "subclass_group_id": "SCL2001"
    }
"""
@mod.route('/saveProgramme', methods=['POST'])
def saveProgramme():
    data = request.get_json()
    
    if not data:
        return make_response(jsonify({'message': "Invalid request body"}), 400)

    if 'class_group_id' not in data or 'class_name_eng' not in data or 'class_name_zhcn' not in data or 'class_name_zhhk' not in data:
        return make_response(jsonify({'message': "Missing class_group_id / class_name_eng / class_name_zhcn / class_name_zhhk"}), 400)

    class_start = data.get('class_start')
    class_end = data.get('class_end')
    start_time = data.get('start_time')
    if not class_start or not class_end:
        return make_response(jsonify({'message': "Missing class_start / class_end"}), 400)

    try:
        # Handle user-defined date and datetime
        class_start = datetime.strptime(class_start, '%Y-%m-%d').date()
        class_end = datetime.strptime(class_end, '%Y-%m-%d').date()
        if start_time:
             start_time = datetime.strptime(data.get('start_time'), '%Y-%m-%dT%H:%M:%S')
    except ValueError as e:
        return make_response(jsonify({'message': 'Bad Request', 'error': str(e)}), 400)

    if 'extra_attributes' in data and not isinstance(data['extra_attributes'], dict):
        return make_response(jsonify({"error": "Invalid extra_attibutes, expected a dictionary"}), 400)
  
    new_programme = Programme(class_group_id=data['class_group_id'], 
                         class_name_eng=data['class_name_eng'],
                         class_name_zhcn=data['class_name_zhcn'],
                         class_name_zhhk=data['class_name_zhhk'],
                         has_subclass = data['has_subclass'],
                         subclass_group_id = data['subclass_group_id'],
                         has_extra_attributes = data['has_extra_attributes'],
                         extra_attributes_name = data['extra_attributes_name'],
                         extra_attributes = data['extra_attributes'],
                         class_start=class_start,
                         class_end=class_end,
                         start_time=start_time
                         )

    db.session.add(new_programme)
    db.session.commit()

    return make_response(jsonify(programme_schema.dump(new_programme)),201)