from app import db, ma
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy import func, and_
from datetime import datetime

class Programme(db.Model):
    __tablename__ = 'classes'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    class_group_id = db.Column(db.String(255), nullable=False)
    class_name_eng = db.Column(db.String(255), nullable=False)
    class_name_zhcn = db.Column(db.String(255), nullable=False)
    class_name_zhhk = db.Column(db.String(255), nullable=False)
    target_audience = db.Column(db.String(255), nullable=False)
    class_fee = db.Column(db.String(255))
    has_subclass = db.Column(db.String(1), nullable=False)
    subclass_group_id = db.Column(db.String(255), nullable=True)
    has_extra_attributes = db.Column(db.String(1), nullable=True)
    extra_attributes_name = db.Column(db.String(255), nullable=True)
    extra_attributes = db.Column(JSON, nullable=True)
    class_start = db.Column(db.Date, nullable=False)
    class_end = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.DateTime, nullable=True)
    last_modified_time = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    def __repr__(self):
        rep = 'Programme(' + str(self.class_group_id) + ',' + self.class_name_eng + ')'
        return rep
    
        
class ProgrammeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Programme
        load_instance = True
        sqla_session = db.session


class Students(db.Model):
    __tablename__ = "students"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    lastname = db.Column(db.String(255))
    firstname = db.Column(db.String(255))
    gender = db.Column(db.String(255))
    phone_number = db.Column(db.String(255))
    email = db.Column(db.String(255))
    identity_status = db.Column(db.String(255))
    date_of_birth = db.Column(db.Date)
    age = db.Column(db.Integer)
    address_street = db.Column(db.String(255))
    address_city = db.Column(db.String(255))
    address_postal_code = db.Column(db.String(255))
    country_of_origin = db.Column(db.String(255))
    length_of_residence = db.Column(db.String(255))
    is_first_time_apply = db.Column(db.String(255))
    is_followed_ig = db.Column(db.String(255))
    is_signed = db.Column(db.String(255))
    is_consent = db.Column(db.String(255))
    comment = db.Column(db.String(255))
    start_time = db.Column(db.DateTime)
    last_modified_time = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    def __repr__(self):
        rep = 'Students(' + str(self.id) + ',' + self.lastname + ')'
        return rep
    
    @classmethod
    def create_student(cls, data):
        max_id = db.session.query(func.max(cls.id)).scalar()  # Get the maximum ID value
        new_id = (max_id or 0) + 1 
        new_student = Students(
            id = new_id,
            lastname=data.get('lastname'), 
            firstname=data.get('firstname'),
            gender=data.get('gender'),
            phone_number = data.get('phone_number'),
            email = data.get('email'),
            date_of_birth = data.get('date_of_birth'),
            age = data.get('age'),
            address_street = data.get('address_street'),
            address_city = data.get('address_city'),
            address_postal_code=data.get('address_postal_code'),
            country_of_origin=data.get('country_of_origin'),
            length_of_residence=data.get('length_of_residence'),
            is_first_time_apply=data.get('is_first_time_apply'),
            is_followed_ig=data.get('is_followed_ig'),
            is_signed=data.get('is_signed'),
            is_consent=data.get('is_consent'),
            comment=data.get('comment'),
            )
        db.session.add(new_student)
        db.session.commit()
        print(new_id)
        return new_id
    
    @classmethod
    def add_student(cls, data):
        student_data = {key: value for key, value in data.items() if hasattr(cls, key)}
        
        new_student = cls(**student_data)
        db.session.add(new_student)
        db.session.commit()

        return new_student.id
   
class StudentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Students
        load_instance = True
        sqla_session = db.session

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
    
    @classmethod
    def apply_filters(cls, query_params):
        filters = []

        student_id = query_params.get('student_id')
        if student_id:
            filters.append(cls.student_id == student_id)

        return filters

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_id = db.Column(db.String(255), db.ForeignKey('students.id'))
    class_group_id = db.Column(db.String(255), db.ForeignKey('classes.class_group_id'))
    emergency_contact_id = db.Column(db.String(255), db.ForeignKey('emergency_contacts.id'))
    pick_up_by = db.Column(db.String(255))
    last_modified_time = db.Column(db.BigInteger)
    is_paid = db.Column(db.String(255))
    student = db.relationship('Students', foreign_keys=[student_id])
    class_info = db.relationship('Programme', foreign_keys=[class_group_id])
    emergency_contact_info = db.relationship('EmergencyContact', foreign_keys=[emergency_contact_id])
    
    def __repr__(self):
        return f"<Application(id={self.id}, student_id={self.student_id}, class_group_id={self.class_group_id}, is_paid={self.is_paid})>"


    @classmethod
    def makePayment(cls, application_id, paid):
        application = cls.query.filter_by(id=application_id).one()
        application.is_paid = paid
        db.session.commit()
        
    def create_application(cls, data, student_id, class_group_id):
        new_application = Application(
            student_id = student_id, 
            class_group_id = class_group_id, 
            pick_up_by = data.get('pick_up_by'), 
            is_paid = data.get('is_paid'), 
        )
        db.session.add(new_application)
        db.session.commit()

        filters = []
        filters.append(Application.student_id == student_id)
        filters.append(Application.class_group_id == class_group_id)  
        application = Application.query.filter(*filters).all()
        return application
    
    emergency_contact_info = db.relationship('EmergencyContact', foreign_keys=[emergency_contact_id])

class ApplicationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Students
        load_instance = True
        sqla_session = db.session

programme_schema = ProgrammeSchema()
programmes_schema = ProgrammeSchema(many=True)

student_schema = StudentSchema()
students_schema = StudentSchema(many=True)

application_schema = ApplicationSchema()
applications_schema = ApplicationSchema(many=True)
