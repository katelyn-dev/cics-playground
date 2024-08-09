import React from "react"
import Dashboard from '../components/Dashboard';
import Header from '../components/Header';
import Footer from "../components/Footer";


const DashboardPage = () => {
  return (
    <div>
      <Header />
      <main>
        <Dashboard />
      </main>

    </div>
  )
};

export default DashboardPage