import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import styles from "../styles/Programme.module.css";
import SubmitButton from "./SubmitButton";
import TimeRangePicker from './TimeRangePicker';
import cicsLogo from '../static/image/cics-logo.png';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface SubClass {
  engClassName: string;
  zhhkClassName: string;
  zhcnClassName: string;
}

interface ProgrammeData {
  engClassName: string;
  zhhkClassName: string;
  zhcnClassName: string;
  startDate: string;
  endDate: string;
  isSubClass: boolean;
  hasTimeSlot: boolean;
  timeSlots: TimeSlot[];
  subClasses: SubClass[];
}

const Programme: React.FC = () => {
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const [programmeData, setProgrammeData] = useState<ProgrammeData>({
    engClassName: '',
    zhhkClassName: '',
    zhcnClassName: '',
    startDate: '',
    endDate: '',
    isSubClass: false,
    hasTimeSlot: false,
    timeSlots: [{ startTime: '', endTime: '' }],
    subClasses: [{ engClassName: '', zhcnClassName: '', zhhkClassName: '' }]
  })

  const [errors, setErrors] = useState({
    engClassName: '',
    endTime: '',
    timeSlots: {
      startTime: '',
      endTime: '',
    },
    subClasses: { engClassName: '', zhcnClassName: '', zhhkClassName: '' }
  })

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const minDate = getCurrentDate();

  const englishPattern = /^[A-Za-z0-9 !@#$%^&*()_+={}\[\]|\\:;'",.<>?/-]*$/;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    let newValue = type === 'checkbox' ? checked : value

    if (type === 'checkbox') {
      setProgrammeData(prevState => ({
        ...prevState,
        [name]: checked
      }));
      if (name === 'hasTimeSlot' && checked == false) {
        validateTimeSlots(programmeData.timeSlots)
      }
    } else {
      if (name === 'engClassName') {
        if (!englishPattern.test(value)) {
          setErrors(prevState => ({
            ...prevState,
            [name]: 'Please enter English programme name, no Chinese characters allowed.',
          }));
          setIsFormValid(false)
        } else {
          setErrors(prevState => ({
            ...prevState,
            [name]: '',
          }));
          setIsFormValid(true)
        }
      }
    }
    setProgrammeData(prevState => ({
      ...prevState,
      [name]: newValue
    }))
  }


  const handleSubclassChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedSubclasses = [...programmeData.subClasses];
    updatedSubclasses[index] = { ...updatedSubclasses[index], [name]: value };
    setProgrammeData(prevState => ({
      ...prevState,
      subClasses: updatedSubclasses
    }))
    validateSubClass(updatedSubclasses, name);
  }

  const addSubclass = () => {
    if (programmeData.subClasses.length < 15) {
      setProgrammeData(prevState => ({
        ...prevState,
        subClasses: [
          ...prevState.subClasses,
          {
            engClassName: '',
            zhhkClassName: '',
            zhcnClassName: '',
          }
        ]
      }))
    }
  }

  const removeSubclass = (index: number) => {
    if (programmeData.subClasses.length > 1) {
      const updatedSubclasses = programmeData.subClasses.filter((_, i) => i !== index);
      setProgrammeData(prevState => ({
        ...prevState,
        subClasses: updatedSubclasses
      }))
    }
  }


  const handleTimeSlotChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedTimeSlots = [...programmeData.timeSlots];
    updatedTimeSlots[index] = { ...updatedTimeSlots[index], [name]: value }
    setProgrammeData(prevState => ({
      ...prevState,
      timeSlots: updatedTimeSlots
    }));
  }

  const validateTimeSlots = (timeSlots: TimeSlot[]) => {
    if (!programmeData.hasTimeSlot) return
    const timeSlotsErrors = { startTime: '', endTime: '' }
    timeSlots.forEach(slot => {
      if (!slot.startTime) {
        timeSlotsErrors.startTime = 'Start time is required.'
      }
      if (!slot.endTime) {
        timeSlotsErrors.endTime = 'End time is required.';
      } else if (slot.startTime && slot.endTime && slot.endTime <= slot.startTime) {
        timeSlotsErrors.endTime = 'End time must be later than start time.'
      } else {
        setErrors(prevState => ({
          ...prevState,
          ['endTime']: '',
        }));
        setIsFormValid(true)
        return
      }
    })

    if (Object.values(timeSlotsErrors).some(error => error)) {
      setErrors(prevState => ({
        ...prevState,
        timeSlots: { startTime: timeSlotsErrors.startTime, endTime: timeSlotsErrors.endTime }
      }))
      setIsFormValid(false)
      return
    }

    // Clear timeSlots errors if valid
    setErrors(prevState => ({
      ...prevState,
      timeSlots: {
        startTime: '',
        endTime: '',
      }
    }))
    setIsFormValid(true)
  }

  const validateSubClass = (subClasses: SubClass[], name?:string | undefined) => {
    if (!programmeData.isSubClass) return;
    const subClassesErrors =   {
      engClassName: '',
      zhhkClassName: '',
      zhcnClassName: '',
    }
    subClasses.forEach(subClass => {
      if ((!name || name == 'engClassName') && !subClass.engClassName) {
        subClassesErrors.engClassName = 'English name is required.'
      }
      if ((!name || name == 'zhhkClassName') && !subClass.zhhkClassName) {
        subClassesErrors.zhhkClassName = 'Traditional Chinese name is required.'
      }
      if ((!name || name == 'zhcnClassName') && !subClass.zhcnClassName) {
        subClassesErrors.zhcnClassName = 'Simplified Chinese name is required.'
      }
    })

    if (Object.values(subClassesErrors).some(error => error)) {
      setErrors(prevState => ({
        ...prevState,
        subClasses: {
          engClassName: subClassesErrors.engClassName,
          zhhkClassName: subClassesErrors.zhhkClassName,
          zhcnClassName: subClassesErrors.zhcnClassName,
        }
      }))
      setIsFormValid(false)
      return
    }

    // Clear timeSlots errors if valid
    setErrors(prevState => ({
      ...prevState,
      subClasses: {
        engClassName: '',
        zhhkClassName: '',
        zhcnClassName: '',
      }
    }))
    setIsFormValid(true)
  };

  const addTimeSlot = () => {
    if (programmeData.timeSlots.length < 10) {
      setProgrammeData(prevState => ({
        ...prevState,
        timeSlots: [...prevState.timeSlots, { startTime: '', endTime: '' }]
      }));
    }
  }

  const removeTimeSlot = (index: number) => {
    const updatedTimeSlots = programmeData.timeSlots.filter((_, i) => i !== index);
    setProgrammeData(prevState => ({
      ...prevState,
      timeSlots: updatedTimeSlots
    }));
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    validateTimeSlots(programmeData.timeSlots)
    validateSubClass(programmeData.subClasses)
    console.log(programmeData)
    // Handle form submission (e.g., send data to an API)
  }

  //need better state management if go to prod
  useEffect(() => {
    if (!programmeData.isSubClass) {
      setErrors(prevState => ({
        ...prevState,
        subClasses:    {
          engClassName: '',
          zhhkClassName: '',
          zhcnClassName: '',
        }
      }));
      setProgrammeData(prevState => ({
        ...prevState,
        subClasses:    [{
          engClassName: '',
          zhhkClassName: '',
          zhcnClassName: '',
        }]
      }))
      setIsFormValid(true);
    }
    if (!programmeData.hasTimeSlot) {
      setErrors(prevState => ({
        ...prevState,
        ['endTime']: '',
      }))
      setProgrammeData(prevState => ({
        ...prevState,
        timeSlots: [{
          startTime: '',
          endTime: '',
        }]
      }))
      setIsFormValid(true)
    }
  }, [programmeData.hasTimeSlot, programmeData.isSubClass])

  
  useEffect(() => { 
    validateSubClass(programmeData.subClasses)
  },[programmeData.subClasses])

  const renderForm = () => {
    return (
      <div className={styles.backgroundColor}>
        <div className={styles.darkBackgroundColor} />
        <div className={styles.container}>
          <div className={styles.leftSection}>
            <img src={cicsLogo} alt="CICS Logo" style={{ width: '300px', height: 'auto' }} />
            <h1>&nbsp;</h1>
            <h1 className={styles.formHeader}>Add New Programme</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup} key="engClassName">
                <label className={styles.label}>English</label>
                <input
                  className={styles.input}
                  type="text"
                  name="engClassName"
                  value={programmeData.engClassName}
                  onChange={handleChange}
                  required
                />
                {errors.engClassName && <p className={styles.error}>{errors.engClassName}</p>}
              </div>

              <div className={styles.formGroup} key="zhhkClassName">
                <label className={styles.label}>Traditional Chinese</label>
                <input
                  className={styles.input}
                  type="text"
                  name="zhhkClassName"
                  value={programmeData.zhhkClassName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup} key="zhcnClassName">
                <label className={styles.label}>Simplified Chinese</label>
                <input
                  className={styles.input}
                  type="text"
                  name="zhcnClassName"
                  value={programmeData.zhcnClassName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup} key="startDate">
                <label className={styles.label}>Start Date</label>
                <input
                  className={styles.input}
                  type="date"
                  name="startDate"
                  value={programmeData.startDate}
                  onChange={handleChange}
                  min={minDate}
                  required
                />
              </div>

              <div className={styles.formGroup} key="endDate">
                <label className={styles.label}>End Date</label>
                <input
                  className={styles.input}
                  type="date"
                  name="endDate"
                  value={programmeData.endDate}
                  onChange={handleChange}
                  min={minDate}
                  required
                />
              </div>

              <div className={styles.formGroup} key="hasTimeSlot">
                <div className={styles.toggleSwitchWrapper}>
                  <span className={styles.toggleSwitchLabel}>Extra Time Slot Selection</span>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      name="hasTimeSlot"
                      checked={programmeData.hasTimeSlot}
                      onChange={handleChange}
                      className={styles.toggleSwitchCheckbox}
                    />
                    <span className={styles.toggleSwitchSlider}></span>
                  </label>
                </div>
              </div>

              {/* Conditionally render TimeRangePickers based on hasTimeSlot */}
              {programmeData.hasTimeSlot && (
                <div className={styles.timeSlotsContainer}>
                  {programmeData.timeSlots.map((slot, index) => (
                    <div className={styles.timeSlotWrapper} key={index}>
                      <TimeRangePicker
                        startTime={slot.startTime}
                        endTime={slot.endTime}
                        onStartTimeChange={(e) => handleTimeSlotChange(index, e)}
                        onEndTimeChange={(e) => handleTimeSlotChange(index, e)}
                      />
                      {programmeData.timeSlots.length > 1 && (
                        <button
                          type="button"
                          className={styles.removeTimeSlotButton}
                          onClick={() => removeTimeSlot(index)}
                        >
                          -
                        </button>
                      )}
                      {programmeData.timeSlots.length < 10 && (
                        <button
                          type="button"
                          className={styles.addTimeSlotButton}
                          onClick={addTimeSlot}
                        >
                          +
                        </button>
                      )}
                    </div>
                  ))}
                  {errors.endTime && <p className={styles.error}>{errors.endTime}</p>}
                  {errors.timeSlots.startTime && <p className={styles.error}>{errors.timeSlots.startTime}</p>}
                  {errors.timeSlots.endTime && <p className={styles.error}>{errors.timeSlots.endTime}</p>}
                </div>
              )}

              <div className={styles.formGroup} key="isSubClass">
                <div className={styles.toggleSwitchWrapper}>
                  <span className={styles.toggleSwitchLabel}>Sub-class</span>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      name="isSubClass"
                      checked={programmeData.isSubClass}
                      onChange={handleChange}
                      className={styles.toggleSwitchCheckbox}
                    />
                    <span className={styles.toggleSwitchSlider}></span>
                  </label>
                </div>
              </div>
              <SubmitButton type="submit" disabled={!isFormValid}>Submit</SubmitButton>
            </form>
          </div>
          {programmeData.isSubClass && (
            <div className={styles.rightSection}>
              {programmeData.subClasses.map((subClass, index) => (
                <div className={styles.subclassContainer} key={index}>
                  <div className={styles.formGroup}>
                    <div className={styles.indexSpan}>{index + 1}
                    </div>
                    <label className={styles.label}>
                      English</label>
                    <input
                      className={styles.input}
                      type="text"
                      name="engClassName"
                      value={subClass.engClassName}
                      onChange={(e) => handleSubclassChange(index, e)}
                      required
                    />
                  </div>
                  {/* Additional fields for Traditional and Simplified Chinese */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Traditional Chinese</label>
                    <input
                      className={styles.input}
                      type="text"
                      name="zhhkClassName"
                      value={subClass.zhhkClassName}
                      onChange={(e) => handleSubclassChange(index, e)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Simplified Chinese</label>
                    <input
                      className={styles.input}
                      type="text"
                      name="zhcnClassName"
                      value={subClass.zhcnClassName}
                      onChange={(e) => handleSubclassChange(index, e)}
                      required
                    />
                  </div>
                  {/* Remove button */}
                  {programmeData.subClasses.length > 1 && (
                    <button
                      type="button"
                      className={styles.removeSubclassButton}
                      onClick={() => removeSubclass(index)}
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              {errors.subClasses.engClassName && <p className={styles.warning}>{errors.subClasses.engClassName}</p>}
              {errors.subClasses.zhhkClassName && <p className={styles.warning}>{errors.subClasses.zhhkClassName}</p>}
              {errors.subClasses.zhcnClassName && <p className={styles.warning}>{errors.subClasses.zhcnClassName}</p>}
              {/* Add button */}
              {programmeData.subClasses.length < 15 && (
                <button
                  type="button"
                  className={styles.addSubclassButton}
                  onClick={addSubclass}
                >
                  +
                </button>
              )}
            </div>
          )}
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

export default Programme;
