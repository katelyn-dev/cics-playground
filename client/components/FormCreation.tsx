"use client";

import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from 'react';
import styles from "../styles/Form.module.css";
import { SubmitButton } from './SubmitButton';


const FormCreation: React.FC = () => {
  const [formData, setFormData] = useState<any[]>([
    ['text', 'What is your name?'],
    ['paragraph', 'Describe your experience'],
    ['multiple choice', 'What is your favorite color?', 'Red', 'Blue', 'Green', 'Yellow'],
    ['checkboxes', 'Which languages do you speak?', 'English', 'Spanish', 'French', 'German'],
    ['dropdown', 'Select your country', 'USA', 'Canada', 'Mexico', 'UK'],
    ['dropdown', 'Select your country', 'USA', 'Canada', 'Mexico', 'UK'],
    ['dropdown', 'Select your country', 'USA', 'Canada', 'Mexico', 'UK'],
    ['dropdown', 'Select your country', 'USA', 'Canada', 'Mexico', 'UK'],
    ['dropdown', 'Select your country', 'USA', 'Canada', 'Mexico', 'UK'],
  ]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission (e.g., send data to an API)
  };

  const renderForm = () => {
    return (
      <div className={styles.backgroundColor}>
        <div className={styles.darkBackgroundColor}/>
        <div className={styles.container}>
          <h1 className={styles.formHeader}>Questionnaire Form</h1>
          <form className={styles.form} onSubmit={handleSubmit}>

            {
              formData.map((row, rowIndex) => {
                const [questionType, questionTitle, ...options] = row;
                if (!questionType || !questionTitle) return null;

                switch (questionType.toLowerCase()) {
                  case 'text':
                    return (
                      <div className={styles.formGroup} key={rowIndex}>
                        <label className={styles.label}>{questionTitle}</label>
                        <input className={styles.input} type="text" name={questionTitle} />
                      </div>
                    );
                  case 'paragraph':
                    return (
                      <div className={styles.formGroup} key={rowIndex}>
                        <label className={styles.label}>{questionTitle}</label>
                        <textarea className={styles.textarea} name={questionTitle} />
                      </div>
                    );
                  case 'multiple choice':
                    return (
                      <div className={styles.formGroup} key={rowIndex}>
                        <label className={styles.label}>{questionTitle}</label>
                        {options.map((option, optionIndex) => (
                          <div key={optionIndex}>
                            <input className={styles.select} type="radio" name={questionTitle} value={option} />
                            <label>{option}</label>
                          </div>
                        ))}
                      </div>
                    );
                  case 'checkboxes':
                    return (
                      <div className={styles.formGroup} key={rowIndex}>
                        <label className={styles.label}>{questionTitle}</label>
                        {options.map((option, optionIndex) => (
                          <div key={optionIndex}>
                            <input className={styles.select} type="checkbox" name={questionTitle} value={option} />
                            <label>{option}</label>
                          </div>
                        ))}
                      </div>
                    );
                  case 'dropdown':
                    return (
                      <div className={styles.formGroup} key={rowIndex}>
                        <label className={styles.label}>{questionTitle}</label>
                        <select className={styles.dropdown} name={questionTitle}>
                          {options.map((option, optionIndex) => (
                            <option key={optionIndex} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            <SubmitButton type="submit">Submit</SubmitButton>
          </form>

        </div>
      </div>
    )
  }

  return (
    <div>
      {renderForm()}
    </div>
  )
}

export default FormCreation;