import React from "react";
import StudentsList from "../components/StudentsList";
import Header from "../components/Header";
import Footer from "../components/Footer";

const StudentsListPage = () => {
  return (
    <div>
      <Header />
      <main>
        <StudentsList />
      </main>
    </div>
  );
};

export default StudentsListPage;
