import React from "react";
import { Container, Row, Form, InputGroup, Col, Button } from "react-bootstrap";
import { Breadcrumb } from '@themesberg/react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import manasu_logo from '../Admission/Manasu-Logo.png';

function SCRB_form() {
    const [previewRequested, setPreviewRequested] = useState(false);
    const [admission_no, setAdmissionNumber] = useState('');
    const [rescue_image, setRescueImage] = useState(null);
    const [error, setError] = useState("");
    const [rescueName, setRescueName] = useState(null);
    const [formData, setFormData] = useState({
        koppu_en: '',
        admission_no: '',
        name_rescue: '',
        phone_no: '',
        rescue_name: '',
        father: '',
        date_time: '',
        rescue_status: '',
        language1: '',
        place: '',
        police_station: '',
        addition_info: '',
    });

    //alert box values
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const [files, setFiles] = useState({
        old_photo: null,
        new_photo: null,
        signature: null,
        seal: null,
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const handleSearch = async () => {
        try {
            const response = await apiRoute.get(`/scrb_form/get_scrbform2data/${admission_no}`);
            const result = response.data;

            console.log("API Result:", result);

            if (result && result.data) {
                setFormData(result.data);
                
                const rescueName = result.data.rescue_name;
                setRescueName(rescueName);
                console.log("Rescue Name", rescueName);

                const imagePath = result.data.rescue_image.startsWith("http")
                    ? result.data.rescue_image
                    : `https://www.pahrultours.com/app2${result.data.rescue_image}`;

                setRescueImage(imagePath);
                console.log("Image Path:", imagePath);
                
            } else {
                setRescueImage(null);
                setError("Image not found for this admission number");
            }
        } catch (error) {
            console.error("Error fetching data", error);
            alert("Admission Number Not found");
        }
    };


    const formatDateOnly = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date)) return ""; // Handle invalid date

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedFormData = { ...formData, admission_no };

        const data = new FormData();
        data.append('name_ngo', 'MANASU (Mental Health Charity Home)');
        data.append('admission_no', updatedFormData.admission_no);
        data.append('koppu_en', formData.koppu_en);
        data.append('rescue_name', formData.rescue_name);
        data.append('father', formData.father);
        data.append('date_time', formatDateOnly(formData.date_time));
        data.append('gender', 'Male');
        data.append('rescue_status', formData.rescue_status);
        data.append('language1', formData.language1);
        data.append('police_station', formData.police_station);
        data.append('place', formData.place);
        data.append('addition_info', formData.addition_info);
        data.append('old_photo', files.old_photo);
        data.append('new_photo', files.new_photo);
        data.append('signature', files.signature);
        data.append('seal', files.seal);
        data.append('name_rescue', formData.name_rescue);
        data.append('phone_no', formData.phone_no);

        try {
            const res = await apiRoute.post('/scrb_form/create_form2', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(res);
            if (res.data.message === "SCRB FORM2 Created Successfully") {
                setSubmissionMessage("Form submitted successfully!");
                setMessageType("success");

                // Optionally reload after 3 seconds
                setTimeout(() => window.location.reload(), 3000);
            } else {
                setSubmissionMessage("Submission failed.");
                setMessageType("danger");
            }
        } catch (error) {
            console.error("Error submitting form", error);
            setSubmissionMessage("Something went wrong.");
            setMessageType("danger");
        }
    };


    const formRef = useRef();

    const generatePDF = async () => {
        const input = formRef.current;
        if (!input) {
            console.error("Form reference is not defined");
            return;
        }

        try {
            const canvas = await html2canvas(input, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;

            while (heightLeft > 0) {
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
                if (heightLeft > 0) {
                    pdf.addPage();
                    position = -imgHeight + heightLeft;
                }
            }

            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
        } catch (err) {
            console.error("Error generating PDF:", err);
            alert("Failed to generate PDF.");
        }
    };


    const fetchFormData = async () => {
        try {
            const response = await apiRoute.get(`/scrb_form/get_scrb_form2/${admission_no}`);
            const data = response.data;

            // Update form fields
            setFormData((formData) => ({
                ...formData,
                koppu_en: data.koppu_en || '',
                name_rescue: data.name_rescue || '',
                phone_no: data.phone_no || '',
                rescue_name: data.rescue_name || '',
                parent_name: data.parent_name || '',
                found_date: data.found_date || '',
                marital_status: data.marital_status || '',
                language1: data.language1 || '',
                district: data.district || '',
                police_station: data.police_station || '',
                addition_info: data.addition_info || '',
            }));

            // Base path for images
            const basePath = "https://www.pahrultours.com/app2/uploads/form_2a";

            // Handle old and new photo paths correctly
            const oldPhotoPath = data.old_photo ? `https://www.pahrultours.com/app2${data.old_photo}` : null;
            const newPhotoPath = data.new_photo ? `https://www.pahrultours.com/app2${data.new_photo}` : null;
            const signaturepath = data.signature ? `https://www.pahrultours.com/app2${data.signature}` : null;
            const sealpath = data.seal ? `https://www.pahrultours.com/app2${data.seal}` : null;

            // Set files state
            setFiles((files) => ({
                ...files,
                old_photo: oldPhotoPath,
                new_photo: newPhotoPath,
                signature: signaturepath,
                seal: sealpath,
            }));

            setPreviewRequested(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    };


    useEffect(() => {
        if (previewRequested) {
            // Delay slightly to allow DOM updates
            setTimeout(() => {
                generatePDF();
                setPreviewRequested(false);
            }, 100); // 100ms delay is often enough
        }
    }, [previewRequested]);

    //excel sheet code 
    const handleDownload = async () => {
        if (!admission_no.trim()) {
            alert("Please enter admission number.");
            return;
        }

        try {
            const response = await apiRoute.get(`/admision/getSCRBFormData/${admission_no}`);
            console.log("Full response:", response);

            const fetchedData = response.data?.data;
            console.log(fetchedData);

            if (!fetchedData || typeof fetchedData !== "object") {
                alert("Invalid or missing data from server.");
                return;
            }

            exportToExcel(fetchedData);
        } catch (error) {
            console.error("Error fetching or downloading:", error);
            alert("This form does not have a valid admission number.");
        }
    };

    const exportToExcel = (data) => {
        if (!data || (Array.isArray(data) && data.length === 0)) {
            alert("Invalid data for Excel export.");
            return;
        }

        // Ensure data is an array of objects
        const rows = Array.isArray(data) ? data : [data];

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "SCRB Form");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const fileData = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(fileData, `SCRB_Form2A_${rows[0].admission_no || "data"}.xlsx`);
    };

    const navigate = useNavigate();

    const handleNextpage = () => {

        navigate("/scrb_form2A");


    }


    return (
        <>
            <div className="d-xl-flex align-items-center flex-wrap flex-md-nowrap text-start py-2">
                <div className="d-block mb-4 mb-xl-0 px-4 ">
                    <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item></Breadcrumb.Item>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item active>Admission</Breadcrumb.Item>
                    </Breadcrumb>
                    <h6 className="breadcrumb_title">SCRB Form</h6>

                </div>

                <Col md={9} className="text-center">
                    <h4 className="section_title_1">FORM - 2 FOUND PERSON PERSONAL DETAILS</h4>
                    <h5 className="sub_title">படிவம் - 2 மீட்கப்பட்டவர்களின் விவரங்கள்</h5>
                </Col>
                {error && <div className="text-danger mb-2">{error}</div>}
                <Col md={1} className="d-flex align-items-center flex-column justify-content-end">
                    {rescue_image ? (
                        <>
                            <img
                                src={rescue_image}
                                alt="Admission"
                                className="img-fluid rounded"
                                style={{ width: "100px", height: "100px" }}
                            />
                            <p className="mt-2 text-start">{rescueName || "Not available"}</p>  {/* display name below */}
                        </>
                    ) : (
                        <p>{error || "No image to display"}</p>
                    )}
                </Col>



            </div>

            {/* Form 2 start */}
            <Container>
                <Row>

                    <Col md={12}>
                        <Row>
                            <Col md={8}>
                                <div className="d-flex align-items-center px-3">
                                    <form className="navbar-search d-flex" onSubmit={e => e.preventDefault()}>

                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Admission Number"
                                                value={admission_no}
                                                onChange={(e) => setAdmissionNumber(e.target.value)}
                                            />
                                            <button type="button" className="btn btn-success" onClick={handleSearch}>
                                                Enter
                                            </button>

                                        </div>
                                        <button type="button" className="btn btn-secondary mx-3" onClick={() => {
                                            if (!admission_no.trim()) {
                                                alert("Please enter admission number.");
                                            } else {
                                                fetchFormData(); // Fetch & populate data before generating PDF
                                            }
                                        }}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
                                        {/* <Col md={4}>
                                            <button type="button" className="btn btn-success" onClick={handleDownload}>
                                                Import Excel Sheet
                                            </button>
                                        </Col> */}

                                    </form>

                                </div>
                            </Col>

                            <Col md={4} className="d-flex align-items-center justify-content-end">
                                <Button variant="outline-success" className="m-1" type="button" onClick={handleNextpage}>
                                    <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Next
                                </Button>
                            </Col>
                        </Row>


                    </Col>

                    <div>
                        {/* Show success or error message box */}
                        {submissionMessage && (
                            <Alert variant={messageType} className="mt-3">
                                {submissionMessage}
                            </Alert>
                        )}
                    </div>


                    <div className="container mt-2 scrb_form_container">
                        <form onSubmit={handleSubmit}>
                            <table className="table table-bordered" style={{ border: "2px solid rgb(143 143 143)", marginBottom: "0rem" }}>

                                <tbody>
                                    <tr>
                                        <td style={{ width: '35%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>NAME OF THE NGO</label>
                                                    <h5 className="label_tamil">தொண்டு நிறுவனத்தின் பெயர்</h5>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '65%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <input
                                                        type="text"
                                                        name="name_ngo"
                                                        className="form-control text-center"
                                                        value={"MANASU (Mental Health Charity Home)"}
                                                        readOnly

                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style={{ width: '35%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>கோப்புஎண் :</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '65%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <input
                                                        type="text"
                                                        name="koppu_en"
                                                        className="form-control text-center"
                                                        required
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="invalid-feedback">
                                                    Please choose a username.
                                                </div>
                                            </div>
                                        </td>
                                    </tr>


                                    <tr>
                                        <td style={{ width: '35%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>FOUND PERSON PHOTO</label>
                                                    <h5 className="label_tamil">மீட்கப்பட்ட நபரின் புகைப்படம்</h5>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '65%' }}>
                                            <div className="d-flex justify-content-evenly">
                                                {/* Old Photo */}
                                                <div className="text-center" style={{ border: "1px solid rgb(108 108 108)", borderRadius: '5px' }}>
                                                    <label>RECENT PHOTO</label>
                                                    <h5 className="label_tamil">சமீபத்திய புகைப்படம்</h5>
                                                    <input
                                                        type="file"
                                                        name="old_photo"
                                                        className="form-control"
                                                        style={{ width: '300px', height: '100px' }}
                                                        onChange={handleFileChange}
                                                        required
                                                    />
                                                </div>

                                                {/* New Photo */}
                                                <div className="text-center" style={{ border: "1px solid rgb(108 108 108)", borderRadius: '5px' }}>
                                                    <label>PHOTO AT TIME YOU FOUND</label>
                                                    <h5 className="label_tamil">மீட்டகப்பட்டபொழுது எடுக்கப்பட்ட புகைப்படம்</h5>

                                                    <input
                                                        type="file"
                                                        name="new_photo"
                                                        className="form-control"
                                                        onChange={handleFileChange}
                                                        style={{ width: '300px', height: '100px' }}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                    </tr>



                                </tbody>
                            </table>

                            {formData && (
                                <table className="table table-border form_2_2" style={{ border: "2px solid rgb(143 143 143)" }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: '3%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>S.No</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ width: '10%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>Description / விவரங்கள்</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ width: '35%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>Details / விவரங்கள் </label>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '3%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>1</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ width: '10%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>Name of the Person / பெயர் :</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ width: '35%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <input
                                                            type="text"
                                                            name="rescue_name"
                                                            className="form-control text-center"
                                                            value={formData.rescue_name || ''}
                                                            onChange={handleInputChange}
                                                            required

                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '3%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>2</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ width: '10%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>Name of the Spouse/Parent :</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ width: '35%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <input
                                                            type="text"
                                                            name="father"
                                                            className="form-control text-center"
                                                            value={formData.father || ''}
                                                            required
                                                            onChange={handleInputChange}

                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '3%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>3</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ width: '10%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>Gendar / பாலினம் :</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ width: '35%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <input
                                                            type="text"
                                                            name="gender"
                                                            className="form-control text-center"
                                                            value={"Male"}
                                                            onChange={handleInputChange}
                                                            required

                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '3%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>4</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ width: '10%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>Found Date :</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ width: '35%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <input
                                                            type="date"
                                                            name="date_time"
                                                            className="form-control text-center"
                                                            value={formatDateOnly(formData.date_time || '')}
                                                            onChange={handleInputChange}
                                                            required // Or use onChange if it's editable
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '3%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>5</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ width: '10%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>Marital Status :</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ width: '35%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <input
                                                            type="text"
                                                            name="rescue_status"
                                                            value={formData.rescue_status || ''}
                                                            onChange={handleInputChange}
                                                            className="form-control text-center"
                                                            required

                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '3%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>6</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ width: '10%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>Language Known :</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ width: '35%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <input
                                                            type="text"
                                                            name="language1"
                                                            className="form-control text-center"
                                                            value={formData.language1 || ''}
                                                            onChange={handleInputChange}
                                                            required

                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '3%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>7</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ width: '10%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>District :</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ width: '35%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <input
                                                            type="text"
                                                            name="place"
                                                            className="form-control text-center"
                                                            onChange={handleInputChange}
                                                            value={formData.place || ''}
                                                            required

                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '3%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>8</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ width: '10%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label>Police Station (காவல் நிலையம்) :</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ width: '35%' }}>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <input
                                                            type="text"
                                                            name="police_station"
                                                            className="form-control text-center"
                                                            onChange={handleInputChange}
                                                            value={formData.police_station || ''}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            )}
                            <table className="table table-border" style={{ border: "2px solid rgb(143 143 143)" }}>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="row">
                                                <div className="col-md-12 text-start">
                                                    <label>Any other addtional information / கூடுதல் விவரங்கள் ஏதெனும் இருப்பின் :</label>
                                                    <textarea className="form-control"
                                                        name="addition_info"
                                                        id="exampleFormControlTextarea1"
                                                        onChange={handleInputChange}
                                                        required
                                                        rows="3"></textarea>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="row">
                                                <div className="col-md-12 text-start">
                                                    <label>SIGNATURE / கையொப்பம் : </label>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="file"
                                                name="signature"
                                                onChange={handleFileChange}
                                                className="form-control"
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="row">
                                                <div className="col-md-12 text-start">
                                                    <label>NAME / பெயர் :</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="rescue_name"
                                                className="form-control"
                                                onChange={handleInputChange}
                                                value={formData.rescue_name}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="row">
                                                <div className="col-md-12 text-start">
                                                    <label>PHONE NUMBER / தொலைபேசி எண் :</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="phone_no"
                                                onChange={handleInputChange}
                                                className="form-control"
                                                value={formData.phone_no}
                                                required
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <div className="row">
                                                <div className="col-md-12 text-start">
                                                    <label>SEAL / முத்திரை : </label>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="file"
                                                name="seal"
                                                onChange={handleFileChange}
                                                className="form-control"
                                                required
                                            />
                                        </td>
                                    </tr>

                                </tbody>
                            </table>

                            <div className="mb-3">

                                <button type="submit" className="btn btn-success">
                                    Submit Form
                                </button>

                            </div>
                        </form>
                    </div>


                    <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                        <Row className="d-flex align-items-center justify-content-center mb-2">
                            <Col md={2}>
                                <img src={manasu_logo} className="pdf_logo" alt="" />
                            </Col>
                            <Col md={10}>
                                <h4 className="text-center">FORM 2 - PDF PREVIEW</h4>
                            </Col>
                        </Row>

                        <form>
                            <table className="table table-bordered" style={{ border: "2px solid rgb(143 143 143)", marginBottom: "0rem" }}>

                                <tbody>
                                    <tr>
                                        <td style={{ width: '35%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>NAME OF THE NGO</label>
                                                    <h5 className="label_tamil">தொண்டு நிறுவனத்தின் பெயர்</h5>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '65%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <input
                                                        type="text"
                                                        name="name_ngo"
                                                        className="form-control text-center"
                                                        value={"MANASU (Mental Health Charity Home)"}
                                                        readOnly

                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style={{ width: '35%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>கோப்புஎண் :</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '65%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <input
                                                        type="text"
                                                        name="koppu_en"
                                                        className="form-control text-center"
                                                        value={formData.koppu_en}
                                                        required
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="invalid-feedback">
                                                    Please choose a username.
                                                </div>
                                            </div>
                                        </td>
                                    </tr>


                                    <tr>
                                        <td style={{ width: '35%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>FOUND PERSON PHOTO</label>
                                                    <h5 className="label_tamil">மீட்கப்பட்ட நபரின் புகைப்படம்</h5>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '100%' }}>
                                            <div className="d-flex justify-content-evenly">
                                                {/* Old Photo */}
                                                <div className="text-center" style={{ border: "1px solid rgb(108 108 108)", borderRadius: '5px' }}>
                                                    <label>Old Photo</label><br />
                                                    {files.old_photo ? (
                                                        <>
                                                            <img
                                                                src={files.old_photo}
                                                                alt="Old"
                                                                style={{ width: "100px", height: "100px", marginTop: "10px" }}
                                                            />
                                                        </>
                                                    ) : (
                                                        <p>No old photo available</p> // Display if no photo
                                                    )}
                                                </div>

                                                {/* New Photo */}
                                                <div className="text-center" style={{ border: "1px solid rgb(108 108 108)", borderRadius: '5px' }}>
                                                    <label>New Photo</label><br />
                                                    {files.new_photo ? (
                                                        <>
                                                            <img
                                                                src={files.new_photo}
                                                                alt="New"
                                                                style={{ width: "100px", height: "100px", marginTop: "10px" }}
                                                            />
                                                        </>
                                                    ) : (
                                                        <p>No new photo available</p> // Display if no photo
                                                    )}
                                                </div>
                                            </div>
                                        </td>



                                    </tr>



                                </tbody>
                            </table>

                            <table className="table table-border form_2_2" style={{ border: "2px solid rgb(143 143 143)" }}>
                                <tbody>
                                    <tr>
                                        <td style={{ width: '3%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>1</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '10%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>Description / விவரங்கள்</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '35%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>Details / விவரங்கள் </label>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: '3%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>1</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '10%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>Name of the Person / பெயர் :</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '35%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <input
                                                        type="text"
                                                        name="rescue_name"
                                                        className="form-control text-center"
                                                        value={formData.rescue_name}
                                                        onChange={handleInputChange}


                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: '3%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>2</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '10%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>Name of the Spouse/Parent :</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '35%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <input
                                                        type="text"
                                                        name="father"
                                                        className="form-control text-center"
                                                        value={formData.parent_name}
                                                        readOnly
                                                        onChange={handleInputChange}

                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: '3%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>3</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '10%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>Gendar / பாலினம் :</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '35%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <input
                                                        type="text"
                                                        name="gender"
                                                        className="form-control text-center"
                                                        value={"Male"}
                                                        onChange={handleInputChange}
                                                        readOnly

                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: '3%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>4</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '10%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>Found Date :</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '35%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <input
                                                        type="date"
                                                        name="date_time"
                                                        className="form-control text-center"
                                                        value={formatDateOnly(formData.found_date)}
                                                        onChange={handleInputChange}
                                                        readOnly // Or use onChange if it's editable
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: '3%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>5</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '10%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>Marital Status :</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '35%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <input
                                                        type="text"
                                                        name="rescue_status"
                                                        value={formData.marital_status}
                                                        onChange={handleInputChange}
                                                        className="form-control text-center"
                                                        readOnly

                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: '3%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>6</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '10%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>Language Known :</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '35%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <input
                                                        type="text"
                                                        name="language1"
                                                        className="form-control text-center"
                                                        value={formData.language1 || ''}
                                                        onChange={handleInputChange}
                                                        readOnly

                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: '3%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>7</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '10%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>District :</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '35%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <input
                                                        type="text"
                                                        name="place"
                                                        className="form-control text-center"
                                                        onChange={handleInputChange}
                                                        value={formData.district}
                                                        readOnly

                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: '3%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>8</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '10%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>Police Station (காவல் நிலையம்) :</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ width: '35%' }}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <input
                                                        type="text"
                                                        name="police_station"
                                                        className="form-control text-center"
                                                        onChange={handleInputChange}
                                                        value={formData.police_station}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                            <table className="table table-border" style={{ border: "2px solid rgb(143 143 143)", marginBottom: "60px", marginTop: "50px" }}>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="row">
                                                <div className="col-md-12 text-start">
                                                    <label>Any other addtional information / கூடுதல் விவரங்கள் ஏதெனும் இருப்பின் :</label>
                                                    <textarea className="form-control"
                                                        name="addition_info"
                                                        id="exampleFormControlTextarea1"
                                                        onChange={handleInputChange}
                                                        value={formData.addition_info}
                                                        required
                                                        rows="3"></textarea>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td style={{ marginTop: "40px" }}>
                                            <div className="row">
                                                <div className="col-md-12 text-start">
                                                    <label>SIGNATURE / கையொப்பம் : </label>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ marginBottom: "20px" }}>
                                            {files.signature ? (
                                                <>
                                                    <img
                                                        src={files.signature}
                                                        alt="Old"
                                                        style={{ width: "80px", height: "80px" }}
                                                    />
                                                </>
                                            ) : (
                                                <p>No signature available</p> // Display if no photo
                                            )}
                                        </td>
                                    </tr>
                                    <tr className="mt-5 pt-5">
                                        <td>
                                            <div className="row">
                                                <div className="col-md-12 text-start">
                                                    <label>NAME / பெயர் :</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="rescue_name"
                                                className="form-control"
                                                onChange={handleInputChange}
                                                value={formData.rescue_name}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="row">
                                                <div className="col-md-12 text-start">
                                                    <label>PHONE NUMBER / தொலைபேசி எண் :</label>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="phone_no"
                                                onChange={handleInputChange}
                                                value={formData.phone_no}
                                                className="form-control"
                                                required
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <div className="row">
                                                <div className="col-md-12 text-start">
                                                    <label>SEAL / முத்திரை : </label>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {files.seal ? (
                                                <>
                                                    <img
                                                        src={files.seal}
                                                        alt="Old"
                                                        style={{ width: "80px", height: "80px" }}
                                                    />
                                                </>
                                            ) : (
                                                <p>No seal available</p> // Display if no photo
                                            )}
                                        </td>
                                    </tr>

                                </tbody>
                            </table>


                        </form>
                    </div>

                </Row>
            </Container>
        </>
    )
}

export default SCRB_form;