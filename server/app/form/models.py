from app import db, ma
from sqlalchemy.dialects.mysql import JSON

class Form(db.Model):
    __tablename__ = 'form'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    form_json = db.Column(db.Text(255))
    created_by = db.Column(db.String(255))
    last_updated_by = db.Column(db.String(255))
    start_time = db.Column(db.DateTime)
    last_modified_time = db.Column(db.DateTime, onupdate=db.func.now())

    def create_form(self, data):
        # Create a new Form instance
        new_form = Form(
            form_json=str(data.get('form_json')),
            created_by=data.get('created_by'),
            last_updated_by=data.get('last_updated_by'),
            start_time=data.get('start_time')
        )

        # Add to the session and commit
        db.session.add(new_form)
        db.session.commit()

    def __repr__(self):
        rep = 'Form(' + str(self.class_group_id) + ',' + self.class_name_eng + ')'
        return rep
    
        
class FormSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Form
        load_instance = True
        sqla_session = db.session

form_schema = FormSchema()
forms_schema = FormSchema(many=True)