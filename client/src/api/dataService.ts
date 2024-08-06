import apiClient from "./apiClient";
import axios from "axios";

export const getCreatedFormJson = async (): Promise<Object> => {
  try {
    const response = await axios.get<any[]>('/data');
    return response.data;
  } catch (error) {
    console.log(`error`)
    return {
      "title": {
        "default": "Product Feedback Survey",
        "zh-cn": "产品反馈调查",
        "zh-tw": "產品回饋調查"
      },
      "description": {
        "default": "Please take a few minutes to give us feedback about our product.",
        "zh-cn": "请花几分钟时间向我们提供有关我们产品的反馈。",
        "zh-tw": "請花幾分鐘時間向我們提供有關我們產品的回饋。"
      },
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "username",
              "title": {
                "default": "Username",
                "zh-cn": "用户名",
                "zh-tw": "使用者名稱"
              },
              "maxLength": 25
            },
            {
              "type": "text",
              "name": "email",
              "title": {
                "default": "E-mail address",
                "zh-cn": "电子邮件地址",
                "zh-tw": "電子郵件地址"
              },
              "isRequired": true,
              "inputType": "email",
              "autocomplete": "email",
              "placeholder": "foobar@example.com"
            },
            {
              "type": "text",
              "name": "password",
              "title": {
                "default": "Password",
                "zh-cn": "密码",
                "zh-tw": "密碼"
              },
              "description": {
                "default": "Enter 8 characters minimum.",
                "zh-cn": "至少输入 8 个字符。",
                "zh-tw": "至少輸入 8 個字元。"
              },
              "isRequired": true,
              "validators": [
                {
                  "type": "text",
                  "text": "Your password must be at least 8 characters long.",
                  "minLength": 8
                }
              ],
              "inputType": "password",
              "autocomplete": "password"
            },
            {
              "type": "text",
              "name": "url",
              "title": {
                "default": "URL",
                "zh-cn": "网址",
                "zh-tw": "網址"
              },
              "validators": [
                {
                  "type": "regex",
                  "text": "Your answer must match the URL pattern.",
                  "regex": "https://.*"
                }
              ],
              "inputType": "url",
              "placeholder": "https://www.example.com"
            }
          ]
        }
      ]
    }
    //throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
  }
};

export const getCreatedFormsJson = async (id: number): Promise<Object> => {
  try {
    const response = await axios.get<any[]>('/data');
    return response.data;
  } catch (error) {
    console.log(`error`)
    const result = [
      {
        "id": "2",
        "title": {
          "default": "Test2",
          "zh-cn": "产品反馈调查",
          "zh-tw": "產品回饋調查"
        },
        "description": {
          "default": "Please take a few minutes to give us feedback about our product haha.",
          "zh-cn": "请花几分钟时间向我们提供有关我们产品的反馈。",
          "zh-tw": "請花幾分鐘時間向我們提供有關我們產品的回饋。"
        },
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "username",
                "title": {
                  "default": "Username",
                  "zh-cn": "用户名",
                  "zh-tw": "使用者名稱"
                },
                "readOnly": true,
                "maxLength": 25,
                "defaultValue": "test",
                "content": false,
                "allowEdit": false,
              },
              {
                "type": "text",
                "name": "email",
                "title": {
                  "default": "E-mail address",
                  "zh-cn": "电子邮件地址",
                  "zh-tw": "電子郵件地址"
                },
                "allowEdit": false,
                "content": false,
                "isRequired": true,
                "inputType": "email",
                "autocomplete": "email",
                "placeholder": "foobar@example.com"
              },
              {
                "type": "text",
                "name": "password",
                "title": {
                  "default": "Password",
                  "zh-cn": "密码",
                  "zh-tw": "密碼"
                },
                "description": {
                  "default": "Enter 8 characters minimum.",
                  "zh-cn": "至少输入 8 个字符。",
                  "zh-tw": "至少輸入 8 個字元。"
                },
                "isRequired": true,
                "validators": [
                  {
                    "type": "text",
                    "text": "Your password must be at least 8 characters long.",
                    "minLength": 8
                  }
                ],
                "inputType": "password",
                "autocomplete": "password"
              },
              {
                "type": "text",
                "name": "url",
                "title": {
                  "default": "URL",
                  "zh-cn": "网址",
                  "zh-tw": "網址"
                },
                "validators": [
                  {
                    "type": "regex",
                    "text": "Your answer must match the URL pattern.",
                    "regex": "https://.*"
                  }
                ],
                "inputType": "url",
                "placeholder": "https://www.example.com"
              }
            ]
          }
        ]
      },
  {
      "id": "1",
      "title": {
        "default": "Product Feedback Survey",
        "zh-cn": "产品反馈调查",
        "zh-tw": "產品回饋調查"
      },
      "description": {
        "default": "Please take a few minutes to give us feedback about our product.",
        "zh-cn": "请花几分钟时间向我们提供有关我们产品的反馈。",
        "zh-tw": "請花幾分鐘時間向我們提供有關我們產品的回饋。"
      },
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "username",
              "title": {
                "default": "Username",
                "zh-cn": "用户名",
                "zh-tw": "使用者名稱"
              },
              "maxLength": 25
            },
            {
              "type": "text",
              "name": "email",
              "title": {
                "default": "E-mail address",
                "zh-cn": "电子邮件地址",
                "zh-tw": "電子郵件地址"
              },
              "isRequired": true,
              "inputType": "email",
              "autocomplete": "email",
              "placeholder": "foobar@example.com"
            },
            {
              "type": "text",
              "name": "password",
              "title": {
                "default": "Password",
                "zh-cn": "密码",
                "zh-tw": "密碼"
              },
              "description": {
                "default": "Enter 8 characters minimum.",
                "zh-cn": "至少输入 8 个字符。",
                "zh-tw": "至少輸入 8 個字元。"
              },
              "isRequired": true,
              "validators": [
                {
                  "type": "text",
                  "text": "Your password must be at least 8 characters long.",
                  "minLength": 8
                }
              ],
              "inputType": "password",
              "autocomplete": "password"
            },
            {
              "type": "text",
              "name": "url",
              "title": {
                "default": "URL",
                "zh-cn": "网址",
                "zh-tw": "網址"
              },
              "validators": [
                {
                  "type": "regex",
                  "text": "Your answer must match the URL pattern.",
                  "regex": "https://.*"
                }
              ],
              "inputType": "url",
              "placeholder": "https://www.example.com"
            }
          ]
        }
      ]
    }]
    return result[id]
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