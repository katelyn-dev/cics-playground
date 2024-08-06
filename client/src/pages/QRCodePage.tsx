import React from 'react';
import QRCodeComponent from "../components/QRCodeComponent";

const QRCodePage: React.FC = () => {
  const url = "https://example.com";
  return (
    <div>
      <QRCodeComponent url={url}/>
    </div>
  );
};

export default QRCodePage;
