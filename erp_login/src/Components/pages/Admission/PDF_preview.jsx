import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PDF_preview= () => {
  const tableRef = useRef(null);

  const handlePreview = async () => {
    const input = tableRef.current;

    // Make sure element is visible for html2canvas
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF('p', 'mm', 'a4'); // portrait, millimeters, A4

    // Calculate width/height to fit A4 page
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Open PDF in new tab
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    window.open(pdfUrl, '_blank'); // Full screen preview
  };

  const handleDownload = async () => {
    const input = tableRef.current;

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    pdf.save('form_preview.pdf'); // Direct download
  };

  return (
    <div>
      <h1>Form Example</h1>
      <form>
        {/* Your form inputs here */}
        <input type="text" placeholder="Name" />
        <input type="text" placeholder="Email" />
      </form>

      <button onClick={handlePreview}>Preview PDF</button>
      <button onClick={handleDownload}>Download PDF</button>

      {/* Hidden form view for PDF */}
      <div
        ref={tableRef}
        style={{
          background: "#fff",
          padding: "20px",
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
        }}
      >
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>John Doe</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>john@example.com</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PDF_preview;


//exact screen pdf 
// import React, { useRef } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// const PreviewPDF = () => {
//   const contentRef = useRef(null);

//   const handlePreview = async () => {
//     const input = contentRef.current;

//     const canvas = await html2canvas(input, {
//       scale: 2,
//       useCORS: true,
//     });

//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "mm", "a4");

//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

//     const blob = pdf.output("blob");

//     const blobURL = URL.createObjectURL(blob);

//     // Open in new full screen tab
//     const newWindow = window.open(blobURL, "_blank");
//     if (newWindow) newWindow.document.title = "Preview PDF";
//   };

//   return (
//     <div>
//       <div ref={contentRef} style={{ padding: "20px", background: "#fff" }}>
//         <h1>Form Preview</h1>
//         <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%" }}>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Phone</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>John Doe</td>
//               <td>john@example.com</td>
//               <td>1234567890</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <button onClick={handlePreview} style={{ marginTop: "20px" }}>
//         Preview PDF
//       </button>
//     </div>
//   );
// };

// export default PreviewPDF;

