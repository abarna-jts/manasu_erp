import React from "react";
import { Table, Col } from "react-bootstrap";
import { Breadcrumb, Form, InputGroup } from '@themesberg/react-bootstrap';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Row } from 'react-bootstrap';
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Cookies from 'js-cookie';
import manasu_logo from '../Admission/Manasu-Logo.png';

function Rescue_details() {
    const [rescue_details, setRescueDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItems, setSelectedItems] = useState({});
    const [selectedStatus, setSelectedStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    const userType = Cookies.get('usertype');

    // const [show, setShowEditModal] = useState(false); 
    const [formData, setFormData] = useState({
        referred_by: '',
        from_place: '',
        date_time: '',
        police_memo: '',
        police_station: '',
        information_public: '',
        admission_date: '',
        admission_no: '',
        rescue_name: '',
        age: '',
        rescue_status: '',
        religion: '',
        language1: '',
        language2: '',
        language3: '',
        education: '',
        govIdType: '',
        govIdNumber: '',
        father: '',
        mother: '',
        other_relation: '',
        place: '',
        phone_no: '',
        phone_no_two: '',
        clothing: '',
        dress_code: '',
        complexion: '',
        indentification_mark: '',
        tattoo: '',
        wound_infection: '',
        height: '',
        weight: '',
        things_carried: '',
        remark: '',
        mental_status: '',
        behaviour: '',
        community_ability: '',
        self_careCapacity: '',
        diagnosis: ''
        // symptoms: '',
        // rescued_by: '',
        // information: '',
        // rescue_relationship: '',
        // articles_carried: '',
        // f_member_name: '',
        // f_member_phone: '',
        // f_member_address: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // const handleFileChange = (e) => {
    //     setFiles({ ...files, [e.target.name]: e.target.files[0] });
    // };

    const [editData, setEditData] = useState({
        id: "",
        admission_date: "",
        admission_no: "",
        referred_by: "",
        from_place: "",
        date_time: "",
        police_memo: "",
        information_public: "",
    });

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date)) return ""; // Handle invalid dates
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date)) return ""; // Invalid date fallback

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };

    //formate Date time for edit table
    function formatDateForInput(dateString, type = 'date') {
        if (!dateString) return '';

        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2); // month is 0-indexed
        const day = (`0${date.getDate()}`).slice(-2);
        const hours = (`0${date.getHours()}`).slice(-2);
        const minutes = (`0${date.getMinutes()}`).slice(-2);

        if (type === 'date') {
            return `${year}-${month}-${day}`;
        } else if (type === 'datetime-local') {
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } else {
            return '';
        }
    }

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

    const [files, setFiles] = useState({
        rescue_image: null,
        attach_policeMemo: null,
        govIdFile: null,
    });


    const fetchFormData = async (id) => {
        try {
            const response = await apiRoute.get(`/admision/get_rescue_details/${id}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                referred_by: data.referred_by || '',
                from_place: data.from_place || '',
                date_time: data.date_time || '',
                police_memo: data.police_memo || '',
                police_station: data.police_station || '',
                information_public: data.information_public || '',
                admission_date: data.admission_date || '',
                admission_no: data.admission_no || '',
                rescue_name: data.rescue_name || '',
                age: data.age || '',
                rescue_status: data.rescue_status || '',
                religion: data.religion || '',
                language1: data.language1 || '',
                language2: data.language2 || '',
                language3: data.language3 || '',
                education: data.education || '',
                govIdType: data.govIdType || '',
                govIdNumber: data.govIdNumber || '',
                father: data.father || '',
                mother: data.mother || '',
                other_relation: data.other_relation || '',
                place: data.place || '',
                phone_no: data.phone_no || '',
                phone_no_two: data.phone_no_two || '',
                clothing: data.clothing || '',
                dress_code: data.dress_code || '',
                complexion: data.complexion || '',
                indentification_mark: data.indentification_mark || '',
                wound_infection: data.wound_infection || '',
                height: data.height || '',
                weight: data.weight || '',
                tattoo: data.tattoo || '',
                things_carried: data.things_carried || '',
                remark: data.remark || '',
                mental_status: data.mental_status || '',
                behaviour: data.behaviour || '',
                community_ability: data.community_ability || '',
                self_careCapacity: data.self_careCapacity || '',
                diagnosis: data.diagnosis || ''
                // symptoms: data.symptoms || '',
                // rescued_by: data.rescued_by || '',
                // information: data.information || '',
                // rescue_relationship: data.rescue_relationship || '',
                // articles_carried: data.articles_carried || '',
                // f_member_name: data.f_member_name || '',
                // f_member_phone: data.f_member_phone || '',
                // f_member_address: data.f_member_address || '',

            }));

            let policeMemoAttach = [];
            if (data.attach_policeMemo) {
                try {
                    const parsed = JSON.parse(data.attach_policeMemo);
                    if (Array.isArray(parsed)) {
                        policeMemoAttach = parsed.map((p) => `http://localhost:5002/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse attach_policeMemo:', err);
                    // Fallback: comma-separated string
                    policeMemoAttach = data.attach_policeMemo
                        .split(',')
                        .map((p) => `http://localhost:5002/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            let RescueImage = [];
            if (data.rescue_image) {
                try {
                    const parsed = JSON.parse(data.rescue_image);
                    if (Array.isArray(parsed)) {
                        RescueImage = parsed.map((p) => `http://localhost:5002/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse attach_policeMemo:', err);
                    // Fallback: comma-separated string
                    RescueImage = data.rescue_image
                        .split(',')
                        .map((p) => `http://localhost:5002/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            let govtFilePath = [];
            if (data.govIdFile) {
                try {
                    const parsed = JSON.parse(data.govIdFile);
                    if (Array.isArray(parsed)) {
                        govtFilePath = parsed.map((p) => `http://localhost:5002/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse govIdFile:', err);
                    // Fallback: comma-separated string
                    govtFilePath = data.govIdFile
                        .split(',')
                        .map((p) => `http://localhost:5002/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            // Base path for images
            const basePath = "http://localhost:5002/uploads/Rescue_Images";
            // const RescueImage = data.rescue_image ? `https://www.pahrultours.com/app2/${data.rescue_image}` : null;
            // const govtFilePath = data.govIdFile ? `https://www.pahrultours.com/app2/${data.govIdFile}` : null;
            // const FamilyAadharCard = data.f_aadhar_card ? `https://www.pahrultours.com/app2/${data.f_aadhar_card}` : null;
            // const FamilyRationCard = data.f_ration_card ? `https://www.pahrultours.com/app2/${data.f_ration_card}` : null;
            // const RescueAadharCard = data.res_aadhar_card ? `https://www.pahrultours.com/app2/${data.res_aadhar_card}` : null;
            // const policeMemoAttach = data.attach_policeMemo ? `https://www.pahrultours.com/app2/${data.attach_policeMemo}` : null;

            console.log("Rescue Image Path", RescueImage);
            console.log("Police Memo Attachment", policeMemoAttach);
            console.log("Govertnment Id File", govtFilePath);
            // Set files state
            setFiles((files) => ({
                ...files,
                rescue_image: RescueImage,
                attach_policeMemo: policeMemoAttach,
                govIdFile: govtFilePath
            }));

            setTimeout(() => {
                generatePDF();
            }, 500);

        } catch (error) {
            console.error("Error fetching form data:", error);
        }
    }

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const getRescueDetails = async () => {
        try {
            const response = await apiRoute.get('/admision/get_first_form');
            console.log("API response:", response.data);
            setRescueDetails(response.data.data);
        } catch (error) {
            console.error('Error fetching Student:', error);
        }
    };

    useEffect(() => {
        getRescueDetails();

    }, []);

    // search function 

    const searchFilteredRescueDetails = rescue_details
        .filter((item) => {
            // First filter by status if one is selected
            if (selectedStatus && item.resident_status !== selectedStatus) {
                return false;
            }
            return true;
        })
        .filter((item) => {
            // Then apply the search filter
            const searchTerm = searchQuery.toLowerCase();
            return (
                String(item.admission_no).toLowerCase().includes(searchTerm) ||
                String(item.rescue_name).toLowerCase().includes(searchTerm) ||
                String(item.referred_by).toLowerCase().includes(searchTerm) ||
                String(item.from_place).toLowerCase().includes(searchTerm) ||
                String(item.police_memo).toLowerCase().includes(searchTerm) ||
                String(item.information_public).toLowerCase().includes(searchTerm)
            );
        });

    //modal handling function 

    // const handleClose = () => setShowEditModal(false);

    // handleShow functionality
    const navigate = useNavigate();
    const handleEditform = (id) => {
        navigate(`/edit_rescue_details/${id}`);
    };

    const handleCheckboxChange = (e, id) => {
        const checked = e.target.checked;
        setSelectedItems((prev) => {
            const updated = { ...prev };
            if (checked) {
                updated[id] = "";
            } else {
                delete updated[id];
            }
            return updated;
        });
    };

    const handleAssignStatus = async (id, status) => {
        setSelectedItems((prev) => ({
            ...prev,
            [id]: status,
        }));

        try {
            await apiRoute.put(`/admision/updateStatus/${id}`, {
                status,
            });
            alert("Status updated successfully");
            window.location.reload();
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchFilteredRescueDetails.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(searchFilteredRescueDetails.length / itemsPerPage);


    return (
        <>

            <div className="d-flex justify-content-between align-items-center flex-wrap flex-md-nowrap text-start py-2">
                <div className="d-block mb-4 mb-xl-0 px-4 ">
                    <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item></Breadcrumb.Item>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item active>Rescue Details</Breadcrumb.Item>
                    </Breadcrumb>
                    <h6 className="breadcrumb_title">Rescue Details</h6>

                </div>
                <Col md={4} className="text-start">
                    <h3 className="section_title px-4">Resident Rescue Details</h3>
                </Col>

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
            </div>

            <Form.Select
                aria-label="Filter by Status"
                value={selectedStatus}
                name="status"
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ width: "250px", marginBottom: "20px", marginLeft: "15px" }}
            >
                <option value="">-- Choose Status --</option>
                <option value="Resident">Resident</option>
                <option value="Reunion">Discharge</option>
            </Form.Select>

            <div className="first_table mt-2 mb-4">

                <Table responsive="sm" className="table-bordered">

                    <thead>
                        <tr>
                            {/* <th><Form.Check aria-label="option 1" /></th> */}
                            <th>S.No</th>
                            <th>Admission Number</th>
                            <th>Rescue Photo</th>
                            <th>Rescued / Referred by</th>
                            <th>Rescue Name</th>
                            <th>Taken from</th>
                            <th>Date & Time</th>
                            <th>Resident Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                                <tr key={item.id}>
                                    {/* <td>
                                        <Form.Check
                                            type="checkbox"
                                            checked={selectedItems[item.id] !== undefined}
                                            onChange={(e) => handleCheckboxChange(e, item.id)}
                                        />
                                    </td> */}
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td>{item.admission_no}</td>
                                    <td className="d-flex align-items-center justify-content-center">
                                        {(() => {
                                            let imagePath = item.rescue_image;

                                            try {
                                                const parsed = JSON.parse(item.rescue_image);
                                                if (Array.isArray(parsed) && parsed.length > 0) {
                                                    imagePath = parsed[0];
                                                }
                                            } catch (e) {
                                                // use directly
                                            }

                                            const fullUrl = `http://localhost:5002/${imagePath}`;
                                            const filename = imagePath?.split('/').pop(); // Extract filename from path

                                            return imagePath ? (
                                                <div className="image-container">
                                                    <img
                                                        src={fullUrl}
                                                        alt="Rescue Images"
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





                                    <td>{item.referred_by}</td>
                                    <td>{item.rescue_name}</td>
                                    <td>{item.from_place}</td>
                                    <td>{formatDateTime(item.date_time)}</td>
                                    {userType === "2" && (
                                        <td>{item.resident_status}</td>
                                    )}
                                    {userType === "1" && (
                                        <td>
                                            <Form.Select
                                                value={selectedItems[item.id] || item.resident_status || ""}
                                                onChange={(e) => handleAssignStatus(item.id, e.target.value)}
                                            >
                                                <option value="">Select</option>
                                                <option value="Resident">Resident</option>
                                                <option value="Reunion">Discharge</option>
                                            </Form.Select>
                                        </td>
                                    )}
                                    <td>
                                        <button className="btn btn-success icon_details"
                                            onClick={() => {
                                                fetchFormData(item.id);
                                            }}
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button className="btn btn-secondary icon_details"
                                            onClick={() => {
                                                handleEditform(item.id);
                                            }}
                                        ><i className="fas fa-edit"></i> </button>
                                        {/* {userType === "2" && (
                                            <button className="btn btn-danger icon_details"
                                                onClick={() => handleDelete(item.id)}
                                            ><i className="fas fa-trash"></i></button>
                                        )} */}
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


                <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                    <Row>
                        <Col md={2}>
                            <img src={manasu_logo} className="pdf_logo" alt="" />
                        </Col>
                        <Col md={10}>
                            <h4 className="pdf_heading text-center">RESIDENT INTAKE REPORT</h4>
                        </Col>
                    </Row>

                    <Form className="d-flex align-items-center justify-content-center text-start">
                        <Row>
                            <Col md={8}>
                                <h5 className="pdfsub_heading">Rescue Details:</h5>
                                <Form.Group as={Row} className="mb-1" controlId="formEmailID">
                                    <Form.Label column sm="5">
                                        Rescued / Referred by :
                                    </Form.Label>
                                    <Col sm="7">
                                        <Form.Control
                                            name="referred_by"
                                            value={formData.referred_by}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formTakenFrom">
                                    <Form.Label column sm="5">
                                        Taken from(Rescue Place) :
                                    </Form.Label>
                                    <Col sm="7">
                                        <Form.Control
                                            name="from_place"
                                            value={formData.from_place}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formDateTime">
                                    <Form.Label column sm="5">
                                        Date & Time :
                                    </Form.Label>
                                    <Col sm="7">
                                        <Form.Control
                                            name="date_time"
                                            value={formData.date_time}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPoliceMemo">
                                    <Form.Label column sm="5">
                                        Police Memo :
                                    </Form.Label>
                                    <Col sm="7">
                                        <Form.Control
                                            name="police_memo"
                                            value={formData.police_memo}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPoliceMemo">
                                    <Form.Label column sm="5">
                                        Attach Police Memo :
                                    </Form.Label>
                                    <Col sm="7">
                                        {Array.isArray(files.attach_policeMemo) &&
                                            files.attach_policeMemo.map((imgUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imgUrl}
                                                    alt={`attach_policeMemo - ${index}`}
                                                    style={{
                                                        width: "100px",
                                                        height: "100px",
                                                        objectFit: "cover",
                                                        margin: "10px",
                                                        border: "1px solid #ccc",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = "/fallback-image.png";
                                                    }}
                                                />
                                            ))}
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPoliceStation">
                                    <Form.Label column sm="5">
                                        Police Station :
                                    </Form.Label>
                                    <Col sm="7">
                                        <Form.Control
                                            name="police_station"
                                            value={formData.police_station}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formInformation">
                                    <Form.Label column sm="5">
                                        Information from Public / Spot :
                                    </Form.Label>
                                    <Col sm="7">
                                        <Form.Control
                                            name="information_public"
                                            value={formData.information_public}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group as={Row} className="mb-1" controlId="formRescuePhoto">
                                    <Form.Label column sm="4">
                                        Profile:
                                    </Form.Label>
                                    <Col sm="8">
                                        {Array.isArray(files.rescue_image) &&
                                            files.rescue_image.map((imgUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imgUrl}
                                                    alt={`rescue_image - ${index}`}
                                                    style={{
                                                        width: "100px",
                                                        height: "100px",
                                                        objectFit: "cover",
                                                        margin: "10px",
                                                        border: "1px solid #ccc",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = "/fallback-image.png";
                                                    }}
                                                />
                                            ))}
                                    </Col>
                                </Form.Group>
                                <Form.Group className="mb-1" controlId="formDate">
                                    <Form.Label column sm="12">
                                        Date :
                                    </Form.Label>
                                    <Col sm="12">
                                        <Form.Control
                                            name="date"
                                            value={formData.admission_date}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group className="mb-1" controlId="formAdmissionNo">
                                    <Form.Label column sm="12">
                                        Admission Number :
                                    </Form.Label>
                                    <Col sm="12">
                                        <Form.Control
                                            name="admission_no"
                                            value={formData.admission_no}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                            </Col>

                            <Col md={11}>
                                <h5 className="pdfsub_heading">Resident's Details</h5>
                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="4">
                                        Name at the time of Rescue :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="rescue_name"
                                            value={formData.rescue_name}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formAge">
                                    <Form.Label column sm="4">
                                        Approximate age :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="age"
                                            value={formData.age}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formStatus">
                                    <Form.Label column sm="4">
                                        Status :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="rescue_status"
                                            value={formData.rescue_status}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formReligion">
                                    <Form.Label column sm="4">
                                        Religion :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="religion"
                                            value={formData.religion}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formLanguage">
                                    <Form.Label column sm="4">
                                        Language :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Row>
                                            <Col md={4}>
                                                <Form.Control
                                                    type="text"
                                                    name="language1"
                                                    value={formData.language1}
                                                    onChange={handleInputChange}
                                                    className="mb-2"
                                                    required
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <Form.Control
                                                    type="text"
                                                    name="language2"
                                                    value={formData.language2}
                                                    onChange={handleInputChange}
                                                    className="mb-2"
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <Form.Control
                                                    type="text"
                                                    name="language3"
                                                    value={formData.language3}
                                                    onChange={handleInputChange}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formEducation">
                                    <Form.Label column sm="4">
                                        Education :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="education"
                                            value={formData.education}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formEducation">
                                    <Form.Label column sm="4">
                                        Government ID Type:
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="govIdType"
                                            value={formData.govIdType}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                {formData.govIdType !== 'NA' && formData.govIdType !== '' && (
                                    <>
                                        <Form.Control
                                            type="text"
                                            placeholder={`Enter ${formData.govIdType} number`}
                                            value={formData.govIdNumber}
                                            onChange={(e) =>
                                                setFormData({ ...formData, govIdNumber: e.target.value })
                                            }
                                        />


                                        <Form.Group className="mb-3 text-start d-flex">
                                            <Form.Label column sm={4}>{formData.govIdType} File:</Form.Label>
                                            <Col sm={7}>
                                                {Array.isArray(files.govIdFile) &&
                                                    files.govIdFile.map((imgUrl, index) => (
                                                        <img
                                                            key={index}
                                                            src={imgUrl}
                                                            alt={`govIdFile - ${index}`}
                                                            style={{
                                                                width: "100px",
                                                                height: "100px",
                                                                objectFit: "cover",
                                                                margin: "10px",
                                                                border: "1px solid #ccc",
                                                            }}
                                                            onError={(e) => {
                                                                e.target.src = "/fallback-image.png";
                                                            }}
                                                        />
                                                    ))}
                                            </Col>
                                        </Form.Group>
                                    </>
                                )}

                            </Col>
                            <Col md={11}>
                                <h5 className="pdfsub_heading mt-5">Family Details:</h5>
                                <Form.Group as={Row} className="mb-1" controlId="formFather">
                                    <Form.Label column sm="4">
                                        Father :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="father"
                                            value={formData.father}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3" controlId="formMother">
                                    <Form.Label column sm="4">
                                        Mother :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="mother"
                                            value={formData.mother}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1 mt-5" controlId="formanyother">
                                    <Form.Label column sm="4">
                                        Any Other Relationship:
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="other_relation"
                                            value={formData.other_relation}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formPlace">
                                    <Form.Label column sm="4">
                                        Address :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="place"
                                            value={formData.place}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1 mt-4" controlId="formContactNo">
                                    <Form.Label column sm="4">
                                        Contact Number :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Row>
                                            <Col md={4}>
                                                <Form.Control
                                                    type="text"
                                                    name="phone_no"
                                                    value={formData.phone_no}
                                                    onChange={handleInputChange}
                                                />
                                            </Col>
                                            <Form.Control.Feedback type="invalid">
                                                Please enter "Unknown" or "NA" if not available.
                                            </Form.Control.Feedback>
                                            <Col md={4}>
                                                <Form.Control
                                                    type="text"
                                                    name="phone_no_two"
                                                    value={formData.phone_no_two}
                                                    onChange={handleInputChange}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>

                                </Form.Group>
                            </Col>
                            <Col md={11}>
                                <h5 className="pdfsub_heading mt-5">Physical Appearance:</h5>
                                <Form.Group as={Row} className="mb-1" controlId="formClothing">
                                    <Form.Label column sm="4">
                                        Clothing :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="clothing"
                                            value={formData.clothing}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formDressColor">
                                    <Form.Label column sm="4">
                                        Dress Color :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="dress_code"
                                            value={formData.dress_code}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formComplexion">
                                    <Form.Label column sm="4">
                                        Complexion :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="complexion"
                                            value={formData.complexion}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formIdentificationMark">
                                    <Form.Label column sm="4">
                                        Indentification Mark :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="indentification_mark"
                                            value={formData.indentification_mark}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formTatoo">
                                    <Form.Label column sm="4">
                                        Tattoo :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="tattoo"
                                            value={formData.tattoo}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formWound">
                                    <Form.Label column sm="4">
                                        Any Wound/ infection :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="wound_infection"
                                            value={formData.wound_infection}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Row className="mt-4">

                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-1" controlId="formHeight">
                                            <Form.Label column sm="8">
                                                Height :
                                            </Form.Label>
                                            <Col sm="4">
                                                <Form.Control
                                                    name="height"
                                                    value={formData.height}
                                                    onChange={handleInputChange} />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-1" controlId="formWeight">
                                            <Form.Label column sm="4">
                                                Weight :
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="weight"
                                                    value={formData.weight}
                                                    onChange={handleInputChange} />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group as={Row} className="mb-1" controlId="formThingsCarried">
                                    <Form.Label column sm="4">
                                        Possessions & Items Carried at the Time of Rescue :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="things_carried"
                                            value={formData.things_carried}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formRemark">
                                    <Form.Label column sm="4">
                                        Notes :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            as="textarea"
                                            name="remark"
                                            value={formData.remark || "null"}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>

                            </Col>
                            <Col md={11}>
                                <h5 className="pdfsub_heading">Initial Psychological Assessment</h5>
                                <Form.Group as={Row} className="mb-1" controlId="formSymptoms">
                                    <Form.Label column sm="4">
                                        Mental status :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            as="textarea"
                                            name="mental_status"
                                            rows={1}
                                            value={formData.mental_status}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formIntimated">
                                    <Form.Label column sm="4">
                                        Cognitive Behavior :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            as="textarea"
                                            name="behaviour"
                                            rows={1}
                                            value={formData.behaviour}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formInformation">
                                    <Form.Label column sm="4">
                                        Communication Ability :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            as="textarea"
                                            rows={1}
                                            name="community_ability"
                                            value={formData.community_ability}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formInformation">
                                    <Form.Label column sm="4">
                                        Self-Care Capacity :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            as="textarea"
                                            rows={1}
                                            name="self_careCapacity"
                                            value={formData.self_careCapacity}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formInformation">
                                    <Form.Label column sm="4">
                                        Diagnosis :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            as="textarea"
                                            rows={1}
                                            name="diagnosis"
                                            value={formData.diagnosis}
                                            onChange={handleInputChange} />
                                    </Col>
                                </Form.Group>

                            </Col>

                            <Row className="d-flex align-items-center justify-content-center">
                                <Col md={6} className="mt-5 mb-5">
                                    <h4 className="text-start sign_class">Signature / Thumbprint of Resident's</h4>
                                </Col>
                                <Col md={6} className="mt-5 mb-5">
                                    <h4 className="text-end sign_class">Manasu Seal</h4>
                                </Col>
                            </Row>
                        </Row>

                    </Form>

                </div>

                {/* <Modal show={show} onHide={handleClose} style={{width:"100%"}}>
                        <Modal.Header closeButton>
                        <Modal.Title>Edit Rescue Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <Form>
                            <Row className="d-flex justify-content-between">
                                <Col md={12}>
                                    <Form.Group as={Row} className="mb-3 text-start" controlId="formDate">
                                        <Form.Label column sm={5}>Date :</Form.Label>
                                        <Col sm={7}>
                                        <Form.Control 
                                            type="date" 
                                            name="admission_date"
                                            value={formatDateForInput(editData.admission_date, 'date')}
                                            onChange={(e) =>
                                            setEditData({ ...editData, admission_date: e.target.value })
                                            }
                                        />
                                        </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-3 text-start" controlId="formAdmissionType">
                                        <Form.Label column sm={5}>Admission Number :</Form.Label>
                                        <Col sm={7}>
                                            <Form.Control 
                                            type="number"
                                            name="admission_no" 
                                            value={editData.admission_no}
                                            onChange={(e) =>
                                            setEditData({ ...editData, admission_no: e.target.value })
                                            }/>
                                        </Col>
                                        </Form.Group>

                                    <Form.Group controlId="formFile" className="mb-3">
                                        <Form.Label>Rescue Image</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="rescue_image"
                                            accept="image/*"
                                            onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                // For file input, update it in the state
                                                setEditData({ ...editData, rescue_image: file });
                                            }
                                            }}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formReferredby"> 
                                        <Form.Label>Rescued / Referred by: </Form.Label>
                                        <Form.Control type="text"
                                        name="referred_by"
                                        value={editData.referred_by}
                                        onChange={(e) =>
                                          setEditData({ ...editData, referred_by: e.target.value })
                                        }
                                        required/>
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formtakePlace">
                                        <Form.Label>Taken from : </Form.Label>
                                        <Form.Control 
                                        type="text"
                                        name="from_place"
                                        value={editData.from_place}
                                        onChange={(e) =>
                                        setEditData({ ...editData, from_place: e.target.value })
                                        }
                                        required/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formdatetime">
                                        <Form.Label>Date & Time : </Form.Label>
                                        <Form.Control 
                                        type="datetime-local"
                                        name="date_time"
                                        value={formatDateForInput(editData.date_time, 'datetime-local')}
                                        onChange={(e) =>
                                        setEditData({ ...editData, date_time: e.target.value })
                                        }
                                        required/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formPoliceMemo">
                                        <Form.Label>Police Memo : </Form.Label>
                                        <Form.Control 
                                        type="text" 
                                        name="police_memo"
                                        value={editData.police_memo}
                                        onChange={(e) =>
                                        setEditData({ ...editData, police_memo: e.target.value })
                                        }
                                        required/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formPublicInfo">
                                        <Form.Label>Information from Public / Spot : </Form.Label>
                                        <Form.Control
                                        type="text" 
                                        name="information_public"
                                        value={editData.information_public}
                                        onChange={(e) =>
                                          setEditData({
                                            ...editData,
                                            information_public: e.target.value,
                                          })
                                        }
                                        required/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                           
                        </Form>

                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleUpdate}>
                            Save Changes
                        </Button>
                        </Modal.Footer>
                    </Modal> */}
            </div>





        </>
    )
}

export default Rescue_details;