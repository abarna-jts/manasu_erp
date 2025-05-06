import React from "react";
import { Table,Col } from "react-bootstrap";
import { Breadcrumb , Form, InputGroup} from '@themesberg/react-bootstrap';
import { useState, useEffect } from "react";
import { Modal, Button, Row } from 'react-bootstrap';
import axios from "axios";

function Rescue_details(){
    const [rescue_details, setRescueDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [show, setShowEditModal] = useState(false); //modal show 
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
        articles_carried: '',
        f_member_name: '',
        f_member_phone: '',
        f_member_address: ''
        });

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
            alert("First Form Details Deleted successfully");
            // Refresh data after deletion
            getRescueDetails(); // if this function fetches updated student list
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    //modal handling function 

    const handleClose = () => setShowEditModal(false);

    // handleShow functionality

    const handleShow = (item) => {
        setEditData({
          id: item.id,
          admission_date: item.admission_date,
          admission_no: item.admission_no,
          referred_by: item.referred_by,
          from_place: item.from_place,
          date_time: item.date_time,
          police_memo: item.police_memo,
          information_public: item.information_public,
          rescue_image:item.rescue_image,
        });
        setShowEditModal(true);
      };

    //update function
    const handleUpdate = async () => {
        try {
          const formData = new FormData();
          formData.append("admission_date", editData.admission_date);
          formData.append("admission_no", editData.admission_no);
          formData.append("referred_by", editData.referred_by);
          formData.append("from_place", editData.from_place);
          formData.append("date_time", editData.date_time);
          formData.append("police_memo", editData.police_memo);
          formData.append("information_public", editData.information_public);
      
          if (editData.rescue_image instanceof File) {
            formData.append("rescue_image", editData.rescue_image); // append only if it's a file
          }
      
          await axios.put(
            `http://localhost:5000/admision/update_first_form/${editData.id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
      
          alert("Updated successfully");
          getRescueDetails();
          setShowEditModal(false);
        } catch (error) {
          console.error("Error updating data", error);
        }
      };

      const fetchFormData =async () =>{
        try {

            const response = await axios.get(`http://localhost:5000/admision/get_rescue_details/${admissionNumber}`);
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
                articles_carried: data.articles_carried || '',
                f_member_name: data.f_member_name || '',
                f_member_phone: data.f_member_phone || '',
                f_member_address: data.f_member_address || '',
              }));

        }catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
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
                                            fetchFormData(item);
                                        }}
                                    >
                                        <i className="fas fa-eye"></i>
                                    </button>   
                                    <button className="btn btn-primary icon_details"
                                    onClick={() => {
                                        handleShow(item);
                                    }}
                                    ><i className="fas fa-edit"></i> </button>
                                    <button className="btn btn-danger icon_details"
                                    onClick={() => handleDelete(item.id)}
                                    ><i className="fas fa-trash"></i></button>
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

                    <Modal show={show} onHide={handleClose}>
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
                                
                                    

                                    {/*  */}
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
                    </Modal>
            </div>


            
                
      
        </>
    )
}

export default Rescue_details;