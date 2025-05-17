import React from "react";
import { Table,Col } from "react-bootstrap";
import { Breadcrumb , Form, InputGroup} from '@themesberg/react-bootstrap';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Row } from 'react-bootstrap';
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Cookies from 'js-cookie';

function Rescue_details(){
    const [rescue_details, setRescueDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

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
        language: '',
        education: '',
        father: '',
        mother: '',
        other_relation: '',
        place: '',
        phone_no: '',
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
        symptoms: '',
        rescued_by: '',
        information: '',
        rescue_relationship:'',
        articles_carried: '',
        f_member_name: '',
        f_member_phone: '',
        f_member_address: ''
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

    const getRescueDetails = async () => {
        try {
            const response = await axios.get('http://localhost:5000/admision/get_first_form');
            console.log("API response:", response.data); 
            setRescueDetails(response.data.data);
        } catch (error) {
            console.error('Error fetching Student:', error);
        }
    };

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

    useEffect(() => {
        getRescueDetails();
    }, []);

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
      
      
      


    // search function 

    const filteredRescueDetails = rescue_details.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
          String(item.admission_no).toLowerCase().includes(searchTerm) ||
          String(item.rescue_name).toLowerCase().includes(searchTerm)||
          String(item.referred_by).toLowerCase().includes(searchTerm) ||
          String(item.from_place).toLowerCase().includes(searchTerm) ||
          String(item.police_memo).toLowerCase().includes(searchTerm) ||
          String(item.information_public).toLowerCase().includes(searchTerm)
        );
      });


    //delete function 

    const handleDelete = async (id) => {
        alert("Are you sure want to delete");
        try {
            const response = await axios.delete(`http://localhost:5000/admision/delete_first_form/${id}`);
            console.log(response);
            alert("Family Request Letter Form Deleted successfully");
            // Refresh data after deletion
            getRescueDetails(); // if this function fetches updated student list
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    //modal handling function 

    // const handleClose = () => setShowEditModal(false);

    // handleShow functionality
    const navigate = useNavigate();
    const handleEditform = (id) => {
        navigate(`/edit_rescue_details/${id}`);
      };

    // //update function
    // const handleUpdate = async () => {
    //     try {
    //       const formData = new FormData();
    //       formData.append("admission_date", editData.admission_date);
    //       formData.append("admission_no", editData.admission_no);
    //       formData.append("referred_by", editData.referred_by);
    //       formData.append("from_place", editData.from_place);
    //       formData.append("date_time", editData.date_time);
    //       formData.append("police_memo", editData.police_memo);
    //       formData.append("information_public", editData.information_public);
      
    //       if (editData.rescue_image instanceof File) {
    //         formData.append("rescue_image", editData.rescue_image); // append only if it's a file
    //       }
      
    //       await axios.put(
    //         `http://localhost:5000/admision/update_first_form/${editData.id}`,
    //         formData,
    //         {
    //           headers: {
    //             "Content-Type": "multipart/form-data",
    //           },
    //         }
    //       );
      
    //       alert("Updated successfully");
    //       getRescueDetails();
    //       setShowEditModal(false);
    //     } catch (error) {
    //       console.error("Error updating data", error);
    //     }
    //   };


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
            rescue_image:null,
        });
    
    
      const fetchFormData =async (id) =>{
        try {

            const response = await axios.get(`http://localhost:5000/admision/get_rescue_details/${id}`);
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
                language: data.language || '',
                education: data.education || '',
                father: data.father || '',
                mother: data.mother || '',
                other_relation: data.other_relation || '',
                place: data.place || '',
                phone_no: data.phone_no || '',
                clothing: data.clothing || '',
                dress_code: data.dress_code || '',
                complexion: data.complexion || '',
                indentification_mark: data.indentification_mark || '',
                wound_infection: data.wound_infection || '',
                height: data.height || '',
                weight: data.weight || '',
                things_carried: data.things_carried || '',
                remark: data.remark || '',
                symptoms: data.symptoms || '',
                rescued_by: data.rescued_by || '',
                information: data.information || '',
                rescue_relationship: data.rescue_relationship || '',
                articles_carried: data.articles_carried || '',
                f_member_name: data.f_member_name || '',
                f_member_phone: data.f_member_phone || '',
                f_member_address: data.f_member_address || '',
                
              }));

              // Base path for images
            const basePath = "http://localhost:5000/uploads/Rescue_Images";
            const RescueImage = data.rescue_image ? `http://localhost:5000/${data.rescue_image}` : null;
            const FamilyAadharCard = data.f_aadhar_card ? `http://localhost:5000/${data.f_aadhar_card}` : null;
            const FamilyRationCard = data.f_ration_card ? `http://localhost:5000/${data.f_ration_card}` : null;
            const RescueAadharCard = data.res_aadhar_card ? `http://localhost:5000/${data.res_aadhar_card}` : null;

            console.log("Rescue Image Path",RescueImage);
            console.log("Family Aadhar Card Path",FamilyAadharCard);
            console.log("Family Ration Card Path",FamilyRationCard);
            console.log("Rescue Aadhar Card Path",RescueAadharCard);
            // Set files state
            setFiles((files) => ({
                ...files,
                rescue_image: RescueImage,
                f_aadhar_card: FamilyAadharCard,
                f_ration_card: FamilyRationCard,
                res_aadhar_card: RescueAadharCard,
            }));  
            
            setTimeout(() => {
                generatePDF();
              }, 500);

        }catch (error) {
            console.error("Error fetching form data:", error);
          }
      }
      
    
      

    return(
        <>

        <div className="d-xl-flex justify-content-between align-items-center flex-wrap flex-md-nowrap text-start py-2">
            <div className="d-block mb-4 mb-xl-0 px-4 ">
            <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                <Breadcrumb.Item></Breadcrumb.Item>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Rescue Details</Breadcrumb.Item>
            </Breadcrumb>
            <h6 className="breadcrumb_title">Rescue Details</h6>
            
            </div>
            
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

            <div className="first_table mt-2 mb-4">
                    <Col md={12} className="text-start">
                            <h3 className="section_title px-4">Rescue Details</h3>
                    </Col>
                    <Table responsive="sm">

                        <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Admission Number</th>
                            <th>Rescue Photo</th>
                            <th>Rescued / Referred by</th>
                            <th>Rescue Name</th>
                            <th>Taken from</th>
                            <th>Date & Time</th>
                            <th>Police Memo</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                            {filteredRescueDetails.length > 0 ? (
                                filteredRescueDetails.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.admission_no}</td>
                                    <td>
                                    <img 
                                        src={`http://localhost:5000/${item.rescue_image}`}
                                        alt="Rescue Profile" 
                                        style={{ width: "70px", height: "70px", objectFit: "cover" }} 
                                    />
                                    </td>
                                    <td>{item.referred_by}</td>
                                    <td>{item.rescue_name}</td>
                                    <td>{item.from_place}</td>
                                    <td>{formatDateTime(item.date_time)}</td>
                                    <td>{item.police_memo}</td>
                                    <td>
                                    <button className="btn btn-success icon_details"
                                        onClick={() => {
                                            fetchFormData(item.id);
                                        }}
                                    >
                                        <i className="fas fa-eye"></i>
                                    </button>   
                                    <button className="btn btn-primary icon_details"
                                    onClick={() => {
                                        handleEditform(item.id);
                                    }}
                                    ><i className="fas fa-edit"></i> </button>
                                    {userType === "2" && (
                                    <button className="btn btn-danger icon_details"
                                    onClick={() => handleDelete(item.id)}
                                    ><i className="fas fa-trash"></i></button>
                                    )}
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


                    <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                                <h4 className="pdf_heading">FIRST INFORMATION SHEET</h4>
                        <Form className="d-flex align-items-center justify-content-center text-start">
                            <Row>
                                <Col md={8}>
                                    <h5 className="pdfsub_heading">Rescue Details:</h5>
                                    <Form.Group as={Row} className="mb-1" controlId="formEmailID">
                                        <Form.Label column sm="4">
                                        Rescued / Referred by :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="referred_by"
                                        value={formData.referred_by}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formTakenFrom">
                                        <Form.Label column sm="4">
                                        Taken From :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="from_place"
                                        value={formData.from_place}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formDateTime">
                                        <Form.Label column sm="4">
                                        Date & Time :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="date_time"
                                        value={formData.date_time}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formPoliceMemo">
                                        <Form.Label column sm="4">
                                        Police Memo :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="police_memo"
                                        value={formData.police_memo}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formPoliceStation">
                                        <Form.Label column sm="4">
                                        Police Station :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="police_station"
                                        value={formData.police_station}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formInformation">
                                        <Form.Label column sm="4">
                                        Information from Public / Spot :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="information_public"
                                        value={formData.information_public}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                </Col>
                                   
                                <Col md={4}>
                                <Form.Group as={Row} className="mb-1" controlId="formRescuePhoto">
                                    <Form.Label column sm="4">
                                        Profile:
                                    </Form.Label>
                                    <Col sm="8">
                                        {files.rescue_image ? (
                                        <img 
                                        src={files.rescue_image}
                                            alt="Rescue" 
                                            style={{ width: "100px", height: "auto", border: "1px solid #ccc" }}
                                        />
                                        ) : (
                                        <div>No Image Available</div>
                                        )}
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
                                            onChange={handleInputChange}/>
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
                                            onChange={handleInputChange}/>
                                            </Col>
                                        </Form.Group>
                                </Col>

                                <Col md={11}>
                                    <h5 className="pdfsub_heading">Inmate Details:</h5>
                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="4">
                                        Name :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="rescue_name"
                                        value={formData.rescue_name}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formAge">
                                        <Form.Label column sm="4">
                                        Age :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}/>
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
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                    <Row className="d-flex">
                                        <Col md={4}>
                                            <Form.Group as={Row} className="mb-1" controlId="formStatus">
                                                <Form.Label column sm="5">
                                                Status :
                                                </Form.Label>
                                                <Col sm="7">
                                                <Form.Control 
                                                name="rescue_status"
                                                value={formData.rescue_status}
                                                onChange={handleInputChange}/>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group as={Row} className="mb-1" controlId="formReligion">
                                                <Form.Label column sm="5">
                                                Religion :
                                                </Form.Label>
                                                <Col sm="7">
                                                <Form.Control 
                                                name="religion"
                                                value={formData.religion}
                                                onChange={handleInputChange}/>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group as={Row} className="mb-1" controlId="formLanguage">
                                                <Form.Label column sm="6">
                                                Language :
                                                </Form.Label>
                                                <Col sm="6">
                                                <Form.Control 
                                                name="language"
                                                value={formData.language}
                                                onChange={handleInputChange}/>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    
                                </Col>
                                <Col md={11}>
                                    <h5 className="pdfsub_heading">Family Details:</h5>
                                    <Form.Group as={Row} className="mb-1" controlId="formFather">
                                        <Form.Label column sm="4">
                                        Father :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="father"
                                        value={formData.father}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formMother">
                                        <Form.Label column sm="4">
                                        Mother :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="mother"
                                        value={formData.mother}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formanyother">
                                        <Form.Label column sm="4">
                                        Any other :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="other_relation"
                                        value={formData.other_relation}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formPlace">
                                        <Form.Label column sm="4">
                                        Place :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="place"
                                        value={formData.place}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formContactNo">
                                        <Form.Label column sm="4">
                                        Contact Number :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="phone_no"
                                        value={formData.phone_no}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                </Col>
                                <Col md={11}>
                                    <h5 className="pdfsub_heading">Physical Appearance:</h5>
                                            <Form.Group as={Row} className="mb-1" controlId="formClothing">
                                                <Form.Label column sm="4">
                                                Clothing :
                                                </Form.Label>
                                                <Col sm="8">
                                                <Form.Control 
                                                name="clothing"
                                                value={formData.clothing}
                                                onChange={handleInputChange}/>
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
                                                onChange={handleInputChange}/>
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
                                        onChange={handleInputChange}/>
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
                                        onChange={handleInputChange}/>
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
                                        onChange={handleInputChange}/>
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
                                                onChange={handleInputChange}/>
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
                                                onChange={handleInputChange}/>
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
                                                onChange={handleInputChange}/>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group as={Row} className="mb-1" controlId="formThingsCarried">
                                        <Form.Label column sm="4">
                                        Things carried :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="things_carried"
                                        value={formData.things_carried}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formRemark">
                                        <Form.Label column sm="4">
                                        Remark :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        as="textarea" 
                                        name="remark"
                                        value={formData.remark || "null"}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                    
                                </Col>
                                <Col md={11}>
                                    <h5 className="pdfsub_heading">Mental Status:</h5>
                                    <Form.Group as={Row} className="mb-1" controlId="formSymptoms">
                                        <Form.Label column sm="4">
                                        Symptoms :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        as="textarea"
                                        name="symptoms"
                                        value={formData.symptoms}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formIntimated">
                                        <Form.Label column sm="4">
                                        Intimated / Rescued by :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="rescued_by"
                                        value={formData.rescued_by}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formInformation">
                                        <Form.Label column sm="4">
                                        Information filed by :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="information"
                                        value={formData.information}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                    
                                </Col>
                                <Col md={11}>
                                    <h5 className="pdfsub_heading">Articles carried from Rescue:</h5>
                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="4">
                                        Name :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="rescue_name"
                                        value={formData.rescue_name}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formArticles">
                                        <Form.Label column sm="4">
                                        Items Found During Rescue :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        as="textarea"
                                        name="articles_carried"
                                        value={formData.articles_carried}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                    
                                </Col>
                                <Col md={11}>
                                    <h5 className="pdfsub_heading">Family Member Identification:</h5>
                                    <Form.Group as={Row} className="mb-1" controlId="formRelationship">
                                        <Form.Label column sm="4">
                                        Relationship :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="rescue_relationship"
                                        value={formData.rescue_relationship}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formMemberName">
                                        <Form.Label column sm="4">
                                        Family Member Name :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="f_member_name"
                                        value={formData.f_member_name}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formMemberPhone">
                                        <Form.Label column sm="4">
                                        Family Member Phone No. :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="f_member_phone"
                                        value={formData.f_member_phone}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formMemberAddress">
                                        <Form.Label column sm="4">
                                        Family Member Address :
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control 
                                        name="f_member_address"
                                        value={formData.f_member_address}
                                        onChange={handleInputChange}/>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formAdharCard">
                                        <Form.Label column sm="4">
                                        Family Member Aadhar Card Original :
                                        </Form.Label>
                                        <Col sm="8">
                                            {files.f_aadhar_card ? (
                                            <img 
                                            src={files.f_aadhar_card}
                                                alt="Rescue" 
                                                style={{ width: "200px", height: "auto", border: "1px solid #ccc" }}
                                            />
                                            ) : (
                                            <div>No Aadhar Card Available</div>
                                            )}
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formRationCard">
                                        <Form.Label column sm="4">
                                        Ration Card :
                                        </Form.Label>
                                        <Col sm="8">
                                            {files.f_ration_card ? (
                                            <img 
                                            src={files.f_ration_card}
                                                alt="Rescue" 
                                                style={{ width: "200px", height: "auto", border: "1px solid #ccc" }}
                                            />
                                            ) : (
                                            <div>No Ration Card Available</div>
                                            )}
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formRescueAadhar">
                                        <Form.Label column sm="4">
                                        Rescue Aadhar Card :
                                        </Form.Label>
                                        <Col sm="8">
                                            {files.res_aadhar_card ? (
                                            <img 
                                            src={files.res_aadhar_card}
                                                alt="Rescue" 
                                                style={{ width: "200px", height: "auto", border: "1px solid #ccc" }}
                                            />
                                            ) : (
                                            <div>No Rescue Aadhar Card Available</div>
                                            )}
                                        </Col>
                                    </Form.Group>
                                </Col>
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