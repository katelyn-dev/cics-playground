import React from 'react';
import SurveyCreatorRenderComponent from "../components/SurveyCreator";
import { useParams } from 'react-router-dom';
import Header from '../components/Header';

const SurveyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <Header />
      <main>
        <SurveyCreatorRenderComponent id={(id ?? "0")} />
      </main>
    </div>
  );
};

export default SurveyFormPage;
