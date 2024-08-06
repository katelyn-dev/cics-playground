import requests

class EmailController:
    def __init__(self, service_id, user_id, from_name, access_token, template_id):
        self.service_id = service_id
        self.user_id = user_id
        self.from_name = from_name
        self.access_token = access_token
        self.template_id = template_id

    def send_email(self, to_email, to_name, registration_detail, registration_fee, payment_link):
        
        # EmailJS API endpoint
        url = 'https://api.emailjs.com/api/v1.0/email/send'

        # Prepare the email payload
        payload = {
            'service_id': self.service_id,
            'user_id': self.user_id,
            'accessToken': self.access_token,
            'template_id': self.template_id,
            'template_params': {
                'to_email': to_email,
                'to_name': to_name,
                'registration_detail': registration_detail,
                'registration_fee': registration_fee,
                'payment_link': payment_link,
                'from_name': self.from_name
            }
        }

        # Send the email
        response = requests.post(url, json=payload)

        if response.status_code == 200:
            print('Email sent successfully.')
        else:
            print('Failed to send email.', response.status_code, response.text)