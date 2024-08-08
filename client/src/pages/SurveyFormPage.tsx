import React from 'react';
import SurveyCreatorRenderComponent from "../components/SurveyCreator";
import { useParams } from 'react-router-dom';

const SurveyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    //style={{ marginTop: '70px', marginBottom: '70px' , padding: '15px',}}
    <div >
      <SurveyCreatorRenderComponent id={(id ?? "0")} />
    </div>
  );
};

export default SurveyFormPage;
