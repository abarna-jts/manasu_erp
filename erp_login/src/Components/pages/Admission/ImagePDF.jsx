import React, { useState } from 'react';
import jsPDF from 'jspdf';

const ImagePDF = () => {
  const [newPhotoPath, setNewPhotoPath] = useState('');

  // Convert image to base64
  const getBase64ImageFromURL = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF();

    // Image URLs
    const oldImageURL = 'https://www.pahrultours.com/app2/uploads/form_2a/1746522094905-manasu_logo.png';
    const newImageURL = newPhotoPath;

    try {
      // Convert both images to base64
      const oldImgBase64 = await getBase64ImageFromURL(oldImageURL);
      const newImgBase64 = newImageURL ? await getBase64ImageFromURL(newImageURL) : null;

      doc.text('Old Photo:', 10, 10);
      doc.addImage(oldImgBase64, 'PNG', 10, 15, 50, 50);

      if (newImgBase64) {
        doc.text('New Photo:', 10, 70);
        doc.addImage(newImgBase64, 'PNG', 10, 75, 50, 50);
      }

      doc.save('image-output.pdf');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h4>Preview Images</h4>
      <div className="d-flex justify-content-evenly">
        {/* Old Photo */}
        <div className="text-center" style={{ border: "1px solid #6c6c6c", borderRadius: '5px' }}>
          <label>Old Photo</label><br />
          <img
            src="https://www.pahrultours.com/app2/uploads/form_2a/1746522094905-manasu_logo.png"
            alt="Old"
            style={{ width: "100px", height: "100px" }}
          />
        </div>

        {/* New Photo upload */}
        <div className="text-center" style={{ border: "1px solid #6c6c6c", borderRadius: '5px' }}>
          <label>New Photo</label><br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setNewPhotoPath(url);
              }
            }}
          />
          {newPhotoPath && (
            <img src={newPhotoPath} alt="New" style={{ width: "100px", height: "100px", marginTop: "10px" }} />
          )}
        </div>
      </div>

      <div className="text-center mt-4">
        <button onClick={generatePDF} className="btn btn-primary">Download PDF</button>
      </div>
    </div>
  );
};

export default ImagePDF;
