"use client";
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import styles from "../styles/StudentsList.module.css";
import SubmitButton from "./SubmitButton";

interface StudentInfo {
  lastname: string;
  firstname: string;
  email: string;
  phone_number: string;
}

const StudentsList = () => {
  const [searchStudent, setSearchStudent] = useState<StudentInfo>({
    firstname: "",
    lastname: "",
    email: "",
    phone_number: ""
  });

  // const [students, setStudents] = useState<StudentInfo[]>([]);
  const [displayedStudents, setDisplayedStudents] = useState<StudentInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);


  // //initial load, ok can load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = process.env.REACT_APP_BASE_URL + "/searchStudent";
        const response = await axios.get(url);
        setDisplayedStudents(response.data); // Initially display all students
      } catch (error) {
        console.error("Error fetching students data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const { name, value } = e.target;
    setSearchStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const email = searchStudent.email ? "&email=" + searchStudent.email : ""
      const phone_num = searchStudent.phone_number ? "&phone_num=" + searchStudent.phone_number : ""
      const lastname = searchStudent.lastname ? "&lastname=" + searchStudent.lastname : ""
      const firstname = searchStudent.firstname ? "&firstname=" + searchStudent.firstname : ""
      const url = process.env.REACT_APP_BASE_URL + "/searchStudent?"
        + email
        + phone_num
        + lastname
        + firstname
      const response = await axios.get(url);
      setDisplayedStudents(response.data); // Initially display all students
    } catch (error) {
      console.error("Error fetching students data:", error);
    }
    setCurrentPage(1); // Reset to the first page after filtering
  };

  const studentsPerPage = 100;
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = displayedStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  const renderStudentsList = () => {
    return (
      <main className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>First Name</label>
              <input
                className={styles.input}
                type="text"
                name="firstname"
                value={searchStudent.firstname}
                onChange={handleChange}
                placeholder="First Name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Last Name</label>
              <input
                className={styles.input}
                type="text"
                name="lastname"
                value={searchStudent.lastname}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                type="text"
                name="email"
                value={searchStudent.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <input
                className={styles.input}
                type="text"
                name="phone_number"
                value={searchStudent.phone_number}
                onChange={handleChange}
                placeholder="Phone Number"
              />
            </div>
          </div>
          <SubmitButton type="submit">Submit</SubmitButton>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
        </form>

        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student, id) => (
                <tr key={id}>
                  <td>{student.firstname}</td>
                  <td>{student.lastname}</td>
                  <td>{student.email}</td>
                  <td>{student.phone_number}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No students found</td>
              </tr>
            )}
          </tbody>
        </table>

        <button
           className={!(currentPage === 1)
            ? styles.button : styles.buttonDisable}
          onClick={prevPage}
          disabled={currentPage === 1}>
          Previous
        </button>
        <button
          className={!(currentStudents.length < studentsPerPage)
            ? styles.button : styles.buttonDisable}
          onClick={nextPage}
          disabled={currentStudents.length < studentsPerPage}
        >
          Next
        </button>
      </main>
    );
  };

  return <div>{renderStudentsList()}</div>;
};

export default StudentsList;
