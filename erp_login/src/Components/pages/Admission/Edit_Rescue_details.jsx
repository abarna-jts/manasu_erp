import React from 'react';
import { Breadcrumb, Col, Container, Form, Row, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import imageCompression from 'browser-image-compression';

function Edit_Rescue_details() {
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
    mental_status: '',
    behaviour: '',
    community_ability: '',
    self_careCapacity: '',
    govIdType: '',
    govIdNumber: '',
    diagnosis: '',
    // symptoms: '',
    // rescued_by: '',
    // information: '',
    // rescue_relationship: '',
    // articles_carried: '',
    // f_member_name: '',
    // f_member_phone: '',
    // f_member_address: '',
    rescue_image: null,
    rescue_image_url: '', // for preview
    attach_policeMemo: null,
    attach_policeMemo_url: '',
    govIdFile: null,
    govIdFile_url: '', // for preview
    // f_aadhar_card: null,
    // f_aadhar_card_url: '',
    // f_ration_card: null,
    // f_ration_card_url: '',
    // res_aadhar_card: null,
    // res_aadhar_card_url: '',
  });
  const { id } = useParams();

  const [files, setFiles] = useState({});

  const apiRoute = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiRoute.get(`/admision/get_rescue_details/${id}`);
        const data = response.data;

        setFormData({
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
          mental_status: data.mental_status || '',
          behaviour: data.behaviour || '',
          community_ability: data.community_ability || '',
          self_careCapacity: data.self_careCapacity || '',
          govIdType: data.govIdType || '',
          diagnosis: data.diagnosis || '',
          govIdNumber: data.govIdNumber || '',
          tattoo: data.tattoo || '',


          rescue_image_url: data.rescue_image,
          attach_policeMemo_url: data.attach_policeMemo,
          govIdFile_url: data.govIdFile,


        });

        let policeMemoAttach = [];
        if (data.attach_policeMemo) {
          try {
            const parsed = JSON.parse(data.attach_policeMemo);
            if (Array.isArray(parsed)) {
              policeMemoAttach = parsed.map((p) => `https://www.pahrultours.com/app2/${p.replace(/"/g, '')}`);
            }
          } catch (err) {
            console.warn('Failed to parse attach_policeMemo:', err);
            // Fallback: comma-separated string
            policeMemoAttach = data.attach_policeMemo
              .split(',')
              .map((p) => `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, '')}`);
          }
        }

        let RescueImage = [];
        if (data.rescue_image) {
          try {
            const parsed = JSON.parse(data.rescue_image);
            if (Array.isArray(parsed)) {
              RescueImage = parsed.map((p) => `https://www.pahrultours.com/app2/${p.replace(/"/g, '')}`);
            }
          } catch (err) {
            console.warn('Failed to parse attach_policeMemo:', err);
            // Fallback: comma-separated string
            RescueImage = data.rescue_image
              .split(',')
              .map((p) => `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, '')}`);
          }
        }

        let govtFilePath = [];
        if (data.govIdFile) {
          try {
            const parsed = JSON.parse(data.govIdFile);
            if (Array.isArray(parsed)) {
              govtFilePath = parsed.map((p) => `https://www.pahrultours.com/app2/${p.replace(/"/g, '')}`);
            }
          } catch (err) {
            console.warn('Failed to parse govIdFile:', err);
            // Fallback: comma-separated string
            govtFilePath = data.govIdFile
              .split(',')
              .map((p) => `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, '')}`);
          }
        }

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


      } catch (error) {
        console.error('Failed to fetch:', error);
      }
    };

    fetchDetails();
  }, [id]);

  // const handleFileChange = (e) => {
  //   const { name, files } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: [...files] 
  //   }));
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

          // ✅ Log original vs compressed
          console.log(`File ${idx + 1} Original:`, {
            name: file.name,
            size: (file.size / 1024).toFixed(2) + " KB",
            type: file.type,
          });
          console.log(`File ${idx + 1} Compressed:`, {
            name: `essential_${Date.now()}_${idx}.jpeg`,
            size: (compressed.size / 1024).toFixed(2) + " KB",
            type: compressed.type,
          });

          // Rename to avoid .blob
          const ext = compressed.type.split("/")[1]; // e.g. jpeg
          return new File([compressed], `essential_${Date.now()}_${idx}.${ext}`, {
            type: compressed.type,
          });
        })
      );

      setFormData((prev) => ({
        ...prev,
        [event.target.name]: compressedFiles // ✅ store compressed files
      }));

      console.log("✅ Final compressed files array:", compressedFiles);
    } catch (e) {
      console.error("Compression error:", e);
    }
  };


  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  };


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10); // "yyyy-MM-dd"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formatToMySQLDateTime = (isoString) => {
      const date = new Date(isoString);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const hh = String(date.getHours()).padStart(2, '0');
      const mi = String(date.getMinutes()).padStart(2, '0');
      const ss = String(date.getSeconds()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    };

    const formDataToSend = new FormData();
    formDataToSend.append("referred_by", formData.referred_by);
    formDataToSend.append("from_place", formData.from_place);
    formDataToSend.append("date_time", formatToMySQLDateTime(formData.date_time));
    formDataToSend.append("police_memo", formData.police_memo);
    formDataToSend.append("police_station", formData.police_station);
    formDataToSend.append("information_public", formData.information_public);
    formDataToSend.append("admission_date", formatToMySQLDateTime(formData.admission_date));
    formDataToSend.append("admission_no", formData.admission_no);
    formDataToSend.append("rescue_name", formData.rescue_name);
    formDataToSend.append("age", formData.age);
    formDataToSend.append("rescue_status", formData.rescue_status);
    formDataToSend.append("religion", formData.religion);
    formDataToSend.append("language1", formData.language1);
    formDataToSend.append("language2", formData.language2);
    formDataToSend.append("language3", formData.language3);
    formDataToSend.append("education", formData.education);
    formDataToSend.append("father", formData.father);
    formDataToSend.append("mother", formData.mother);
    formDataToSend.append("other_relation", formData.other_relation);
    formDataToSend.append("place", formData.place);
    formDataToSend.append("phone_no", formData.phone_no);
    formDataToSend.append("clothing", formData.clothing);
    formDataToSend.append("dress_code", formData.dress_code);
    formDataToSend.append("complexion", formData.complexion);
    formDataToSend.append("indentification_mark", formData.indentification_mark);
    formDataToSend.append("tattoo", formData.tattoo);
    formDataToSend.append("wound_infection", formData.wound_infection);
    formDataToSend.append("height", formData.height);
    formDataToSend.append("weight", formData.weight);
    formDataToSend.append("things_carried", formData.things_carried);
    formDataToSend.append("remark", formData.remark);
    formDataToSend.append("mental_status", formData.mental_status);
    formDataToSend.append("behaviour", formData.behaviour);
    formDataToSend.append("community_ability", formData.community_ability);
    formDataToSend.append("self_careCapacity", formData.self_careCapacity);
    formDataToSend.append("govIdType", formData.govIdType);
    formDataToSend.append("govIdNumber", formData.govIdNumber);
    formDataToSend.append("diagnosis", formData.diagnosis);

    if (formData.rescue_image) {
      formData.rescue_image.forEach((file) =>
        formDataToSend.append("rescue_image", file)
      );
    }
    if (formData.attach_policeMemo) {
      formData.attach_policeMemo.forEach((file) =>
        formDataToSend.append("attach_policeMemo", file)
      );
    }
    if (formData.govIdFile) {
      formData.govIdFile.forEach((file) =>
        formDataToSend.append("govIdFile", file)
      );
    }

    try {
      const response = await apiRoute.put(
        `/admision/update_first_form/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);

      if (response.status === 201) {
        alert("Rescue details updated successfully.");
        navigate("/rescue_details");
      } else {
        console.error("Update failed:", response.data.message);
      }
    } catch (err) {
      console.error("Error while updating:", err.response?.data || err.message);
    }
  };
  const navigate = useNavigate();


  return (
    <>
      <div className="d-xl-flex align-items-center flex-wrap flex-md-nowrap text-start py-2">
        <div className="d-block mb-4 mb-xl-0 px-4 ">
          <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item></Breadcrumb.Item>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          </Breadcrumb>
          <h6 className="breadcrumb_title">Rescue Details</h6>

        </div>

        <Col md={9} className="text-center">
          <h4 className="section_title_1">Edit Rescue Details</h4>
        </Col>
      </div>

      <Container>
        <Row >
          <Col md={12}>
            <Form onSubmit={handleSubmit}>
              <Row className='d-flex align-items-start justify-content-between'>
                <div className="first_column col-md-8">
                  <Col md={12}>
                    <h5 className="pdfsub_heading">Rescue Details:</h5>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                      <Form.Label column sm="4">
                        Rescued / Referred by :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="referred_by"
                          type="text"
                          value={formData.referred_by}
                          onChange={handleInputChange}
                          required
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formTakenFrom">
                      <Form.Label column sm="4">
                        Taken From (Rescue Place) :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="from_place"
                          type='text'
                          value={formData.from_place}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-1 text-start" controlId="formDateTime">
                      <Form.Label column sm="4">
                        Date & Time :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="date_time"
                          type='datetime-local'
                          max={new Date().toISOString().slice(0, 16)}
                          value={formatDateTimeLocal(formData.date_time)}// Make sure `rescueDate` is a valid date string
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                      <Form.Label column sm="4">
                        Police Memo :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="police_memo"
                          type='text'
                          value={formData.police_memo}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formFile" className="mb-3 text-start">
                      <Form.Label column sm="4">
                        Copy of Police Memo :
                      </Form.Label>
                      <Col sm="8 d-flex flex-row align-items-center">

                        {Array.isArray(files.attach_policeMemo) &&
                          files.attach_policeMemo.map((imgUrl, index) => {
                            const filename = `attach_policeMemo${index}.jpg`;

                            return (
                              <div
                                key={index}
                                className="image-container"
                                style={{
                                  position: "relative",
                                  width: "200px",
                                  height: "100px",
                                  margin: "10px",
                                  padding: "0px",
                                  display: "inline-block",
                                }}
                              >
                                <img
                                  src={imgUrl}
                                  alt={`attach_policeMemo - ${index}`}
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
                          name="attach_policeMemo"
                          multiple
                          accept=".jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      </Col>
                    </Form.Group>




                    <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceStation">
                      <Form.Label column sm="4">
                        Police Station :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="police_station"
                          type='text'
                          value={formData.police_station}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                      <Form.Label column sm="4">
                        Information from Public / Spot :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="information_public"
                          type='text'
                          value={formData.information_public}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <h5 className="pdfsub_heading">Resident's Details:</h5>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formRescueName">
                      <Form.Label column sm="4">
                        Name at the time of Rescue :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="rescue_name"
                          type='text'
                          value={formData.rescue_name}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formAge">
                      <Form.Label column sm="4">
                        Approximate age :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="age"
                          type='text'
                          value={formData.age}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>

                    <Row className="d-flex mb-1">
                      <Col md={7}>
                        <Form.Group as={Row} className="mb-1 text-start" controlId="formStatus">
                          <Form.Label column sm="7">
                            Status :
                          </Form.Label>
                          <Col sm="5">
                            <Form.Select
                              name="rescue_status"
                              value={formData.rescue_status}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">-- Select --</option>
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                            </Form.Select>
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col md={5}>
                        <Form.Group as={Row} className="mb-1 text-start" controlId="formReligion">
                          <Form.Label column sm="6">
                            Religion :
                          </Form.Label>
                          <Col sm="6">
                            <Form.Control
                              name="religion"
                              type='text'
                              value={formData.religion}
                              onChange={handleInputChange}
                              required />
                          </Col>
                        </Form.Group>
                      </Col>


                    </Row>
                    <Form.Group as={Row} className="mb-2 text-start" controlId="formLanguage">
                      <Form.Label column sm="4">Known Languages:</Form.Label>
                      <Col sm="8" className="d-flex gap-2">
                        <Form.Control
                          type="text"
                          placeholder="Language 1"
                          value={formData.language1}
                          onChange={(e) => setLanguage1(e.target.value)}
                          required
                        />
                        <Form.Control
                          type="text"
                          placeholder="Language 2"
                          value={formData.language2}
                          onChange={(e) => setLanguage2(e.target.value)}
                        />
                        <Form.Control
                          type="text"
                          placeholder="Language 3"
                          value={formData.language3}
                          onChange={(e) => setLanguage3(e.target.value)}
                        />
                      </Col>
                    </Form.Group>


                    <Form.Group as={Row} className="mb-1 text-start" controlId="formEducation">
                      <Form.Label column sm="4">
                        Education :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="education"
                          type='text'
                          value={formData.education}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <h5 className="pdfsub_heading">Family Details:</h5>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formFather">
                      <Form.Label column sm="4">
                        Father :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="father"
                          type='text'
                          value={formData.father}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formMother">
                      <Form.Label column sm="4">
                        Mother :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="mother"
                          type='text'
                          value={formData.mother}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formanyother">
                      <Form.Label column sm="4">
                        Any other Relationship:
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="other_relation"
                          type='text'
                          value={formData.other_relation}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formPlace">
                      <Form.Label column sm="4">
                        Address :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="place"
                          type='text'
                          value={formData.place}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formContactNo">
                      <Form.Label column sm="4">
                        Contact Number :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="phone_no"
                          type='text'
                          value={formData.phone_no}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <h5 className="pdfsub_heading">Physical Appearance:</h5>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formClothing">
                      <Form.Label column sm="4">
                        Clothing :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="clothing"
                          type='text'
                          value={formData.clothing}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formDressColor">
                      <Form.Label column sm="4">
                        Dress Color :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="dress_code"
                          type='text'
                          value={formData.dress_code}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formComplexion">
                      <Form.Label column sm="4">
                        Complexion :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="complexion"
                          type='text'
                          value={formData.complexion}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formIdentificationMark">
                      <Form.Label column sm="4">
                        Indentification Mark :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="indentification_mark"
                          type='text'
                          value={formData.indentification_mark}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formTatoo">
                      <Form.Label column sm="4">
                        Tattoo :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="tattoo"
                          type='text'
                          value={formData.tattoo}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formWound">
                      <Form.Label column sm="4">
                        Any Wound/ infection :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="wound_infection"
                          type='text'
                          value={formData.wound_infection}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                    <Row>

                      <Col md={6}>
                        <Form.Group as={Row} className="mb-1 text-start" controlId="formHeight">
                          <Form.Label column sm="8">
                            Height :
                          </Form.Label>
                          <Col sm="4">
                            <Form.Control
                              name="height"
                              type='text'
                              value={formData.height}
                              onChange={handleInputChange}
                              required />
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group as={Row} className="mb-1 text-start" controlId="formWeight">
                          <Form.Label column sm="4">
                            Weight :
                          </Form.Label>
                          <Col sm="8">
                            <Form.Control
                              name="weight"
                              type='text'
                              value={formData.weight}
                              onChange={handleInputChange}
                              required />
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formThingsCarried">
                      <Form.Label column sm="4">
                        Things carried :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          name="things_carried"
                          type='text'
                          value={formData.things_carried}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formRemark">
                      <Form.Label column sm="4">
                        Notes :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          as="textarea"
                          name="remark"
                          type='text'
                          value={formData.remark || 'null'}
                          onChange={handleInputChange} />
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <h5 className="pdfsub_heading">Initial Psychological Assessment:</h5>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formSymptoms">
                      <Form.Label column sm="4">
                        Mental status :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          as="textarea"
                          name="mental_status"
                          type='text'
                          value={formData.mental_status}
                          rows={2}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formIntimated">
                      <Form.Label column sm="4">
                        Cognitive Behavior :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          as="textarea"
                          name="behaviour"
                          type='text'
                          value={formData.behaviour}
                          rows={2}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                      <Form.Label column sm="4">
                        Communication Ability :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          as="textarea"
                          name="community_ability"
                          type='text'
                          value={formData.community_ability}
                          rows={2}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                      <Form.Label column sm="4">
                        Self-Care Capacity :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          as="textarea"
                          name="self_careCapacity"
                          type='text'
                          value={formData.self_careCapacity}
                          rows={2}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                      <Form.Label column sm="4">
                        Diagnosis :
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          as="textarea"
                          name="diagnosis"
                          type='text'
                          value={formData.diagnosis}
                          rows={2}
                          onChange={handleInputChange}
                          required />
                      </Col>
                    </Form.Group>
                  </Col>
                </div>
                <div className="second_column col-md-4">
                  <Col md={12}>

                    <Form.Group as={Row} className="mb-1 text-start" controlId="formAdmissionNo">
                      <Form.Label column sm="5">
                        Admission Date :
                      </Form.Label>
                      <Col sm="7">
                        <Form.Control
                          name="admission_date"
                          type='date'
                          value={formatDateOnly(formData.admission_date)}
                          onChange={handleInputChange}
                          required />
                      </Col>
                      <Form.Label column sm="5">
                        Admission Number :
                      </Form.Label>
                      <Col sm="7">
                        <Form.Control
                          name="admission_no"
                          type='number'
                          value={formData.admission_no}
                          onChange={handleInputChange}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formFile" className="mb-3 text-start">
                      <Form.Label column sm="5">
                        Rescue Image :
                      </Form.Label>
                      <Col sm="7 d-flex align-items-center">

                        {Array.isArray(files.rescue_image) &&
                          files.rescue_image.map((imgUrl, index) => {
                            const filename = `rescue_image${index}.jpg`;

                            return (
                              <div
                                key={index}
                                className="image-container"
                                style={{
                                  position: "relative",
                                  width: "100px",
                                  height: "100px",
                                  margin: "10px",
                                  padding: "0px",
                                  display: "inline-block",
                                }}
                              >
                                <img
                                  src={imgUrl}
                                  alt={`rescue_image - ${index}`}
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



                      </Col>
                      <div className="d-flex align-items-end justify-content-end">
                        <Col sm="7">
                          <Form.Control
                            type="file"
                            name="rescue_image"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            multiple
                          />
                        </Col>
                      </div>


                    </Form.Group>

                    <Form.Group className="mb-3 text-start">
                      <Form.Label column sm={12}>Government ID Type:</Form.Label>
                      <Col sm={12}>
                        <Form.Select
                          name="govIdType"
                          value={formData.govIdType}
                          onChange={(e) =>
                            setFormData({ ...formData, govIdType: e.target.value })
                          }
                          required>
                          <option value="">Select ID Type</option>
                          <option value="NA">Not Available</option>
                          <option value="Aadhar">Aadhar Card</option>
                          <option value="PAN">PAN Card</option>
                          <option value="Voter">Voter ID</option>
                          <option value="Driving">Driving License</option>
                          <option value="Passport">Passport</option>
                        </Form.Select>
                      </Col>
                    </Form.Group>

                    {/* Show only if govIdType is not NA or empty */}
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


                        <Form.Group className="mb-3 text-start">
                          <Form.Label column sm={12}>Upload {formData.govIdType} File:</Form.Label>
                          <Col sm={12}>
                            <Form.Control
                              type="file"
                              accept=".pdf,image/*"
                              onChange={(e) =>
                                setFormData({ ...formData, govIdFile: Array.from(e.target.files) })
                              }

                              multiple
                            />
                            {Array.isArray(files.govIdFile) &&
                              files.govIdFile.map((imgUrl, index) => {
                                const filename = `govIdFile${index}.jpg`;

                                return (
                                  <div
                                    key={index}
                                    className="image-container"
                                    style={{
                                      position: "relative",
                                      width: "100px",
                                      height: "100px",
                                      margin: "10px",
                                      padding: "0px",
                                      display: "inline-block",
                                    }}
                                  >
                                    <img
                                      src={imgUrl}
                                      alt={`govIdFile - ${index}`}
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
                          </Col>
                        </Form.Group>
                      </>
                    )}

                  </Col>
                </div>


              </Row>
              <Button type="submit" className='btn btn-success mb-5 mt-3'>Update</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Edit_Rescue_details
