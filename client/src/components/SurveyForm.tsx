import React, {useEffect} from "react";
import {Survey} from "survey-react-ui";
import {Model, StylesManager} from "survey-core";
import 'survey-core/defaultV2.min.css';
import {useQuery} from "react-query";
import {getCreatedFormJson, getCreatedFormsJson} from "../api/dataService";

// Initialize SurveyJS styles
StylesManager.applyTheme("defaultV2");


interface SurveyFormProps {
  id: number;
}

const SurveyForm: React.FC<SurveyFormProps> = ({id}) => {
  console.log(`number: ${id}`)
  const { data, error, isLoading } = useQuery<Object, Error>(
    ["getCreatedFormsJson", id], // Include id in the query key
    () => getCreatedFormsJson(id) // Pass id via the closure
  );

  useEffect(() => {
    if(isLoading || !data) return;

    const survey = new Model(data);
    //survey.locale = "en";
    //survey.language = "zh-cn";

    survey.onComplete.add((sender, options) => {
      console.log(JSON.stringify(sender.data, null, 3));
    });
  }, []);

  const survey = new Model(data);
  //survey.locale = "zh-cn";
  //survey.language = "zh-cn";
  survey.onComplete.add((sender, options) => {
    console.log(JSON.stringify(sender.data, null, 3));
  });
  return (<Survey model={survey} />);
}

export default SurveyForm;