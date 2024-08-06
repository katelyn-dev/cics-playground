import React from 'react';
import Form from '../components/Form';
import SurveyForm from "../components/SurveyForm";
import {useParams} from "react-router";

const FormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <SurveyForm id={parseInt(id ?? "0")}/>
    </div>
  );
};

export default FormPage;
