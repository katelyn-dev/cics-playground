from app import db, ma
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy import and_
from datetime import datetime

class Form(db.Model):
    __tablename__ = 'form'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    class_group_id = db.Column(db.String(255))
    form_id = db.Column(db.String(255))
    form_json = db.Column(db.Text)
    created_by = db.Column(db.String(255))
    last_updated_by = db.Column(db.String(255))
    is_active = db.Column(db.Boolean)
    start_time = db.Column(db.DateTime)
    last_modified_time = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
    
    @classmethod
    def create_form(cls, data):
        
        # Get the largest form ID with form_prefix
        form_prefix = data.get('form_prefix')
        max_form_id = db.session.query(
            db.func.max(db.cast(db.func.substring(cls.form_id, len(form_prefix) + 2), db.Integer))
        ).filter(cls.form_id.like(f"{form_prefix}_%")).scalar()

        # Determine the new form number
        new_form_number = 1 if max_form_id is None else max_form_id + 1

        # Generate the new form_id
        new_form_id = f"{form_prefix}_{new_form_number:05d}"

        # Create a new Form instance
        new_form = Form(
            form_id=new_form_id,
            form_json=str(data.get('form_json')),
            is_active = True,
            created_by=data.get('created_by'),
            last_updated_by=data.get('last_updated_by'),
            start_time=data.get('start_time')
        )

        # Add to the session and commit
        db.session.add(new_form)
        db.session.commit()

        return new_form_id
    
    @classmethod
    def apply_filters(cls, query_params):
        filters = []

        # Check for formID and add to filters if present
        form_id = query_params.get('formID')
        if form_id:
            filters.append(cls.form_id == form_id)

        # Check for startDate and endDate and add to filters if present
        start_date_str = query_params.get('startDate')
        end_date_str = query_params.get('endDate')
        if start_date_str and end_date_str:
            try:
                start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
                end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
                filters.append(and_(cls.start_time >= start_date, cls.start_time <= end_date))
            except ValueError:
                raise ValueError("Invalid date format")

        # Check for isActive and add to filters if present
        is_active = query_params.get('isActive')
        if is_active is not None:
            filters.append(cls.is_active == (is_active.lower() == 'true'))

        return filters

    def __repr__(self):
        rep = 'Form(' + str(self.class_group_id) + ',' + self.class_name_eng + ')'
        return rep
    
class FormSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Form
        load_instance = True
        sqla_session = db.session

"""
class EmergencyContact(db.Model):
    __tablename__ = 'emergency_contacts'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    application_id = db.Column(db.Integer, nullable=False)
    student_id = db.Column(db.Integer, nullable=False)
    guardian_full_name = db.Column(db.String(255))
    guardian_relationship = db.Column(db.String(255))
    emergency_contact_name = db.Column(db.String(255))
    emergency_relationship = db.Column(db.String(255))
    emergency_phone = db.Column(db.String(255))

    @classmethod
    def add_emergency_contact(cls, data):
        contact_data = {key: value for key, value in data.items() if hasattr(cls, key)}
        
        new_contact = cls(**contact_data)
        db.session.add(new_contact)
        db.session.commit()

        return new_contact.id

class Student(db.Model):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    lastname = db.Column(db.String(255), nullable=False)
    firstname = db.Column(db.String(255))
    gender = db.Column(db.String(10))
    phone_number = db.Column(db.String(20))
    email = db.Column(db.String(255))
    identity_status = db.Column(db.String(255))
    date_of_birth = db.Column(db.Date)
    age = db.Column(db.Integer)
    age_group = db.Column(db.String(255))
    address_street = db.Column(db.String(255))
    address_city = db.Column(db.String(255))
    address_postal_code = db.Column(db.String(255))
    country_of_origin = db.Column(db.String(255))
    length_of_residence = db.Column(db.String(255))
    is_first_time_apply = db.Column(db.String(1))
    is_followed_ig = db.Column(db.String(1))
    is_signed = db.Column(db.String(1))
    is_consent = db.Column(db.String(1))
    is_paid = db.Column(db.String(1))
    comment = db.Column(db.String(255))
    start_time = db.Column(db.DateTime)
    last_modified_time = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    @classmethod
    def add_student(cls, data):
        student_data = {key: value for key, value in data.items() if hasattr(cls, key)}
        
        new_student = cls(**student_data)
        db.session.add(new_student)
        db.session.commit()

        return new_student.id
    
    @classmethod
    def apply_filters(cls, query_params):
        filters = []

        email_str = query_params.get('email')
        if email_str:
            filters.append(cls.email == email_str)

        firstname_str = query_params.get('firstname')
        lastname_str = query_params.get('lastname')
        if firstname_str and lastname_str:
            filters.append(and_(cls.firstname == firstname_str , cls.lastname == lastname_str))

        return filters
"""

form_schema = FormSchema()
forms_schema = FormSchema(many=True)