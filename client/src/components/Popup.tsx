import React from 'react';
import QRCode from 'qrcode.react'; // Import the QR code component
import styles from '../styles/Popup.module.css'; // Adjust the path according to your project structure

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  url: string; // Add url prop
  formId: string;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, title, content, url , formId}) => {
  if (!isOpen) return null;

  if (url.startsWith('localhost')) {
    url = 'http://' + url
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>{title}</h2>
        <p>{content}</p>
        <div style={{ fontWeight: "bold"}}>Your Form ID: {formId}</div>
        <div className={styles.qrCodeContainer}>
          <QRCode value={url} size={128} /> {/* Render the QR code */}
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
      </div>
    </div>
  );
};

export default Popup;
