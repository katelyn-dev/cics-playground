import React, { useEffect, useState } from "react";
import { Survey } from "survey-react-ui";
import { Model, StylesManager } from "survey-core";
import 'survey-core/defaultV2.min.css';
import { useQuery } from "react-query";
import { getCreatedFormJson } from "../api/dataService";
import cicsLogo from '../static/image/cics-logo.png'
import { Helper } from "./Helper";
import axios from "axios";

// Initialize SurveyJS styles
StylesManager.applyTheme("defaultV2");


interface SurveyFormProps {
  id: string;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ id }) => {
  console.log(`number: ${id}`)
  const [bgimage, setBgimage] = useState<string>('');
  const { data, error, isLoading } = useQuery<Object, Error>(
    ["getCreatedFormJson", id], // Include id in the query key
    () => getCreatedFormJson(id) // Pass id via the closure
  )
  useEffect(() => { 
    setBgimage(Helper.getRandomBackground())
  }, [])
  // useEffect(() => {
  //   if (isLoading || !data) return;

  //   const survey = new Model(JSON.stringify(data));
  //   survey.locale = "default";
  //   survey.language = "default";
  //   survey.logo = cicsLogo
  //   debugger
  //   survey.onComplete.add((sender, options) => {
  //     console.log(JSON.stringify(sender.data, null, 3));
  //   });
  // }, []);

  const survey = new Model(data);
  survey.focusFirstQuestionAutomatic = false;
  survey.locale = 'default'
  survey.language = "default";
  survey.logo = cicsLogo
  survey.backgroundImage = bgimage

  survey.onComplete.add(async (sender, options) => {
    console.log(JSON.stringify(sender.data, null, 3));
    //1.check email + formId in application, if exist return
    //2. save students + class + (emergency_contact) in application
    // const formResponse = await axios.post<FormResponse>(saveFormUrl, saveFormRequest, Helper.postRequestHeader);
  });
  return (
    <main>
      <Survey styles={{ padding: '15rem', marginTop: '60px' }}
        model={survey} />
    </main>
  );



    // const survey = new Model(surveyJson);

    // return <Survey model={survey} />;



}

export default SurveyForm;