import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Form from "./pages/FormPage";
import Header from "./components/Header";
import QuestionBuilder from './components/QuestionBuilder';
import SurveyFormPage from "./pages/SurveyFormPage";

function App() {


  return (
    <Router>
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/form" element={<Form />}/>
          <Route path="/questionnaire" element={<QuestionBuilder />}/>
          <Route path="/form-creator" element={<SurveyFormPage />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
