from app import db, ma
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy import and_
from datetime import datetime

class Form_Template(db.Model):
    __tablename__ = 'form_template'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255))
    form_json = db.Column(db.Text)
  
    def __repr__(self):
        rep = 'FormTemplate(' + str(self.name) + ',' + self.form_json + ')'
        return rep
    
class FormTemplateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Form_Template
        load_instance = True
        sqla_session = db.session

form_template_schema = FormTemplateSchema()
forms_template_schema = FormTemplateSchema(many=True)