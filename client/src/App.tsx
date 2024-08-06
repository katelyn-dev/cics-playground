import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Form from "./pages/FormPage";
import Header from "./components/Header";
import QuestionBuilder from './components/QuestionBuilder';
import SurveyFormPage from "./pages/SurveyFormPage";
import Programme from './pages/programmeCreation';
import Forms from './components/FormsCreator';
import Footer from './components/Footer';
import QRCodePage from "./pages/QRCodePage";

function App() {


  return (
    <Router>
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/" element={<Programme />}></Route>
          <Route path="/formCreate" element={<Forms />}></Route> 
          <Route path="/form" element={<Form />}/>
          <Route path="/form/:id" element={<Form />}/>
          <Route path="/questionnaire" element={<QuestionBuilder />}/>
          <Route path="/form-creator" element={<SurveyFormPage />}/>
          <Route path="/qr-code" element={<QRCodePage />}/>
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
