import apiClient from "./apiClient";
import axios from "axios";

interface FormResponse{
  form_json: string
}

// export const getCreatedFormJson = async (): Promise<Object> => {
//   try {
//     const requestUrl = process.env.REACT_APP_BASE_URL + "getForm?id=New_0002"
//     const response = await axios.get<any[]>(requestUrl);
//     return response.data;
//   } catch (error) {
//     console.log(`error`)
//     //throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
//   }
// };

export const getCreatedFormJson = async (id: string): Promise<string> => {
  try {
    const requestUrl = process.env.REACT_APP_BASE_URL + "getFormByFormId?id=" + id
    const response = await axios.get<any>(requestUrl)
    const data: FormResponse = response.data; 
    const formJson = data.form_json;
    // console.log(formJson)
    return formJson
  } catch (error) {
    console.log(`error`)
    throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
  }
};


export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  console.log(`text: ${text}`)
  console.log(`targetLanguage: ${targetLanguage}`)
  const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';
  const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
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