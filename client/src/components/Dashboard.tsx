"use client";
import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from 'react';
import styles from "../styles/Dashboard.module.css";

type classes={
  classes:{
    id :string
    class_group_id :string,
    class_name_eng :string,
    class_name_zhcn :string,
    class_name_zhhk :string,
    has_subclass :string,
    subclass_group_id :string,
    has_extra_attributes :string,
    extra_attributes_name :string,
    extra_attributes :JSON,
    class_start :Date,
    class_end :Date,
    start_time :string,
    last_modified_time :string,
    age_group :string,
  }
    
}

export const Dashboard: React.FunctionComponent<classes> =(classes)=> {
  console.log(classes)
    return (
      <main className={styles.container}>
        <div className={styles.card}>
          <h2>Total Courses</h2>
          <p className={styles.card_words}>Loading...</p>
          <link href="/programme" className={styles.btn}>Manage Courses</link>
        </div>
        <div className={styles.card}>
          <h2>Registered Students</h2>
          <p className={styles.card_words}>Loading...</p>
          <link href="/students" className={styles.btn}>View Students</link>
        </div>
        <div className={styles.card}>
          <h2>Open Form</h2>
          <p className={styles.card_words}>Loading...</p>
          <link href="/forms" className={styles.btn}>Manage Form</link>
        </div>
        <table className={styles.course_list}>
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>class_start</th>
              <th>class_end</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody className={styles.course_list_body}>
          </tbody>
        </table>
    </main>
    )
}

export default Dashboard