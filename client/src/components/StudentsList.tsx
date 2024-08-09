"use client";
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import styles from "../styles/Dashboard.module.css";

interface StudentInfo {
  lastname: string;
  firstname: string;
  email: string;
}

const StudentsList = () => {
  const [searchFields, setSearchFields] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [displayedStudents, setDisplayedStudents] = useState<StudentInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = process.env.REACT_APP_BASE_URL + "students";
        const response = await axios.get(url);
        setStudents(response.data);
        setDisplayedStudents(response.data); // Initially display all students
      } catch (error) {
        console.error("Error fetching students data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchFields((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const filteredStudents = students.filter(
      (student) =>
        (searchFields.firstname
          ? student.firstname.includes(searchFields.firstname)
          : true) &&
        (searchFields.lastname
          ? student.lastname.includes(searchFields.lastname)
          : true) &&
        (searchFields.email ? student.email.includes(searchFields.email) : true)
    );
    setDisplayedStudents(filteredStudents);
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
          <input
            type="text"
            name="firstname"
            value={searchFields.firstname}
            onChange={handleChange}
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastname"
            value={searchFields.lastname}
            onChange={handleChange}
            placeholder="Last Name"
          />
          <input
            type="email"
            name="email"
            value={searchFields.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <button type="submit">Search</button>
        </form>

        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student, id) => (
                <tr key={id}>
                  <td>{student.firstname}</td>
                  <td>{student.lastname}</td>
                  <td>{student.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No students found</td>
              </tr>
            )}
          </tbody>
        </table>

        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button
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
