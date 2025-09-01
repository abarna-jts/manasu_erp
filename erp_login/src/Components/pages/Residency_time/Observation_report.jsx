import React from 'react';
import { Breadcrumb, Container, Row, Table, Button } from 'react-bootstrap';
import { Col, Form, InputGroup } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css
import { Alert } from "react-bootstrap";
import Cookies from 'js-cookie';
import { useRef } from 'react';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import manasu_logo from '../Admission/Manasu-Logo.png';
import { useSelector, useDispatch } from 'react-redux';
import {
    loadPhotosFromStorage,
    savePhotosToStorage,
    resetObservationData,
    setObservationField,
    clearObservationImages
} from "../../../store/observationSlice";
import { loadRecoveryPhotos, clearRecoveryPhotos } from "../../../store/photoStorage";
import imageCompression from 'browser-image-compression';

function Observation_report() {
    const [condition_details, setConditionDetails] = useState([]);
    const [show, setShow] = useState(false);
    const [editshow, setEditShow] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [admission_no, setAdmissionNumber] = useState("");
    const [rescueName, setRescueName] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [previewRequested, setPreviewRequested] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    const handleEditClose = () => setEditShow(false);

    const userType = Cookies.get('usertype');

    //alert box values
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'


    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const dispatch = useDispatch();

    const formData = useSelector((state) => state.observation);

    // Load photos from IndexedDB on mount
    useEffect(() => {
        dispatch(loadPhotosFromStorage());
    }, [dispatch]);

    const [EditData, setEditData] = useState({
        admission_no: '',
        resident_name: '',
        follow_up: '',
        date: ''
    });

    const [files, setFiles] = useState({
        recovery_photo: null,
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(setObservationField({ field: name, value }));
    };

    const handleInputChangeEdit = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    // const handleFileChange = (e) => {
    //     setFiles({
    //         ...files,
    //         [e.target.name]: Array.from(e.target.files)  // Store all selected files as an array
    //     });
    // };

    // Convert files to Base64 for storage in Redux/localStorage
    // const handleFileChange = (e) => {
    //     const selectedFiles = Array.from(e.target.files);
    //     dispatch(savePhotosToStorage(selectedFiles)); // saves to IndexedDB + Redux
    // };

    const handleFileChange = async (event) => {
        const selectedFiles = Array.from(event.target.files);
        if (!selectedFiles.length) return;

        const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
            fileType: "image/jpeg", // force JPEG output
        };

        try {
            // Compress all images
            const compressedFiles = await Promise.all(
                selectedFiles.map(async (file, idx) => {
                    const compressed = await imageCompression(file, options);

                    // Rename to avoid .blob
                    const ext = compressed.type.split("/")[1]; // e.g. jpeg
                    return new File([compressed], `Observation_${Date.now()}_${idx}.${ext}`, {
                        type: compressed.type,
                    });
                })
            );

            // ✅ Save all compressed files to Redux / storage
            dispatch(savePhotosToStorage(compressedFiles));
        } catch (e) {
            console.error("Compression error:", e);
        }
    };


    useEffect(() => {
        try {
            const stored = localStorage.getItem('admissionObservationInfo');
            if (stored) {
                const { admission_no: storedAdm, date: storedName } = JSON.parse(stored);
                if (storedAdm) setAdmissionNumber(storedAdm);
                if (storedName) setRescueName(storedName);
            }
        } catch (e) {
            console.warn('Failed to parse stored admission info', e);
        }
    }, []);

    // whenever admission_no or date changes, persist
    useEffect(() => {
        try {
            localStorage.setItem(
                'admissionObservationInfo',
                JSON.stringify({ admission_no, rescueName })
            );
        } catch (e) {
            console.warn('Failed to save admission info', e);
        }
    }, [admission_no, rescueName]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }

        const trimmedAdNo = admission_no.trim();
        if (!/^\d{8,13}$/.test(trimmedAdNo)) {
            alert("Admission Number must be between 8 to 13 digits (numbers only).");
            return;
        }

        const data = new FormData();
        data.append('admission_no', admission_no);
        data.append('resident_name', rescueName);
        data.append('date', formData.date);
        data.append('follow_up', formData.follow_up);

        // ✅ Get raw File objects directly from IndexedDB
        const realFiles = await loadRecoveryPhotos();
        if (realFiles && realFiles.length > 0) {
            realFiles.forEach(file => {
                data.append("recovery_photo", file);
            });
        }

        try {
            const res = await apiRoute.post('/residency/create_observation_report', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.data.message === "Rescue Condition Created Successfully") {
                alert("Observation Report Created Successfully");

                handleClose(true);
                setAdmissionNumber("");
                setRescueName("");
                getConditionDetails();

                // ✅ Reset Redux + IndexedDB
                dispatch(resetObservationData());
                await clearRecoveryPhotos();
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

    const downloadImage = (url, filename) => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(console.error);
    };

    const handleEdiShow = async (id) => {
        try {
            const response = await apiRoute.get(`/residency/show_data/${id}`);
            const data = response.data;

            const [fromFormatted] = data.date.split(' to ');

            const parseDate = (dmy) => {
                const [day, month, year] = dmy.split("-");
                return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
            };

            setEditData((EditData) => ({
                ...EditData,
                admission_no: data.admission_no || '',
                resident_name: data.resident_name || '',
                follow_up: data.follow_up || '',
                date: parseDate(fromFormatted) || '',
                recovery_photo: data.recovery_photo,
            }));

            const parseImageField = (fieldData) => {
                let paths = [];
                if (fieldData) {
                    try {
                        const parsed = JSON.parse(fieldData);
                        if (Array.isArray(parsed)) {
                            paths = parsed.map((p) =>
                                `https://www.pahrultours.com/app2/${p.replace(/"/g, '')}`
                            );
                        }
                    } catch (err) {
                        // Fallback to comma-separated string
                        paths = fieldData
                            .split(',')
                            .map((p) =>
                                `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, '')}`
                            );
                    }
                }
                return paths;
            };

            const RecoveryPhoto = parseImageField(data.recovery_photo);

            // Set files state
            setFiles((files) => ({
                ...files,
                recovery_photo: RecoveryPhoto,
            }));

            setEditShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Error to upload data");
        }
    }

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('admission_no', EditData.admission_no);
        data.append('resident_name', EditData.resident_name);
        data.append('date', EditData.date);
        data.append('follow_up', EditData.follow_up);

        if (files.recovery_photo && files.recovery_photo.length > 0) {
            files.recovery_photo.forEach(file => {
                data.append('recovery_photo', file); // ✅ no []
            });
        }

        try {
            const res = await apiRoute.post(`/residency/updateObservationReport/${EditData.admission_no}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.data.message === "Observation updated successfully") {
                alert("Observation Report Updated Successfully");

                setEditShow(false);
                getConditionDetails('');
            } else {
                setSubmissionMessage("updation failed.");
                setMessageType("danger");
            }
        } catch (error) {
            console.error("Error submitting form", error);
            setSubmissionMessage("Something went wrong.");
            setMessageType("danger");
        }
    };

    const formatDate1 = (dateString) => {
        const date = new Date(dateString);
        const day = (`0${date.getDate()}`).slice(-2);
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        getConditionDetails();
    }, []);

    const getConditionDetails = async () => {
        try {
            const response = await apiRoute.get('/residency/get_observation_report');
            console.log("API response:", response.data);
            setConditionDetails(response.data.data);
        } catch (error) {
            console.error('Error fetching Student:', error);
        }
    };

    const searchFilteredRescueDetails = condition_details.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.admission_no).toLowerCase().includes(searchTerm) ||
            String(item.resident_name).toLowerCase().includes(searchTerm) ||
            String(item.follow_up).toLowerCase().includes(searchTerm)
        );
    });

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date)) return ""; // Handle invalid dates
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // const handleDelete = async (id) => {
    //     alert("Are you sure want to delete");
    //     try {
    //         const response = await apiRoute.delete(`residency/delete_condition_details/${id}`);
    //         console.log(response);
    //         alert("First Form Details Deleted successfully");
    //         // Refresh data after deletion
    //         getConditionDetails(); // if this function fetches updated student list
    //     } catch (error) {
    //         console.error('Failed to delete item:', error);
    //     }
    // };

    const handleAdmissionChange = (e) => {
        setAdmissionNumber(e.target.value);
    };

    useEffect(() => {
        if (admission_no.trim() !== "") {
            fetchRescueDetails(admission_no);
        } else {
            setRescueName("");
        }
    }, [admission_no]);

    const fetchRescueDetails = async (admission_no) => {
        try {
            const response = await apiRoute.get(`/admision/get_scrbform2data/${admission_no}`);
            const result = response.data.data[0];
            console.log("API Result:", result);

            if (result && result.rescue_name) {

                setRescueName(result.rescue_name || "");
            } else {

                setError("Image not found for this admission number");
            }
        } catch (error) {
            console.error("Error fetching data", error);
            setRescueName("");
        }
    };

    const ViewFormData = async (id) => {
        try {
            const response = await apiRoute.get(`/residency/show_data/${id}`);
            const data = response.data;

            const [fromFormatted, toFormatted] = data.date.split(' to ');

            const parseDate = (dmy) => {
                const [day, month, year] = dmy.split("-");
                return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
            };

            // Update form fields
            setEditData((EditData) => ({
                ...EditData,
                admission_no: data.admission_no || '',
                resident_name: data.resident_name || '',
                follow_up: data.follow_up || '',
                date: parseDate(fromFormatted) || '',
            }));

            let recovery_photoPath = [];
            if (data.recovery_photo) {
                try {
                    const parsed = JSON.parse(data.recovery_photo);
                    if (Array.isArray(parsed)) {
                        recovery_photoPath = parsed.map((p) => `https://www.pahrultours.com/app2/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse signature:', err);
                    // Fallback: comma-separated string
                    recovery_photoPath = data.recovery_photo
                        .split(',')
                        .map((p) => `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }
            console.log(recovery_photoPath);
            // Set files state
            setFiles((files) => ({
                ...files,
                recovery_photo: recovery_photoPath,
            }));

            setPreviewRequested(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    }

    useEffect(() => {
        if (previewRequested) {
            // Delay slightly to allow DOM updates
            setTimeout(() => {
                generatePDF();
                setPreviewRequested(false);
            }, 100); // 100ms delay is often enough
        }
    }, [previewRequested]);

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
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchFilteredRescueDetails.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(searchFilteredRescueDetails.length / itemsPerPage);
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleClearData = () => {
        dispatch(resetObservationData());
        setAdmissionNumber("");
        setRescueName("");
        dispatch(clearObservationImages());
    }


    return (
        <>
            <Container fluid>
                <Row className='d-flex align-items-center justify-content-between'>
                    <Col md={3} className='text-start'>
                        <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item></Breadcrumb.Item>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item active>Residency Time</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Observation Report</h6>
                    </Col>
                    <Col md={7} className="text-start">
                        <h3 className="section_title text-center">Resident Observation & Progress Report – Social Worker</h3>
                    </Col>
                    <Col md={2}>
                        <Form className="navbar-search">
                            <Form.Group id="topbarSearch">
                                <InputGroup className="input-group-merge search-bar">
                                    <Form.Control
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {userType === "4" && (
                                        <InputGroup.Text style={{ cursor: 'pointer', background: "#6abc15", color: "#fff" }} onClick={handleShow}>
                                            <i className="fas fa-plus"></i>
                                        </InputGroup.Text>
                                    )}

                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>

            <div>
                {/* Show success or error message box */}
                {submissionMessage && (
                    <Alert variant={messageType} className="mt-3">
                        {submissionMessage}
                    </Alert>
                )}
            </div>


            <Container>
                <Row>
                    <Col md={4}>
                        {userType === "4" && (
                            <Button variant="success" className="m-1 d-flex justify-content-start align-items-center" type="submit" onClick={handleShow}>Enter Condition</Button>
                        )}
                    </Col>
                    <Col md={12} className="mt-3 my-3">

                        <Table responsive className="table-centered table-nowrap rounded mb-0">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">S.No.</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Admission Number</th>
                                    <th scope="col">Resident Name</th>
                                    <th scope="col">Follow Up </th>
                                    <th scope="col">Recovery Photo</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{indexOfFirstItem + index + 1}</td>
                                            <td>{item.date}</td>
                                            <td>{item.admission_no}</td>
                                            <td>{item.resident_name}</td>
                                            <td className='text-justify'>{item.follow_up || "NULL"}</td>
                                            <td className='d-flex align-items-center justify-content-center'>
                                                {(() => {
                                                    let imagePath = item.recovery_photo;

                                                    if (imagePath == `[]`) {
                                                        return (
                                                            <>
                                                                <span className='mb-4'>No Image</span>
                                                            </>
                                                        )
                                                    }

                                                    try {
                                                        const parsed = JSON.parse(item.recovery_photo);
                                                        if (Array.isArray(parsed) && parsed.length > 0) {
                                                            imagePath = parsed[0];
                                                        }
                                                    } catch (e) {
                                                        // fallback to original string
                                                    }

                                                    const fullUrl = `https://www.pahrultours.com/app2/${imagePath}`;
                                                    const filename = imagePath?.split("/").pop();

                                                    return imagePath ? (
                                                        <div className="image-container">
                                                            <img
                                                                src={fullUrl}
                                                                alt="Recovery Photo"
                                                                className="preview-image"
                                                            />
                                                            <div className="image-overlay">
                                                                {/* View icon */}
                                                                <a
                                                                    href={fullUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    title="View Image"
                                                                    className="icon-button"
                                                                >
                                                                    <i className="fas fa-eye"></i>
                                                                </a>

                                                                {/* Download icon */}
                                                                <button
                                                                    title="Download Image"
                                                                    className="icon-button"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl, { mode: "cors" })
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement("a");
                                                                                a.href = url;
                                                                                a.download = filename || "image.jpg";
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);
                                                                            })
                                                                            .catch(() => alert("Download failed."));
                                                                    }}
                                                                >
                                                                    <i className="fas fa-download"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span>No image</span>
                                                    );
                                                })()}
                                            </td>

                                            <td>
                                                <button className="btn btn-success icon_details" onClick={() => ViewFormData(item.id)}>
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="btn btn-success icon_details" onClick={() => handleEdiShow(item.id)}>
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                {/* <button className="btn btn-danger icon_details" onClick={() => handleDelete(item.id)}>
                                                    <i className="fas fa-trash"></i>
                                                </button> */}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center text-danger">No data found</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        <div className="d-flex justify-content-end align-items-center mb-3 mx-3">
                            <button
                                className="btn btn-success me-2"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>

                            <span> Page {currentPage} of {totalPages} </span>

                            <button
                                className="btn btn-success ms-2"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter Rescue Condition</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formAdmissionNo">
                                <Form.Label>Admission No. <span style={{ color: 'red' }}>*</span></Form.Label>
                                <div className="form_flex d-flex align-items-center">
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter Admission Number"
                                        name="admission_no"
                                        value={admission_no}
                                        onChange={handleAdmissionChange}
                                        required
                                    />
                                    <div className="close_admission mx-2" onClick={handleClearData}>
                                        <i className="bi bi-x-circle" style={{ color: "red" }}></i>
                                    </div>
                                </div>

                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formResidentName">
                                <Form.Label>Resident Name <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="resident_name"
                                    placeholder="Enter Resident Name"
                                    value={rescueName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Date <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={formData?.date || ""}   // prevent crash if undefined
                                    onChange={handleInputChange}
                                    max="9999-12-31"
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Rescue Recovery Photo Attachment </Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    name="recovery_photo"
                                    multiple

                                />
                            </Form.Group>
                            {/* {files.recovery_photo && files.recovery_photo.length > 0 && (
                                <div className="mt-2">
                                    <h5>Selected Photos (preview):</h5>
                                    <div className="d-flex flex-wrap gap-3">
                                        {files.recovery_photo.map((file, idx) => (
                                            <img
                                                key={idx}
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                style={{
                                                    width: "120px",
                                                    height: "120px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )} */}

                            {formData.recovery_photo.length > 0 && (
                                <div className="mt-2">
                                    <h5>Selected Photos :</h5>
                                    <div className="d-flex flex-wrap gap-3">
                                        {formData.recovery_photo.map((file, idx) => (
                                            <img
                                                key={idx}
                                                src={file.preview}
                                                alt={file.name}
                                                style={{
                                                    width: "120px",
                                                    height: "120px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}


                            <Form.Group className="mb-3" controlId="formFollowUp">
                                <Form.Label>Follow Up <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData?.follow_up}
                                    onChange={handleInputChange}
                                    name="follow_up"
                                    required

                                />
                            </Form.Group>

                            <div className="btn_footer d-flex align-items-center justify-content-end">
                                <Button variant="success" type="submit" className="m-1">
                                    Submit
                                </Button>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>

            <Modal show={editshow} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Resident Observation & Progress Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            <Form.Group className="mb-3" controlId="formAdmissionNo">
                                <Form.Label>Admission No. <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Admission Number"
                                    name="admission_no"
                                    value={EditData.admission_no}
                                    onChange={handleInputChangeEdit}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formResidentName">
                                <Form.Label>Resident Name <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="resident_name"
                                    placeholder="Enter Resident Name"
                                    value={EditData.resident_name}
                                    onChange={handleInputChangeEdit}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Date <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    max="9999-12-31"
                                    value={EditData.date}
                                    onChange={handleInputChangeEdit}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                {/* <Form.Label column sm="5" className='text-start'>Resident Recovery Photo Attachment:</Form.Label> */}
                                <Col sm="12">
                                    {Array.isArray(files.recovery_photo) &&
                                        files.recovery_photo.map((imgUrl, index) => {
                                            const filename = `recovery_photo${index}.jpg`;

                                            return (
                                                <div
                                                    key={index}
                                                    className="image-container"
                                                    style={{
                                                        position: "relative",
                                                        width: "100px",
                                                        height: "100px",
                                                        margin: "10px",
                                                        display: "inline-block",
                                                    }}
                                                >
                                                    <img
                                                        src={imgUrl}
                                                        alt={`Recovery Photo - ${index}`}
                                                        loading="lazy"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                            border: "1px solid #ccc",
                                                            borderRadius: "4px",
                                                        }}
                                                        onError={(e) => {
                                                            if (!e.target.dataset.errorHandled) {
                                                                e.target.src = "/fallback-image.png";
                                                                e.target.dataset.errorHandled = "true";
                                                            }
                                                        }}
                                                    />

                                                    <div className="image-overlay">
                                                        {/* View icon */}
                                                        <a
                                                            href={imgUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="View Image"
                                                            className="icon-button"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </a>

                                                        {/* Download icon */}
                                                        <button
                                                            title="Download Image"
                                                            className="icon-button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                fetch(imgUrl, { mode: "cors" })
                                                                    .then((res) => res.blob())
                                                                    .then((blob) => {
                                                                        const url = window.URL.createObjectURL(blob);
                                                                        const a = document.createElement("a");
                                                                        a.href = url;
                                                                        a.download = filename;
                                                                        a.click();
                                                                        window.URL.revokeObjectURL(url);
                                                                    })
                                                                    .catch(() => alert("Download failed."));
                                                            }}
                                                        >
                                                            <i className="fas fa-download"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    <Form.Control
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        name="recovery_photo"
                                        onChange={handleFileChange}
                                        multiple
                                    />
                                </Col>
                            </Form.Group>


                            <Form.Group className="mb-3" controlId="formFollowUp">
                                <Form.Label>Follow Up <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={EditData.follow_up}
                                    onChange={handleInputChangeEdit}
                                    name="follow_up"
                                    required
                                />
                            </Form.Group>

                            <div className="btn_footer d-flex align-items-center justify-content-end">
                                <Button variant="success" type="submit" onClick={handleUpdateSubmit} className="m-1">
                                    Submit
                                </Button>
                                <Button variant="secondary" onClick={handleEditClose}>
                                    Close
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>

            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                <Row className="d-flex align-items-center justify-content-center mb-2">
                    <Col md={3} className='d-flex align-items-center pdf_logo'>
                        <img src={manasu_logo} className="pdf_logo" alt="" />
                        {/* <div className="logo_text">
                                                    <h4><span>MANASU</span> <br />Mental Health Charity Home <br />Chennai,</h4>
                                                </div> */}
                    </Col>
                    <Col md={9}>
                        <h4 className="text-center">Resident Observation & Progress Report - Social Worker</h4>
                    </Col>
                </Row>
                <Col md={12}>
                    <Form>
                        <Form.Group as={Row} className="mb-3" controlId="formAdmissionNo">
                            <Form.Label column sm="4" className='text-start'>Admission No. : </Form.Label>
                            <Col sm="6" className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px", margin: "13px" }}>
                                {EditData.admission_no}
                            </Col>

                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formResidentName">
                            <Form.Label column sm="4" className='text-start'>Resident Name : </Form.Label>
                            <Col sm="6" className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px", margin: "13px" }}>
                                {EditData.resident_name}
                            </Col>

                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="4" className='text-start'>Date :</Form.Label>
                            <Col sm="6" className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px", margin: "13px" }}>
                                {EditData.date}
                            </Col>

                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="4" className='text-start'>Attach Photos:</Form.Label>
                            <Col sm="6">
                                {Array.isArray(files.recovery_photo) && files.recovery_photo.length > 0 ? (
                                    files.recovery_photo.map((imgUrl, index) => (
                                        <img
                                            key={index}
                                            src={imgUrl}
                                            alt={`rescue recovery ${index + 1}`}
                                            loading="lazy"
                                            style={{
                                                width: "100px",
                                                height: "auto",
                                                margin: "10px",
                                                border: "1px solid #ccc",
                                            }}
                                            onError={(e) => {
                                                if (!e.target.dataset.errorHandled) {
                                                    e.target.src = "/fallback-image.png";
                                                    e.target.dataset.errorHandled = "true";
                                                }
                                            }}
                                        />
                                    ))
                                ) : (
                                    <div style={{ padding: "10px", fontStyle: "italic" }}>No image</div>
                                )}
                            </Col>
                        </Form.Group>


                        {/* <Form.Group as={Row} className="mb-3" controlId="formFollowUp">
                            <Form.Label column sm="4" className='text-start'>Follow Up : <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Col sm="6">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData.follow_up}
                                    onChange={handleInputChange}
                                    name="follow_up"
                                    multiple

                                />
                            </Col>

                        </Form.Group> */}

                        <Form.Group className="mb-3" as={Row}>
                            <Form.Label column sm="4" className='text-start'>Follow Up : </Form.Label>
                            <Col md={6} className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px", margin: "13px" }}>
                                <div
                                    className="wrap-textarea"
                                    style={{

                                        minHeight: '40px',
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                        textAlign: "justify"
                                    }}
                                >
                                    {EditData.follow_up}
                                </div>

                            </Col>
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={12}>
                    <Row className="d-flex align-items-center justify-content-center mt-5">
                        <Col md={6} className="mt-3 down_title">
                            <h5 className="text-start">Signature / Thumbprint of Resident's</h5>
                        </Col>
                        <Col md={6} className="mt-3 down_title">
                            <h5 className="text-end">Manasu Seal</h5>
                        </Col>
                    </Row>
                </Col>

            </div>
        </>
    )
}

export default Observation_report
