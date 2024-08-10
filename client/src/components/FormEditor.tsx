import { Button, Loading } from "@lemonsqueezy/wedges";
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import styles from "../styles/Froms.module.css";
import SubmitButton from "./SubmitButton";
import TimeRangePicker from './TimeRangePicker';
import formEdit from '../static/image/formEdit.png';
import axios from "axios";
import Card from "./Card";
import Popup from "./Popup";
import { templateToProgrammePayload, toSaveFormRequest } from "./PaylaodMapper";
import { Helper } from "./Helper";
import { useNavigate } from "react-router-dom";

interface SearchFormProps {
  form_id: string;
}

const FormEditor: React.FC = () => {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState<SearchFormProps>({ form_id: '' });
  const [errors, setErrors] = useState({
    form_id: '',
  })


  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const value = event.target.value;
    setSearchForm(prevState => ({
      ...prevState,
      form_id: value
    }))

  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const searchProgrammeUrl = `${process.env.REACT_APP_BASE_URL}getFormByFormId?id=${searchForm.form_id}`
      const response = await axios.get<any[]>(searchProgrammeUrl);
      const status = response.status
      if (status == 200) {
        setSearchForm(prevState => ({
          ...prevState,
          form_id: searchForm.form_id
        }))
        setErrors(prevState => ({
          ...prevState,
          form_id: ''
        }))
      }
      //redirect
      const redirect = `/form-editor/${searchForm.form_id}`
      navigate(redirect);  
    } catch (error) {
      setErrors(prevState => ({
        ...prevState,
        form_id: 'No Form Found. Please retry.'
      }))
    }
  }


  const renderForm = () => {
    return (
      <div className={styles.backgroundColor}>
        <div className={styles.darkBackgroundColor} />
        <div className={styles.container}>
          <div className={styles.leftSection}>
            <p>&nbsp;</p>
            <img src={formEdit} alt="search" style={{ width: '380px', height: 'auto' }} />

            <h1 className={styles.formHeader}>Search a Form to edit</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}
                style={{ position: 'relative', width: '95%' }}>
                <div className={styles.searchContainer}>
                  <input
                    name="selectedProgramme"
                    className={styles.searchBox}
                    type="text"
                    onChange={handleSearch}
                    placeholder="Search..."
                    value={searchForm?.form_id}
                  />
                </div>
              </div>
              <SubmitButton type="submit">Search</SubmitButton>
              {errors.form_id && <p className={styles.error}>{errors.form_id}</p>}
            </form>
          </div>
        </div >
      </div >
    )
  }

  return (
    <div>
      {renderForm()}
    </div>
  )
}

export default FormEditor
