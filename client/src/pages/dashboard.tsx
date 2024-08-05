import React from "react"
import { Box } from "@mantine/core"
import Dashboard from '../components/Dashboard';
import Header from '../components/Header';


const DashboardPage =()=> {
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