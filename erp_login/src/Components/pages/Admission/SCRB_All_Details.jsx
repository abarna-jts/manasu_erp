import React from 'react'
import { Breadcrumb, Form, InputGroup, Container, Row, Col, Table } from '@themesberg/react-bootstrap';
import { useState, useEffect } from "react";
import axios from 'axios';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

function SCRB_All_Details() {
    const [scrbForm2List, setScrbForm2List] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [show, setShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [formData, setFormData] = useState({
        id: '',
        koppu_en: '',
        admission_no: '',
        name_rescue: '',
        phone_no: '',
        rescue_name: '',
        father: '',
        date_time: '',
        rescue_status: '',
        language: '',
        place: '',
        police_station: '',
        addition_info: '',
    });

    const [files, setFiles] = useState({
        old_photo: null,
        new_photo: null,
        signature: null,
        seal: null,
    });

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

    const handleClose = () => setShow(false);

    // Dummy function: Replace with real API call
    const fetchSCRBForm2Report = async () => {
        try {
            const response = await apiRoute.get('/scrb_form/getAllSCRBForm2');
            setScrbForm2List(response.data.data); // ✅ Only set the actual data
            console.log(response);
        } catch (err) {
            console.error('Error fetching SCRB Form2 Report:', err);
        }
    };

    useEffect(() => {
        fetchSCRBForm2Report();
    }, []);

    const searchFilteredRescueDetails = scrbForm2List.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.admission_no).toLowerCase().includes(searchTerm) ||
            String(item.rescue_name).toLowerCase().includes(searchTerm) ||
            String(item.name_ngo).toLowerCase().includes(searchTerm) ||
            String(item.koppu_en).toLowerCase().includes(searchTerm)
        );
    });


    const formatDateOnly = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date)) return ""; // Handle invalid date

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const handleInputChange = (e) => {
        setCelebrationData({ ...celebrationData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles({
            ...files,
            [e.target.name]: Array.from(e.target.files)  // Store all selected files as an array
        });
    };

    const handleEditform = async (id) => {
        if (!id) {
            console.warn("No valid ID provided to handleEditform");
            return;
        }
        try {
            const response = await apiRoute.get(`/scrb_form/getSCRB_form2/${id}`);
            const data = response.data; // Access the first object in the 'data' array
            console.log(data.id);
            setFormData({
                id: data.id || '',
                name_ngo: data.name_ngo || 'NULL',
                admission_no: data.admission_no || 'NULL',
                koppu_en: data.koppu_en || 'NULL',
                rescue_name: data.rescue_name || 'NULL',
                parent_name: data.parent_name || 'NULL',
                gender: data.gender || 'NULL',
                found_date: data.found_date || 'NULL',
                marital_status: data.marital_status || 'NULL',
                language: data.language || 'NULL',
                district: data.district || 'NULL',
                police_station: data.police_station || 'NULL',
                addition_info: data.addition_info || 'NULL',
                name_rescue: data.name_rescue || 'NULL',
                phone_no: data.phone_no || 'NULL'
            });

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

            const oldPhotoPath = parseImageField(data.old_photo);
            const newPhotoPath = parseImageField(data.new_photo);
            const signaturePhotoPath = parseImageField(data.signature);
            const sealPhotoPath = parseImageField(data.seal);

            setFiles((files) => ({
                ...files,
                old_photo: oldPhotoPath,
                new_photo: newPhotoPath,
                signature: signaturePhotoPath,
                seal: sealPhotoPath,
            }));

            setShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const id = formData.id; // ✅ Get it from form data
        console.log("Updating form with ID:", id);
        if (!id) {
            alert("ID not found.");
            return;
        }
        const data = new FormData();
        data.append('name_ngo', formData.name_ngo);
        data.append('koppu_en', formData.koppu_en);
        data.append('rescue_name', formData.rescue_name);
        data.append('parent_name', formData.parent_name);
        data.append('gender', formData.gender);
        data.append('found_date', formData.found_date);
        data.append('marital_status', formData.marital_status);
        data.append('language', formData.language);
        data.append('district', formData.district);
        data.append('police_station', formData.police_station);
        data.append('addition_info', formData.addition_info);
        data.append('name_rescue', formData.name_rescue);
        data.append('phone_no', formData.phone_no);


        if (files.old_photo && files.old_photo.length > 0) {
            files.old_photo.forEach(file => {
                data.append('old_photo', file); // ✅ no []
            });
        }
        if (files.new_photo && files.new_photo.length > 0) {
            files.new_photo.forEach(file => {
                data.append('new_photo', file); // ✅ no []
            });
        }
        if (files.signature && files.signature.length > 0) {
            files.signature.forEach(file => {
                data.append('signature', file); // ✅ no []
            });
        }
        if (files.seal && files.seal.length > 0) {
            files.seal.forEach(file => {
                data.append('seal', file); // ✅ no []
            });
        }
        try {
            const response = await apiRoute.put(`/scrb_form/updateForm2/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log(response.data);
            if (response.status === 200 || response.status === 201) {
                alert('Form Updated successfully!');
                handleClose(true);
                setFormData({
                    name_ngo: '',
                    koppu_en: '',
                    rescue_name: '',
                    parent_name: '',
                    gender: '',
                    found_date: '',
                    marital_status: '',
                    language: '',
                    district: '',
                    police_station: '',
                    addition_info: '',
                    name_rescue: '',
                    phone_no: ''
                })
            } else {
                alert('Error Updating form.');
            }

        } catch (error) {
            console.error('There was an error Updating the form:', error);
            alert('There was an error Updating the form.');
        }
    };

    const handleInputChange1 = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const userType = Cookies.get('usertype');

    const navigate = useNavigate();

    const gotoSCRBForm2A = () => {
        navigate("/scrb_form2aALL");
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchFilteredRescueDetails.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(searchFilteredRescueDetails.length / itemsPerPage);
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleDelete = async (admission_no) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this record?");
            if (!confirmDelete) return; // if user clicks 'Cancel', do nothing
            const res = await apiRoute.delete(`/remove/SCRBForm2toRecycleBin/${admission_no}`);
            console.log(res.data);
            alert("Moved to recycle bin");
            fetchSCRBForm2Report();
            // refresh table
        } catch (err) {
            console.error(err);
            alert("Error deleting");
        }
    };

    return (
        <>
            <Container fluid>
                <Row className='d-flex align-items-center justify-content-between'>
                    <Col md={2} className='text-start'>
                        <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item></Breadcrumb.Item>
                            <Breadcrumb.Item><Link to="/dashboard">Home</Link></Breadcrumb.Item>
                            <Breadcrumb.Item active>Admission</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">SCRB Form</h6>
                    </Col>
                    <Col md={8} className="text-center">
                        <h4 className="section_title_1">FORM - 2 FOUND PERSON PERSONAL DETAILS</h4>
                        <h5 className="sub_title">படிவம் - 2 மீட்கப்பட்டவர்களின் விவரங்கள்</h5>
                    </Col>
                    <Col md={2}>
                        <div className="d-flex align-items-center px-3">
                            <Form className="navbar-search">
                                <Form.Group id="topbarSearch">
                                    <InputGroup className="input-group-merge search-bar">
                                        <Form.Control
                                            type="text"
                                            placeholder="Search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </div>
                    </Col>

                </Row>
            </Container>
            <Container>
                <Row className='d-flex align-items-center justify-content-between mb-3'>
                    <Col md={3} className='d-flex align-items-start justify-content-start'>
                        <Button type='button' className='btn btn-success' onClick={() => window.history.back()}>Back</Button>
                    </Col>
                    <Col md={3} className='d-flex align-items-end justify-content-end'>
                        <Button type='button' className='btn btn-success' onClick={() => gotoSCRBForm2A()}>Next</Button>
                    </Col>
                </Row>

            </Container>
            <Container>
                <>
                    <Row>
                        <Col md={12}>
                            <Table responsive="sm">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Admission No.</th>
                                        <th>Rescue Name</th>
                                        <td>New Photo</td>
                                        <td>Old Photo</td>
                                        <th>File No.</th>
                                        <th>Name of the NGO</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{indexOfFirstItem + index + 1}</td>
                                                <td>{item.admission_no || "null"}</td>
                                                <td>{item.rescue_name || "null"}</td>
                                                <td className='d-flex align-items-center justify-content-center'>
                                                    {(() => {
                                                        let imagePath = item.old_photo;

                                                        try {
                                                            const parsed = JSON.parse(item.old_photo);
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
                                                                    alt="Old Photo"
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
                                                    {(() => {
                                                        let imagePath = item.new_photo;

                                                        try {
                                                            const parsed = JSON.parse(item.new_photo);
                                                            if (Array.isArray(parsed) && parsed.length > 0) {
                                                                imagePath = parsed[0];
                                                            }
                                                        } catch (e) {
                                                            // use directly
                                                        }

                                                        const fullUrl = `https://www.pahrultours.com/app2/${imagePath}`;
                                                        const filename = imagePath?.split('/').pop(); // Extract filename from path

                                                        return imagePath ? (
                                                            <div className="image-container">
                                                                <img
                                                                    src={fullUrl}
                                                                    alt="New Photo"
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
                                                <td>{item.koppu_en || "null"}</td>
                                                <td>{item.name_ngo || "null"}</td>

                                                <td>
                                                    <Button
                                                        className="btn btn-success icon_details"
                                                        onClick={() => handleEditform(item.id)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Button>
                                                    {userType === "2" && (
                                                        <Button
                                                            className="btn btn-danger icon_details"
                                                            onClick={() => handleDelete(item.admission_no)}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10" className="text-center text-danger">
                                                No data found
                                            </td>
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
                </>

            </Container>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit SCRB Form 2</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>
                                    Name of the NGO :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="name_ngo"
                                        value={"MANASU (Mental Health Charity Home)"}
                                        onChange={handleInputChange1}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className="text-start">
                                    File No.:
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="koppu_en"
                                        value={formData.koppu_en}
                                        onChange={handleInputChange1}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            {Array.isArray(files.old_photo) &&
                                files.old_photo.map((imgUrl, index) => {
                                    const filename = `old_photo_${index}.jpg`;

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
                                                alt={`old_photo - ${index}`}
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
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>
                                    Found Person Photo :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control type="file"
                                        name="old_photo"
                                        onChange={handleFileChange}
                                        multiple
                                        required />
                                </Col>
                            </Form.Group>
                            {Array.isArray(files.new_photo) &&
                                files.new_photo.map((imgUrl, index) => {
                                    const filename = `new_photo_${index}.jpg`;

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
                                                alt={`new_photo - ${index}`}
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
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>
                                    Recent Photo :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control type="file"
                                        name="new_photo"
                                        onChange={handleFileChange}
                                        multiple
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>
                                    Name of the Person :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control type="text"
                                        name="rescue_name"
                                        value={formData.rescue_name}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>
                                    Name of the Spouse/Parent
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control type="text"
                                        name="parent_name"
                                        value={formData.parent_name}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3 mt-3">
                                <Form.Label column sm="6" className='text-start'>
                                    Gender :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="gender"
                                        value={"Male"}
                                        onChange={handleInputChange1}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>Found Date:</Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="found_date"
                                        value={formatDateOnly(formData.found_date || '')}
                                        onChange={handleInputChange1}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>Marital Status:</Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="rescue_status"
                                        value={formData.marital_status}
                                        onChange={handleInputChange1}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>Language Known:</Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="language"
                                        value={formData.language}
                                        onChange={handleInputChange1}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>District:</Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleInputChange1}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>Police Station:</Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="police_station"
                                        value={formData.police_station}
                                        onChange={handleInputChange1}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>Any other addtional information:</Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="addition_info"
                                        value={formData.addition_info}
                                        onChange={handleInputChange1}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            {Array.isArray(files.signature) &&
                                files.signature.map((imgUrl, index) => {
                                    const filename = `signature_${index}.jpg`;

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
                                                alt={`signature - ${index}`}
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
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>
                                    Signature :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control type="file"
                                        name="signature"
                                        onChange={handleFileChange}
                                        multiple
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>Name:</Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="rescue_name"
                                        value={formData.rescue_name}
                                        onChange={handleInputChange1}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>Phone No.:</Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="phone_no"
                                        value={formData.phone_no}
                                        onChange={handleInputChange1}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            {Array.isArray(files.seal) &&
                                files.seal.map((imgUrl, index) => {
                                    const filename = `seal_${index}.jpg`;

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
                                                alt={`seal - ${index}`}
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
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>
                                    Seal :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control type="file"
                                        name="seal"
                                        onChange={handleFileChange}
                                        multiple
                                        required />
                                </Col>
                            </Form.Group>
                            <Col md={12} className='d-flex align-items-center justify-content-between'>
                                <div className="mt-3 d-flex align-tems-cente justify-content-between">
                                    <Button variant="success" className="m-1" type="button" onClick={handleUpdate}>Update</Button>
                                    <Button variant="secondary" className="m-1" type="button" onClick={handleClose}>
                                        Close
                                    </Button>
                                </div>

                            </Col>
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default SCRB_All_Details
