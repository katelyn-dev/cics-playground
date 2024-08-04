import apiClient from "./apiClient";
import axios from "axios";

export const getCreatedFormJson = async (): Promise<Object> => {
  try {
    const response = await axios.get<any[]>('/data');
    return response.data;
  } catch (error) {
    console.log(`error`)
    return {
      title: "Product Feedback Survey",
      description: "Please take a few minutes to give us feedback about our product.",
      pages:[{
        "elements": [{
          "name": "username",
          "type": "text",
          "title": "Username",
          "maxLength": 25
        }, {
          "name": "email",
          "type": "text",
          "title": "E-mail address",
          "inputType": "email",
          "placeholder": "foobar@example.com",
          "isRequired": true,
          "autocomplete": "email"
        }, {
          "name": "password",
          "type": "text",
          "title": "Password",
          "description": "Enter 8 characters minimum.",
          "inputType": "password",
          "isRequired": true,
          "autocomplete": "password",
          "validators": [{
            "type": "text",
            "minLength": 8,
            "text": "Your password must be at least 8 characters long."
          }]
        }, {
          "name": "url",
          "type": "text",
          "title": "URL",
          "inputType": "url",
          "placeholder": "https://www.example.com",
          "validators": [{
            "type": "regex",
            "regex": "https://.*",
            "text": "Your answer must match the URL pattern."
          }]
        }],
        "showQuestionNumbers": false
      }]}
    //throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
  }
};


export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  console.log(`text: ${text}`)
  console.log(`targetLanguage: ${targetLanguage}`)
  const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';
  const API_KEY = 'AIzaSyDimA-L7Yqsc2W_nX5afvuRihqX3BPVpsk';
  try {
    const response = await axios.post(
      `${GOOGLE_TRANSLATE_API_URL}`,
      {
        q: text,
        target: targetLanguage,
        format: 'text',
      },
      {
        params: {
          key: API_KEY,
        },
      }
    );

    const translatedText = response.data.data.translations[0].translatedText;
    return translatedText;
  } catch (error) {
    return `TRANSLATION ERROR: ${error instanceof Error ? error.message : 'An unknown error occurred'}`;
  }
}