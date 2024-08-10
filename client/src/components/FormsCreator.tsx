import { Button, Loading } from "@lemonsqueezy/wedges";
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import styles from "../styles/Froms.module.css";
import SubmitButton from "./SubmitButton";
import TimeRangePicker from './TimeRangePicker';
import searchLogo from '../static/image/search.png';
import axios from "axios";
import Card from "./Card";
import Popup from "./Popup";
import { templateToProgrammePayload, toSaveFormRequest } from "./PaylaodMapper";
import { Helper } from "./Helper";


interface SelectedProgrammeData {
  searchWord: string;
  selectedProgramme: DisplayProgrammeData | null; // Changed to null initially;
  expectedStartDate: string;
  expectedEndDate: string;
  displayedProgrammes: DisplayProgrammeData[]
}

export interface DisplayProgrammeData {
  id: string;
  class_name_eng: string;
  class_name_zhcn: string;
  class_name_zhhk: string;
  target_audience: string;
  class_group_id: string;
  start_time: string;
  class_end: string;
}

interface FormResponse {
  form_id: string;
}

interface TemplateResponse {
  form_json: string;
}

const Forms: React.FC = () => {
  const [filteredOptions, setFilteredOptions] = useState<DisplayProgrammeData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<DisplayProgrammeData[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupUrl, setPopupUrl] = useState('');
  const [formId, setFormId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [selectedProgrammeData, setSelectedProgrammeData] = useState<SelectedProgrammeData>({
    searchWord: '',
    selectedProgramme: null,
    expectedStartDate: '',
    expectedEndDate: '',
    displayedProgrammes: []
  })

  useEffect(() => {
    // Initialize with an empty search
    searchRelatedProgrammes(selectedProgrammeData);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent Enter key from triggering button
    }
  };

  const searchRelatedProgrammes = async (data: SelectedProgrammeData) => {
    const encodedSearchTerm = encodeURIComponent(data.searchWord);
    console.log(`Encoded URL: searchProgramme?name=${encodedSearchTerm}`);
    const selectedProgramme = data.searchWord ? "name=" + encodedSearchTerm : ""
    const expectedStartDate = data.expectedStartDate ? "startDate=" + data.expectedStartDate : ""
    const expectedEndDate = data.expectedEndDate ? "nendDateame=" + data.expectedEndDate : ""
    const searchProgrammeUrl = process.env.REACT_APP_BASE_URL + "/searchProgramme?"
      + selectedProgramme + expectedStartDate + expectedEndDate
    try {
      const response = await axios.get<any[]>(searchProgrammeUrl);
      const displayList: DisplayProgrammeData[] = response.data
      setFilteredOptions(displayList)
      setSearchResults(displayList)
      return displayList;
    } catch (error) {
      console.log(error)
      setSearchResults([])
    }

  }

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const value = event.target.value;
    setSearchTerm(value);
    setSelectedProgrammeData(prevState => ({
      ...prevState,
      searchWord: value
    }))
    // Filter options based on the search term
    const results = searchResults.filter(option =>
      option.class_name_eng.toLowerCase().includes(value.toLowerCase())
    );
    if (results.length == 1) {
      setSelectedProgrammeData(prevState => ({
        ...prevState,
        selectedProgramme: results[0]
      }))
    }
    setFilteredOptions(results);
  };

  const handleOptionSelect = (option: DisplayProgrammeData) => {
    setSelectedProgrammeData(prevState => ({
      ...prevState,
      selectedProgramme: option,
      searchWord: option.class_name_eng
    }));
    setSearchTerm(option.class_name_eng);
    setFilteredOptions([option]);
    setIsOpen(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("handlechangfe..")
    const { name, value, type, checked } = e.target
    setSelectedProgrammeData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault()
    const displayCources = await searchRelatedProgrammes(selectedProgrammeData)
    if (displayCources && displayCources.length > 0) {
      setSelectedProgrammeData(prevState => ({
        ...prevState,
        displayedProgrammes: displayCources
      }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const displayCources = await searchRelatedProgrammes(selectedProgrammeData)
    if (displayCources && displayCources.length > 0) {
      setSelectedProgrammeData(prevState => ({
        ...prevState,
        displayedProgrammes: displayCources
      }))
    }

    const classId = selectedProgrammeData.selectedProgramme?.class_group_id
    const formUrl = process.env.REACT_APP_BASE_URL + "/getFormIdByClassId?id=" + classId
    console.log("formCreators classId=" + classId)
    console.log("formCreators formUrl=" + formUrl)
    try {
      const response = await axios.get<FormResponse>(formUrl);
      console.log("formCreators response=" + response)
      const status = response.status
      if (status === 200) {
        const formId = response.data.form_id
        const createdFormUrl = process.env.REACT_APP_HOST + "/form/" + formId
        setFormId(formId);
        setPopupUrl(createdFormUrl); // Set the URL for the popup
        setIsPopupOpen(true); // Open the popup
      }
    } catch (error) {
      const targetAudience = selectedProgrammeData.selectedProgramme?.target_audience
      const templateUrl = process.env.REACT_APP_BASE_URL + '/getTemplate?targetAudience=' + targetAudience
      const templateResponse = await axios.get<TemplateResponse>(templateUrl);
      const templateJson = templateResponse.data.form_json
      const newForm = templateToProgrammePayload(templateJson, selectedProgrammeData.selectedProgramme!)
      const saveFormUrl = process.env.REACT_APP_BASE_URL + '/createForm'
      const saveFormRequest = toSaveFormRequest(newForm, classId!)
      const formResponse = await axios.post<FormResponse>(saveFormUrl, saveFormRequest, Helper.postRequestHeader);
      const formId = formResponse.data.form_id
      const createdFormUrl = window.location.host + "/form/" + formId
      setFormId(formId);
      setPopupUrl(createdFormUrl); // Set the URL for the popup
      setIsPopupOpen(true); // Open the popup
    }
  }

  // Handle clicking outside of the dropdown
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderForm = () => {
    return (
      <div className={styles.backgroundColor}>
        <div className={styles.darkBackgroundColor} />
        <div className={styles.container}>
          <div className={styles.leftSection}>
            <p>&nbsp;</p>
            <img src={searchLogo} alt="search" style={{ width: '380px', height: 'auto' }} />
            <h1 className={styles.formHeader}>Search a Programme</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup} ref={dropdownRef} style={{ position: 'relative', width: '95%' }}>
                <div className={styles.searchContainer}>
                  <input
                    name="selectedProgramme"
                    className={styles.searchBox}
                    type="text"
                    onChange={handleSearchChange}
                    onClick={() => setIsOpen(prev => !prev)}
                    placeholder="Search..."
                    value={selectedProgrammeData.searchWord}
                  />
                  <span
                    className={styles.dropdownIcon}
                    onClick={() => setIsOpen(prev => !prev)}
                  >
                    {/* Dropdown arrow icon */}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 4.5L6 7.5L9 4.5H3Z" fill="#000" />
                    </svg>
                  </span>
                </div>
                {isOpen && (
                  <div className={styles.openDropDownBox}>
                    <ul >
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                          <li
                            key={option.id}
                            onClick={() => handleOptionSelect(option)}                          >
                            {option.class_name_eng}
                          </li>
                        ))
                      ) : (
                        <li >No options found</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className={styles.formGroup} key="dates">
                <div className={styles.datePickerContainer} key="startDate">
                  <div>
                    <label className={styles.label}>Expected Start Date</label>
                    <input
                      className={styles.input}
                      type="date"
                      name="expectedStartDate"
                      value={selectedProgrammeData.expectedStartDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className={styles.label}>Expected End Date</label>
                    <input
                      className={styles.input}
                      type="date"
                      name="expectedEndDate"
                      value={selectedProgrammeData.expectedEndDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.datePickerContainerSearchButton} >
                    {/* <SubmitButton name="searchProgramme"
                      data-button-type="searchSubmit"
                      type="submit" >Search</SubmitButton> */}
                    <button
                      type="button"
                      onKeyDown={handleKeyDown}
                      className={styles.submitButton}
                      onClick={handleSearch}
                    >
                      Search
                    </button>
                  </div>
                </div>

              </div>
              <hr className={styles.hrRounded} />

              {/* Display search results */}
              <div className={styles.searchResultsContainer}>
                {selectedProgrammeData.displayedProgrammes.length > 0 ? (
                  <ul>
                    <div className={styles.cardContainer}>
                      {selectedProgrammeData.displayedProgrammes.map(programme => (
                        <Card
                          key={programme.class_group_id}
                          {...programme}
                          onSelect={(id) => {
                            const selected = selectedProgrammeData.displayedProgrammes.find(p => p.class_group_id === id);
                            if (selected) {
                              setSelectedProgrammeData(prevState => ({
                                ...prevState,
                                selectedProgramme: selected
                              }));
                            }
                          }}
                        />
                      ))}
                    </div>
                  </ul>
                ) : (
                  <p className={styles.noResults}>No results found</p>
                )}
              </div>
            </form>

            <Popup
              isOpen={isPopupOpen}
              onClose={() => setIsPopupOpen(false)}
              title="Here you go!"
              content="Here is your QR code and URL"
              url={popupUrl}
              formId={formId}
            />
          </div>
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

export default Forms;
