import React, { useEffect, useState } from "react";
import { Survey } from "survey-react-ui";
import {Model, Question, StylesManager} from "survey-core";
import 'survey-core/defaultV2.min.css';
import { useQuery } from "react-query";
import { getCreatedFormJson } from "../api/dataService";
import cicsLogo from '../static/image/cics-logo.png'
import { Helper } from "./Helper";
import '../styles/SurveyForm.module.css'

// Initialize SurveyJS styles
StylesManager.applyTheme("defaultV2");


interface SurveyFormProps {
  id: string;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ id }) => {
  console.log(`number: ${id}`)
  const { data, error, isLoading } = useQuery<Object, Error>(
    ["getCreatedFormJson", id], // Include id in the query key
    () => getCreatedFormJson(id) // Pass id via the closure
  );
  const [bgimage, setBgimage] = useState<string>('');
  const [locale, setLocale] = useState<string>('default');

  useEffect(() => { 
    setBgimage(Helper.getRandomBackground())
  },[])

  const survey = new Model(data);
  survey.locale = locale
  survey.logo = cicsLogo
  survey.backgroundImage = bgimage


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
    survey.locale = locale;
  }

  survey.onComplete.add((sender, options) => {
    console.log(JSON.stringify(sender.data, null, 3));
  });

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
      <Survey styles={{ padding: '15rem' }} model={survey} />
    </main>);
}

export default SurveyForm;