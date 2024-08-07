from flask import Blueprint, jsonify, make_response, request
from sqlalchemy import cast, func, not_

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

        programmes = Programme.query.filter_by(class_group_id=programme_id).all()
        if programmes:
            return make_response(programmes_schema.dump(programmes), 200)
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
    programme_id = request.args.get('id')
    name = request.args.get('name')
    start_date_str = request.args.get('startDate')
    end_date_str = request.args.get('endDate')

    # Build query filters dynamically
    filters = []

    filters.append(not_(Programme.class_group_id.startswith("SCL")))
    if programme_id:
        filters.append(Programme.class_group_id == programme_id)

    if name:
        filters.append(Programme.class_name_eng.like(f"%{name}%"))  # Use LIKE for partial matches

    if start_date_str:
        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            filters.append(Programme.class_start >= start_date)
        except ValueError:
            return jsonify({"error": "Invalid start date format"}), 400

    if end_date_str:
        try:
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
            filters.append(Programme.class_end <= end_date)
        except ValueError:
            return jsonify({"error": "Invalid end date format"}), 400

    # Construct and print the query for debugging
    query = Programme.query.filter(*filters)
    print("Constructed Query:", str(query))

    # Execute the query
    programmes = query.all()

    if programmes:
        return make_response(programmes_schema.dump(programmes), 200)
    else:
        return make_response(jsonify({'message': 'Classes not found'}), 404)

# http://127.0.0.1:8080/saveProgramme 
"""
    Example JSON payload:
    {
        "class_group_id": "CL2001",
        "class_name_eng": "Summer 2024 Specific Skills Camp (Age 10-14)",
        "class_name_zhcn": "2024技能夏令营 (10-14 岁)",
        "class_name_zhhk": "2024技能夏令營 (10-14 歲)",
        "target_audience": "junior",
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
    
    class_prefix = 'CL'
    max_class_group_id = db.session.query(
        db.func.max(db.cast(db.func.substring(Programme.class_group_id, len(class_prefix) + 2), db.Integer))
    ).filter(Programme.class_group_id.like(f"{class_prefix}_%")).scalar()
    new_class_group = 1 if max_class_group_id is None else max_class_group_id + 1
    new_class_group_id = f"{class_prefix}{new_class_group:05d}"

    if not data:
        return make_response(jsonify({'message': "Invalid request body"}), 400)

    if 'class_name_eng' not in data or 'class_name_zhcn' not in data or 'class_name_zhhk' not in data:
        return make_response(jsonify({'message': "Missing class_name_eng / class_name_zhcn / class_name_zhhk"}), 400)

    class_start = data.get('class_start')
    class_end = data.get('class_end')
    start_time = data.get('start_time')
    if not class_start or not class_end:
        return make_response(jsonify({'message': "Missing class_start / class_end"}), 400)

    try:
        class_start = datetime.strptime(class_start, '%Y-%m-%d').date()
        class_end = datetime.strptime(class_end, '%Y-%m-%d').date()
        if start_time:
             start_time = datetime.strptime(data.get('start_time'), '%Y-%m-%dT%H:%M:%S')
    except ValueError as e:
        return make_response(jsonify({'message': 'Bad Request', 'error': str(e)}), 400)

    if 'extra_attributes' in data and not isinstance(data['extra_attributes'], dict):
        return make_response(jsonify({"error": "Invalid extra_attibutes, expected a dictionary"}), 400)

    new_programme = Programme(class_group_id=new_class_group_id, 
                         class_name_eng=data.get('class_name_eng'),
                         class_name_zhcn=data.get('class_name_zhcn'),
                         class_name_zhhk=data.get('class_name_zhhk'),
                         has_subclass = data.get('has_subclass'),
                         class_fee = data.get('class_fee'),
                         subclass_group_id = data.get('subclass_group_id'),
                         has_extra_attributes = data.get('has_extra_attributes'),
                         extra_attributes_name = data.get('extra_attributes_name'),
                         extra_attributes = data.get('extra_attributes'),
                         class_start=class_start,
                         class_end=class_end,
                         start_time=start_time
                         )

    db.session.add(new_programme)
    db.session.commit()

    return make_response(jsonify(programme_schema.dump(new_programme)),201)