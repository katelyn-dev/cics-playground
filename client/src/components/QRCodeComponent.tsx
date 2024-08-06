import React, {useRef} from "react";
import QRCode from "qrcode.react";

interface QRCodeComponentProps {
  url: string;
}


const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ url }) => {

  const qrCodeRef = useRef<HTMLDivElement>(null);
  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;

    const canvas = qrCodeRef.current.querySelector("canvas");

    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };



  return (
    <div style={{ textAlign: "center" }}>
      <h1>QR Code Generator</h1>
      <p>Scan the QR code to open the URL:</p>
      <div ref={qrCodeRef}>
      <QRCode value={url} size={256} level="H" includeMargin={true} />
      </div>
      <p>{url}</p>
      <button onClick={downloadQRCode}>Download QR Code</button>
    </div>
  );
};

export default QRCodeComponent;