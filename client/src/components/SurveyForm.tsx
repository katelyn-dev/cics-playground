import React, {useEffect} from "react";
import {Survey} from "survey-react-ui";
import {Model, StylesManager} from "survey-core";
import 'survey-core/defaultV2.min.css';
import {useQuery} from "react-query";
import {getCreatedFormJson} from "../api/dataService";

// Initialize SurveyJS styles
StylesManager.applyTheme("defaultV2");


const SurveyForm: React.FC = () => {
  const { data, error, isLoading } = useQuery<Object,Error>({queryKey: ['getCreatedFormJson'], queryFn: getCreatedFormJson});

  useEffect(() => {
    if(isLoading || !data) return;

    const survey = new Model(data);
    survey.onComplete.add((sender, options) => {
      console.log(JSON.stringify(sender.data, null, 3));
    });
  }, []);
  const survey = new Model(data);
  survey.onComplete.add((sender, options) => {
    console.log(JSON.stringify(sender.data, null, 3));
  });
  return (<Survey model={survey} />);
}

export default SurveyForm;