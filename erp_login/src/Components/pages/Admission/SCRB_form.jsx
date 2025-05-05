import React from "react";
import { Container, Row, Form, InputGroup, Col, Button} from "react-bootstrap";
import { Breadcrumb } from '@themesberg/react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useState } from "react";

function SCRB_form(){

    const [admissionNumber, setAdmissionNumber] = useState('');
    const [formData, setFormData] = useState({
        koppu_en: '',
        name_rescue: '',
        phone_no: '',
        rescue_name : '',
        father : '',
        date_time : '',
        rescue_status : '',
        language : '',
        place : '',
        police_station : '',
        addition_info : '',
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
          const response = await axios.get(`http://localhost:5000/admision/get_scrb_formdata/${admissionNumber}`);
          setFormData(response.data);
        } catch (error) {
          console.error('Error fetching data', error);
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
    
        const data = new FormData();
        data.append('name_ngo', 'MANASU (Mana Nala Sugalayam)');
        data.append('koppu_en', formData.koppu_en);
        data.append('rescue_name', formData.rescue_name);
        data.append('father', formData.father);
        data.append('date_time', formData.date_time);
        data.append('gender', 'Male');
        data.append('rescue_status', formData.rescue_status);
        data.append('language', formData.language);
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
          const res = await axios.post('http://localhost:5000/scrb_form/create_form2', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          console.log(res);
          alert('Form submitted successfully!');
        } catch (err) {
          console.error(err);
          alert('Submission failed.');
        }
      };

    return(
            <>
                <div className="d-xl-flex justify-content-between align-items-center flex-wrap flex-md-nowrap text-start py-2">
                    <div className="d-block mb-4 mb-xl-0 px-4 ">
                      <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item></Breadcrumb.Item>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item active>Admission</Breadcrumb.Item>
                      </Breadcrumb>
                      <h6 className="breadcrumb_title">SCRB Form</h6>
                      
                    </div>

                    <div className="d-flex align-items-center px-3">
                        <form className="navbar-search" onSubmit={e => e.preventDefault()}>
                        <div className="input-group">
                            <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Admission Number"
                            value={admissionNumber}
                            onChange={(e) => setAdmissionNumber(e.target.value)}
                            />
                            <button className="btn btn-primary" onClick={handleSearch}>
                            Search
                            </button>
                        </div>
                        </form>
                    </div>
                </div>

                {/* Form 2 start */}
                <Container>
                    <Row>
                        <Col md={12} className="text-center">
                            <h4 className="section_title_1">FORM - 2 FOUND PERSON PERSONAL DETAILS</h4>
                            <h5 className="sub_title">படிவம் - 2 மீட்கப்பட்டவர்களின் விவரங்கள்</h5>
                        </Col>
                        <div className="container mt-5">
                        <form onSubmit={handleSubmit}>
                            <table className="table table-bordered" style={{border:"2px solid rgb(143 143 143)", marginBottom:"0rem"}}>
                                
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
                                                value={"MANASU (Mana Nala Sugalayam)"}
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
                                                <div className="text-center" style={{border:"1px solid rgb(108 108 108)", borderRadius:'5px'}}>
                                                <label>Old Photo</label><br />
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
                                                <div className="text-center" style={{border:"1px solid rgb(108 108 108)", borderRadius:'5px'}}>
                                                <label>New Photo</label><br />
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
                                <table className="table table-border form_2_2" style={{border:"2px solid rgb(143 143 143)"}}>
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
                                                    value={formData.rescue_name || ''}
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
                                                    value={formatDateOnly(formData.date_time || '')}
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
                                                    value={formData.rescue_status || ''}
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
                                                    name="language"
                                                    className="form-control text-center"
                                                    value={formData.language || ''}
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
                                                    value={formData.place || ''}
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
                                                    value={formData.police_station || ''}
                                                    readOnly
                                                    
                                                    />
                                                </div>
                                                </div>
                                            </td>
                                        </tr>
                                        
                                    </tbody>
                                </table>
                            )}
                            <table className="table table-border" style={{border:"2px solid rgb(143 143 143)"}}>
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
                                                name="name_rescue"
                                                    className="form-control"
                                                    onChange={handleInputChange}
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
                            
                                    <button type="submit" className="btn btn-primary">
                                        Submit Form
                                    </button>
                                </div>
                        </form>
                        </div>
                    </Row>
                </Container>
            </>
    )
}

export default SCRB_form;