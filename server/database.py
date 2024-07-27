from sqlalchemy import create_engine, text
import os

db_connection_string = 'mysql+mysqlconnector://b4b2012141ee2d:93cb9e46@us-cluster-east-01.k8s.cleardb.net/heroku_59b51c439535838'

exists = os.path.exists("ssl/cleardb-ca.pem") 
print(exists)

engine = create_engine(
  db_connection_string, 
  connect_args={
      "ssl_ca": "ssl/cleardb-ca.pem"
  })

with engine.connect() as conn:
  result = conn.execute(text("select * from applicants"))
  print(result.all()[0].lastName)


# def load_jobs_from_db():
#   with engine.connect() as conn:
#     result = conn.execute(text("select * from jobs"))
#     jobs = []
#     for row in result.all():
#       jobs.append(dict(row))
#     return jobs

# def load_job_from_db(id):
#   with engine.connect() as conn:
#     result = conn.execute(
#       text("SELECT * FROM jobs WHERE id = :val"),
#       val=id
#     )
#     rows = result.all()
#     if len(rows) == 0:
#       return None
#     else:
#       return dict(rows[0])


# def add_application_to_db(job_id, data):
#   with engine.connect() as conn:
#     query = text("INSERT INTO applications (job_id, full_name, email, linkedin_url, education, work_experience, resume_url) VALUES (:job_id, :full_name, :email, :linkedin_url, :education, :work_experience, :resume_url)")

#     conn.execute(query, 
#                  job_id=job_id, 
#                  full_name=data['full_name'],
#                  email=data['email'],
#                  linkedin_url=data['linkedin_url'],
#                  education=data['education'],
#                  work_experience=data['work_experience'],
#                  resume_url=data['resume_url'])