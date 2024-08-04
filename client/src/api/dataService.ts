import apiClient from "./apiClient";
import axios from "axios";

export const getCreatedFormJson = async (): Promise<Object> => {
  try {
    const response = await axios.get<any[]>('/data');
    return response.data;
  } catch (error) {
    console.log(`error`)
    return {
      title: {
        default: "Product Feedback Survey",
        "zh-cn": "产品反馈调查"
      },
      description: {
        default: "Please take a few minutes to give us feedback about our product.",
        "zh-cn": "请花几分钟时间给我们提供关于我们产品的反馈。"
      },
      pages:[{
        "elements": [{
          "name": "username",
          "type": "text",
          "title": {
            default:"Username",
            "zh-cn": "用户名",
            "zh-tw": "用戶名"
          },
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
          "title": {
            default: "Password",
            "zh-cn": "密码",
            "zh-tw": "密碼"
          },
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
          "title": {
            default: "URL",
            "zh-cn": "网址",
            "zh-tw": "網址"
          },
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