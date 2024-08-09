import React from 'react';
import SurveyForm from "../components/SurveyForm";
import {useParams} from "react-router";

const FormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log("formId=" + id)
  return (
    <div style={{  alignItems: 'left', padding: '0rem', marginTop: '0px'
    }}>
      <SurveyForm id={(id ?? "0")}/>
    </div>
  );
};

export default FormPage;