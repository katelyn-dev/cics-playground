import React, { useState } from 'react';
import styles from '../styles/TimeRangePicker.module.css'; // Adjust the path as needed

interface TimeRangePickerProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TimeRangePicker: React.FC<TimeRangePickerProps> = ({ startTime, endTime, onStartTimeChange, onEndTimeChange }) => {
  return (
    <div className={styles.timeRangeGroup}>
      <div className={styles.timePickerWrapper}>
        <label className={styles.label}>Start Time</label>
        <input
          type="time"
          name="startTime"
          value={startTime}
          onChange={onStartTimeChange}
          className={styles.input}
        />
      </div>
      <div className={styles.timePickerWrapper}>
        <label className={styles.label}>End Time</label>
        <input
          type="time"
          name="endTime"
          value={endTime}
          onChange={onEndTimeChange}
          className={styles.input}
        />
      </div>
    </div>
  );
};

export default TimeRangePicker;