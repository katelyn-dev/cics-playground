import apiClient from "./apiClient";
import axios from "axios";

interface FormResponse {
  form_json: string
}

interface Translations {
  translatedText: string;
  detectedSourceLanguage: string;
}
interface TranslateResponse {
  translations: Translations
}

export const getCreatedFormJson = async (id: string): Promise<any> => {
  console.log(`id: ${id}`)
  // id ="New_00002"
  try {
    const requestUrl = process.env.REACT_APP_BASE_URL + "getFormByFormId?id=" + id
    console.log(`requesturl: ${requestUrl}`)
    const response = await axios.get<any>(requestUrl)
    const data: FormResponse = response.data;
    const formJson = JSON.parse(data.form_json);
    console.log(formJson)
    return formJson
  } catch (error) {
    console.log(`error`)
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred");
  }
};


export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  console.log(`text: ${text}`)
  console.log(`targetLanguage: ${targetLanguage}`)
  const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';
  const API_KEY = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY;
  console.log(API_KEY)

  try {
    const response = await axios.get<any>(`${GOOGLE_TRANSLATE_API_URL}`,
      {
        params:
        {
          q: text,
          target: targetLanguage,
          format: 'text',
          key: API_KEY
        }
      }
    );

    const translatedText = response.data.data.translations[0].translatedText;
    return translatedText;
  } catch (error) {
    return `TRANSLATION ERROR: ${error instanceof Error ? error.message : 'An unknown error occurred'}`;
  }
}