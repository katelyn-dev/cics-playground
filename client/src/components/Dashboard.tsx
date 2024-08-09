"use client";
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import styles from "../styles/Dashboard.module.css";
import { NavLink } from "react-router-dom";

interface TimeSlot {
  startDate: string;
  endDate: string;
}

export interface TimeSlot_data {
  start_date: Date;
  end_date: Date;
}
interface SelectedProgrammeData {
  searchWord: string;
  selectedProgramme: DisplayProgrammeData;
  expectedStartDate: string;
  expectedEndDate: string;
  displayedProgrammes: DisplayProgrammeData[];
}
interface DisplayProgrammeData {
  id: string;
  class_name_eng: string;
  class_name_zhcn: string;
  class_name_zhhk: string;
  target_audience: string;
  class_group_id: string;
  start_time: string;
  class_end: string;
}

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalForms, setTotalForms] = useState(0);
  const [selectedProgrammeData, setSelectedProgrammeData] =
    useState<SelectedProgrammeData>({
      searchWord: "",
      selectedProgramme: {
        id: "",
        class_name_eng: "",
        class_name_zhcn: "",
        class_name_zhhk: "",
        target_audience: "",
        class_group_id: "",
        start_time: "",
        class_end: "",
      },
      expectedStartDate: "",
      expectedEndDate: "",
      displayedProgrammes: [],
    });

  const [timeslot, setTimeslot] = useState<TimeSlot>({
    startDate: "",
    endDate: "",
  });
  const fetchData = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL + "dashboard";
      const response = await axios.get(url);
      const { totalStudents, totalCourses, totalForms } = response.data;
      setTotalStudents(totalStudents);
      setTotalCourses(totalCourses);
      setTotalForms(totalForms);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  fetchData();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setTimeslot((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await searchCourse();
    // console.log(timeslot.startDate);
  };

  const searchCourse = async () => {
    const { startDate, endDate } = timeslot;
    const searchProgrammeUrl = `${process.env.REACT_APP_BASE_URL}/searchProgramme?startDate=${startDate}&endDate=${endDate}`;
    try {
      const response = await axios.get<DisplayProgrammeData[]>(
        searchProgrammeUrl
      );
      const displayList = response.data;
      setSelectedProgrammeData((prev) => ({
        ...prev,
        displayedProgrammes: displayList,
      }));
    } catch (error) {
      console.log(error);
      setSelectedProgrammeData((prev) => ({
        ...prev,
        displayedProgrammes: [],
      }));
    }
  };

  const downloadResults = async () => {
    console.log(selectedProgrammeData)
    await searchCourse();
  }

  const renderDashboard = () => {
    return (
      <div>
        <main className={styles.container}>
          <div className={styles.card}>
            <h2>Total Courses</h2>
            <p className={styles.card_words}>{totalCourses}</p>
            <NavLink to="/formCreate" className={styles.btn}>
              Manage Courses
            </NavLink>
          </div>
          <div className={styles.card}>
            <h2>Registered Students</h2>
            <p className={styles.card_words}>{totalStudents}</p>
            <a className={styles.btn}>View Students</a>
          </div>
          <div className={styles.card}>
            <h2>Open Form</h2>
            <p className={styles.card_words}>{totalForms}</p>
            <NavLink to="/form" className={styles.btn}>
              Manage Form
            </NavLink>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.download_file}>
              <label className={styles.search_lb}>Start date:</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={timeslot.startDate}
                onChange={handleChange}
                className={styles.search_input}
              />
              <label className={styles.search_lb}>End date:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={timeslot.endDate}
                onChange={handleChange}
                className={styles.search_input}
              />
              <button className={styles.btn} onClick={() => searchCourse()}>
                Search
              </button>
            </div>
          </form>
          <div>
            <button className={styles.btn} onClick={() => downloadResults()}>
              Export Report
            </button>
            {/* <a href="{{url_for({excel_filename})}}" download>
              Download
            </a> */}
          </div>

          <table className={styles.course_list}>
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Course Name</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody className={styles.course_list_body}>
              {selectedProgrammeData.displayedProgrammes.map(
                (programme, index) => (
                  <tr key={index}>
                    <td>{programme.id}</td>
                    <td>{programme.class_name_eng}</td>
                    <td>{programme.class_end}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </main>
      </div>
    );
  };

  return <div>{renderDashboard()}</div>;
};

export default Dashboard;
