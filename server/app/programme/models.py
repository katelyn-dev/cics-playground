from app import db, ma
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy import func
from datetime import datetime

class Programme(db.Model):
    __tablename__ = 'classes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    class_group_id = db.Column(db.String(255), nullable=False)
    class_name_eng = db.Column(db.String(255), nullable=False)
    class_name_zhcn = db.Column(db.String(255), nullable=False)
    class_name_zhhk = db.Column(db.String(255), nullable=False)
    has_subclass = db.Column(db.String(1), nullable=False)
    subclass_group_id = db.Column(db.String(255))
    has_extra_attributes = db.Column(db.String(1))
    extra_attributes_name = db.Column(db.String(255))
    extra_attributes = db.Column(JSON)
    class_start = db.Column(db.Date, nullable=False)
    class_end = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.DateTime)
    last_modified_time = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    def __repr__(self):
        rep = 'Programme(' + str(self.class_group_id) + ',' + self.class_name_eng + ')'
        return rep
    
        
class ProgrammeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Programme
        load_instance = True
        sqla_session = db.session

programme_schema = ProgrammeSchema()
programmes_schema = ProgrammeSchema(many=True)