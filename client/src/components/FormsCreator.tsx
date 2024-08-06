import { Button, Loading } from "@lemonsqueezy/wedges";
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import styles from "../styles/Froms.module.css";
import SubmitButton from "./SubmitButton";
import TimeRangePicker from './TimeRangePicker';
import searchLogo from '../static/image/search.png';
import axios from "axios";
import Card from "./Card";


interface SelectedProgrammeData {
  searchWord: string;
  selectedProgramme: DisplayProgrammeData;
  expectedStartDate: string;
  expectedEndDate: string;
  displayedProgrammes: DisplayProgrammeData[]
}

interface DisplayProgrammeData {
  id: string;
  class_name_eng: string;
  class_name_zhcn: string;
  class_name_zhhk: string;
  class_group_id: string;
  start_time: string;
  class_end: string;
}

const Forms: React.FC = () => {
  const [filteredOptions, setFilteredOptions] = useState<DisplayProgrammeData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<DisplayProgrammeData[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [selectedProgrammeData, setSelectedProgrammeData] = useState<SelectedProgrammeData>({
    searchWord: '',
    selectedProgramme: {
      id: "",
      class_name_eng: "",
      class_name_zhcn: "",
      class_name_zhhk: "",
      class_group_id: "",
      start_time: "",
      class_end: ""
    },
    expectedStartDate: '',
    expectedEndDate: '',
    displayedProgrammes: []
  })

  // Fetch options from the server
  useEffect(() => {
    searchRelatedProgrammes(selectedProgrammeData)
  }, []);

  const searchRelatedProgrammes = async (data: SelectedProgrammeData) => {
    const selectedProgramme = data.searchWord ? "name=" + data.searchWord : ""
    const expectedStartDate = data.expectedStartDate ? "startDate=" + data.expectedStartDate : ""
    const expectedEndDate = data.expectedEndDate ? "nendDateame=" + data.expectedEndDate : ""
    const searchProgrammeUrl = "http://localhost:8080/searchProgramme?"
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
    setFilteredOptions(results);
  };

  // Handle option selection
  const handleOptionSelect = (option: DisplayProgrammeData) => {
    setSelectedProgrammeData(prevState => ({
      ...prevState,
      selectedProgramme: option
    }))
    setSearchTerm(option.class_name_eng);
    setSelectedProgrammeData(prevState => ({
      ...prevState,
      searchWord: option.class_name_eng
    }))
    setFilteredOptions([option]);
    setIsOpen(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSelectedProgrammeData(prevState => ({
      ...prevState,
      [name]: value
    }))
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
    console.log(selectedProgrammeData)
    // Handle form submission (e.g., send data to an API)
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
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onClick={() => setIsOpen(prev => !prev)}
                    placeholder="Search..."
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
                    <SubmitButton name="searchProgramme" type="submit">Search</SubmitButton>
                  </div>
                </div>

              </div>
              <hr className={styles.hrRounded} />

              {/* Display search results */}
              <div className={styles.searchResultsContainer}>
                {/* <h2 className={styles.resultsHeader}>Search Results</h2> */}
                {selectedProgrammeData.displayedProgrammes.length > 0 ? (
                  <ul>
                    <div className={styles.cardContainer}>
                      {selectedProgrammeData.displayedProgrammes.map(programme => (
                        <Card key={programme.class_group_id}
                          onSelect={() => handleSubmit} {...programme} />
                      ))
                      }
                    </div>
                  </ul>
                ) : (
                  <p className={styles.noResults}>No results found</p>
                )}
              </div>

            </form>
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
