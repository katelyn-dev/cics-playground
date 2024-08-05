// import React, { useState } from 'react';
// import '../styles/ToggleSwitch.css';

// interface ToggleSwitchProps {
//   switchName: string;
//   initialChecked?: boolean;
//   onChange?: (checked: boolean) => void;
// }

// const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ switchName, initialChecked = false, onChange }) => {
//   const [isChecked, setIsChecked] = useState(initialChecked);

//   const handleChange = () => {
//     const newChecked = !isChecked;
//     setIsChecked(newChecked);
//     if (onChange) {
//       onChange(newChecked);
//     }
//   };

//   return (
//     <div className="toggle-switch-wrapper">
//       <span className="toggle-switch-label">{switchName}</span>
//       <label className="toggle-switch">
//         <input
//           type="checkbox"
//           checked={isChecked}
//           onChange={handleChange}
//           className="toggle-switch-checkbox"
//         />
//         <span className="toggle-switch-slider"></span>
//       </label>
//     </div>
//   );
// };

// export default ToggleSwitch;