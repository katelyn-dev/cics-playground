class Config:
    """Base config class."""
    SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://b4b2012141ee2d:93cb9e46@us-cluster-east-01.k8s.cleardb.net/heroku_59b51c439535838'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    """Email js keys"""
    EMAILJS_USERID = '0JRyDH_Jxdoy1H8E0'
    EMAILJS_SERVICE_ID = 'service_bl5fpv5'
    EMAILJS_FROM_NAME = 'CICS_Hackerthon_GP3'
    EMAILJS_ACCESS_TOKEN = 'VSs1PMa7tuyhIA43E4KlX'
    EMAILJS_TEMPLATE_ID = 'template_3h5evkn'
