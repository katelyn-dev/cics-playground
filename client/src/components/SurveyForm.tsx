import React, {useEffect, useRef, useState} from "react";
import { Survey } from "survey-react-ui";
import {Model, StylesManager, SurveyModel} from "survey-core";
import 'survey-core/defaultV2.min.css';
import { useQuery } from "react-query";
import { getCreatedFormJson } from "../api/dataService";
import cicsLogo from '../static/image/cics-logo.png'
import { Helper } from "./Helper";
import '../styles/SurveyForm.module.css'
import axios from "axios";
import { toEmailRequest } from "./PaylaodMapper";

// Initialize SurveyJS styles
StylesManager.applyTheme("defaultV2");

export interface ProgrammeDetail {
  class_name_eng: string;
  class_name_zhhk: string;
  class_name_zhcn: string;
  class_group_id: string;
  class_fee: string;
  start_time: string;
  class_end: string;
}

interface SubmitResponse {
  id: string;
  status: string;
  class_group_id: string;
}

interface SurveyFormProps {
  id: string;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ id }) => {
  console.log(`number: ${id}`)
  const { data, error, isLoading } = useQuery<any, Error>(
    ["getCreatedFormJson", id], // Include id in the query key
    () => getCreatedFormJson(id) // Pass id via the closure
  );
  const [bgimage, setBgimage] = useState<string>('');
  const [locale, setLocale] = useState<string>('default');
  const surveyRef = useRef<SurveyModel | null>(null);
  const [surveyModel, setSurveyModel] = useState<SurveyModel | null>(null);

  const renderButton = (text: string, func: ()=> void, canRender: boolean) => {
    if(!canRender) return undefined;

    return (
      <button className="navigation-button" onClick={func}>
        {text}
      </button>
    )
  }


  const changeLanguage = (locale: string) => {
    setLocale(locale);
    if(!surveyRef?.current) return;
    surveyRef.current.locale = locale;
  }

  useEffect(() => {
    if (surveyModel) {
      // Create a new <style> element
      const styleElement = document.createElement("style");
      styleElement.innerHTML = `
        .sd-question__content {
          text-align: left !important;
        }
        .sd-question__title {
          text-align: left !important;
        }
      `;

      // Append the <style> element to the document's <head>
      document.head.appendChild(styleElement);

      // Clean up the <style> element when the component is unmounted
      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [surveyModel]);

  useEffect(() => { 
    setBgimage(Helper.getRandomBackground())
  }, [])

  useEffect(() => {
    if(!data || isLoading) return;

    try {
      const survey = new Model(data);
      survey.locale = locale
      survey.logo = cicsLogo
      survey.backgroundImage = bgimage

      survey.onComplete.add(async (sender, optipons) => {
        console.log(JSON.stringify(sender.data, null, 3));
        const request = {"formId": id, ...sender.data}
        //save student and application
        const submitUrl = process.env.REACT_APP_BASE_URL + "saveStudent"
        const submitResponse = await axios.post<SubmitResponse>(submitUrl, request, Helper.postRequestHeader);
        const applicationId = submitResponse.data.id
        const classGroupId = submitResponse.data.class_group_id
        //send confirmation email
        const searchProgrammeUrl = process.env.REACT_APP_BASE_URL + "searchProgramme?id=" + classGroupId
        const response = await axios.get<any[]>(searchProgrammeUrl);
        const programmeDetails: ProgrammeDetail[] = response.data
        const paymentLink = process.env.REACT_APP_BASE_URL + "payment.html?applicationId=" + applicationId
        const to_email = request.email
        const to_name = request.firstname + ' ' + request.lastname
        const emailRequest = toEmailRequest(to_email, to_name, programmeDetails, paymentLink)
        const emailUrl = process.env.REACT_APP_BASE_URL + "emailNotification"
        const emailResponse = await axios.post<SubmitResponse>(emailUrl, emailRequest, Helper.postRequestHeader);
        if (emailResponse.status == 200) {
          console.log("email sent")
        }
      });
      console.log(`called`)
      setSurveyModel(survey);
      surveyRef.current = survey;

    } catch (error) {
      console.error(error);
    }

  }, [data, isLoading]);

  return (
    <main>
      <div className="navigation-block">
        <div className="navigation-buttons-container">
      {
        renderButton("Traditional Chinese", ()=> {changeLanguage("zh-tw")}, true)
      }
          {
            renderButton("Simplify Chinese", () => {changeLanguage("zh-cn")}, true)
          }
          {
            renderButton("English", () => {changeLanguage("default")}, true)
          }
        </div>
      </div>
      {surveyModel && <Survey styles={{ padding: "15rem" }} model={surveyModel} />}
    </main>);
}

export default SurveyForm;