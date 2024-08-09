import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Form from "./pages/FormPage";
import Header from "./components/Header";
import QuestionBuilder from "./components/QuestionBuilder";
import SurveyFormPage from "./pages/SurveyFormPage";
import Programme from "./pages/programmeCreation";
import Forms from "./components/FormsCreator";
import Footer from "./components/Footer";
import QRCodePage from "./pages/QRCodePage";
import DashboardPage from "./pages/DashboardPage";
import StudentsListPage from "./pages/StudentsListPage";
import FormEditor from "./components/FormEditor";

const App: React.FC = () => {
  const location = useLocation();
  // Determine whether to show the Header based on the current path
  const shouldShowHeader = !location.pathname.startsWith("/form/");

  return (
    <div className="App">
      {shouldShowHeader && <Header />}
      <Routes>
        <Route path="/" element={<Programme />} />
        <Route path="/formCreate" element={<Forms />} />
        <Route path="/form" element={<Form />} />
        <Route path="/form/:id" element={<Form />} />
        <Route path="/questionnaire" element={<QuestionBuilder />} />
        <Route path="/form-editor" element={<FormEditor />} />
        <Route path="/form-editor/:id" element={<SurveyFormPage />} />
        <Route path="/qr-code" element={<QRCodePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/studentslist" element={<StudentsListPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

const Main: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default Main;
