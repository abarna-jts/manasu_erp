import React from 'react'
import { useState, useEffect } from 'react';
import { Col, Breadcrumb, Container, Row, Table, Button, InputGroup, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function MSE_form() {
  const [rescue_image, setRescueImage] = useState(null);
  const [error, setError] = useState("");
  const [admission_no, setAdmissionNumber] = useState('');
  const [rescueName, setRescueName] = useState("");

  const handleAdmissionChange = (e) => {
    setAdmissionNumber(e.target.value);
  };

  const fetchRescueDetails = async (admission_no) => {
    try {
      const response = await apiRoute.get(`/admision/get_scrbform2data/${admission_no}`);
      const result = response.data.data[0];
      console.log("API Result:", result);

      if (result && result.rescue_image) {
        const imagePath = result.rescue_image.startsWith("http")
          ? result.rescue_image
          : `http://localhost:5000/${result.rescue_image}`;

        setRescueImage(imagePath);
        setRescueName(result.rescue_name || "");
        setError(""); // clear any previous error
      } else {
        setRescueImage(null);

        setError("Image not found for this admission number");
      }
    } catch (error) {
      console.error("Error fetching data", error);
      setRescueImage(null);
      setRescueName("");
      setError("Admission Number Not found");
    }
  };

  // Trigger when admission number changes
  useEffect(() => {
    if (admission_no.trim() !== "") {
      fetchRescueDetails(admission_no);
    } else {
      setRescueImage(null);
      setRescueName("");
      setError("");
    }
  }, [admission_no]);
  return (
    <>
      <div className="d-xl-flex align-items-center flex-wrap flex-md-nowrap text-start py-2">
        <div className="d-block mb-4 mb-xl-0 px-4 ">
          <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item></Breadcrumb.Item>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Recovery</Breadcrumb.Item>
          </Breadcrumb>
          <h6 className="breadcrumb_title">MSE Form</h6>

        </div>

        <Col md={9} className="text-center">
          <h4 className="section_title_1">Mental Status Examination (MSE)</h4>
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
              <p className="mt-2 text-start">{rescue_name ? rescue_name : "No name available"}</p>  {/* display name below */}
            </>
          ) : (
            <p>{error || "No image to display"}</p>
          )}
        </Col>


      </div>

      <Container>
        <Row>

          <Col md={12}>
            <Row>
              <Col md="8">
                <div className="d-flex align-items-center px-3">

                  <Form className="navbar-search col-md-9">
                    <Form.Group id="topbarSearch" className="d-flex align-items-center">
                      <Col md={3}>
                        <Form.Label>Admission Number:</Form.Label>
                      </Col>
                      <Col md={2}>
                        <InputGroup className="input-group-merge search-bar">
                          <Form.Control
                            type="text"
                            value={admission_no}
                            onChange={handleAdmissionChange}
                          />
                        </InputGroup>
                      </Col>
                      <button type="button" className="btn btn-secondary mx-2" onClick={() => {
                        if (!admission_no.trim()) {
                          alert("Please enter admission number.");
                        } else {
                          fetchFormData(); // Fetch & populate data before generating PDF
                        }
                      }}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
                      <button type="button" className="btn btn-primary mx-2" onClick={() => {
                        if (!admission_no.trim()) {
                          alert("Please enter your admission number.");
                        } else {
                          createFormData(); // Fetch & populate data before generating PDF
                        }
                      }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
                      {/* <button type="button" className="btn btn-success mx-2" onClick={handleDownload}>
                        Import Excel Sheet
                      </button> */}
                    </Form.Group>
                  </Form>

                </div>
              </Col>

            </Row>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col>
            <div className="page">

              {/* tabs */}
              <div className="pcss3t pcss3t-effect-scale pcss3t-theme-1">
                <input type="radio" name="pcss3t" defaultChecked id="tab1" className="tab-content-first" />
                <label htmlFor="tab1"><i className="icon-bolt"></i>General appearance and behaviour</label>

                <input type="radio" name="pcss3t" id="tab2" className="tab-content-2" />
                <label htmlFor="tab2"><i className="icon-picture"></i>Speech</label>

                <input type="radio" name="pcss3t" id="tab3" className="tab-content-3" />
                <label htmlFor="tab3"><i className="icon-cogs"></i>Mood and affect</label>

                <input type="radio" name="pcss3t" id="tab4" className="tab-content-4" />
                <label htmlFor="tab4"><i className="icon-cogs"></i>Thought</label>

                <input type="radio" name="pcss3t" id="tab5" className="tab-content-5" />
                <label htmlFor="tab5"><i className="icon-cogs"></i>Perception</label>

                <input type="radio" name="pcss3t" id="tab6" className="tab-content-6" />
                <label htmlFor="tab6"><i className="icon-cogs"></i>Cognition (higher mental functions)</label>

                <input type="radio" name="pcss3t" id="tab7" className="tab-content-7" />
                <label htmlFor="tab7"><i className="icon-cogs"></i>Judgement</label>

                <input type="radio" name="pcss3t" id="tab8" className="tab-content-last" />
                <label htmlFor="tab8"><i className="icon-globe"></i>Insight</label>

                <ul>
                  {/* GENERAL APPEARANCE AND BEHAVIOUR START*/}
                  <li className="tab-content tab-content-first typography">
                    <h1>1. GENERAL APPEARANCE AND BEHAVIOUR:</h1>
                    <ul>
                      <Form>
                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>General Appearance:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <Form.Check type="checkbox" id="height" label="Approximate height" />
                            <Form.Check type="checkbox" id="weight" label="Approximate weight" />
                            <Form.Check type="checkbox" id="comfort" label="Looks comfortable" />
                            <Form.Check type="checkbox" id="uncomfort" label="Looks uncomfortable" />
                            <Form.Check type="checkbox" id="health" label="Physical health" />
                            <Form.Check type="checkbox" id="grooming" label="Grooming" />
                            <Form.Check type="checkbox" id="hygiene" label="Hygiene" />
                            <Form.Check type="checkbox" id="self-care" label="Self-Care" />
                            <Form.Check type="checkbox" id="dressing-proper" label="Proper Dressing" />
                            <Form.Check type="checkbox" id="dressing-neat" label="Dressing Neatly" />
                            <Form.Check type="checkbox" id="facies" label="Facial Expression" />
                          </div>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Attitude towards the examiner:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <Form.Check type="checkbox" id="cooperation" label="Cooperation" />
                            <Form.Check type="checkbox" id="guardedness" label="Guardedness" />
                            <Form.Check type="checkbox" id="evasiveness" label="Evasiveness" />
                            <Form.Check type="checkbox" id="hostility" label="Hostility" />
                            <Form.Check type="checkbox" id="attentiveness" label="Attentiveness" />
                            <Form.Check type="checkbox" id="interested" label="Shows Interest" />
                            <Form.Check type="checkbox" id="disinterested" label="Lacks Interest" />
                          </div>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Comprehension:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <Form.Check type="checkbox" id="intact" label="Intact" />
                            <Form.Check type="checkbox" id="partially-impaired" label="Partially Impaired" />
                            <Form.Check type="checkbox" id="fully-impaired" label="Fully Impaired" />
                          </div>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Gait and posture:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <Form.Check type="checkbox" id="sitting-normal" label="Normal Sitting" />
                            <Form.Check type="checkbox" id="sitting-abnormal" label="Abnormal Sitting" />
                            <Form.Check type="checkbox" id="standing-normal" label="Normal Standing" />
                            <Form.Check type="checkbox" id="standing-abnormal" label="Abnormal Standing" />
                            <Form.Check type="checkbox" id="walking-normal" label="Normal Walking Pattern" />
                            <Form.Check type="checkbox" id="walking-abnormal" label="Abnormal Walking Pattern" />
                            <Form.Check type="checkbox" id="lying-normal" label="Normal Lying Position" />
                            <Form.Check type="checkbox" id="lying-abnormal" label="Abnormal Lying Position" />
                          </div>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Motor activity:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <Form.Check type="checkbox" id="increased" label="Increased" />
                            <Form.Check type="checkbox" id="decreased" label="Decreased" />
                            <Form.Check type="checkbox" id="excitement" label="Excitement" />
                            <Form.Check type="checkbox" id="stupor" label="Stupor" />
                            <Form.Check type="checkbox" id="AIMS" label="Abnormal involuntary movements (AIMS) tics" />
                            <Form.Check type="checkbox" id="tremors" label="Tremors" />
                            <Form.Check type="checkbox" id="restlessness" label="Restlessness" />
                            <Form.Check type="checkbox" id="akathisia" label="Skathisia" />
                            <Form.Check type="checkbox" id="social withdrawal" label="Social Withdrawal" />
                            <Form.Check type="checkbox" id="autism" label="Autism" />
                          </div>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Catatonic signs:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <Form.Check type="checkbox" id="mannerisms" label="Mannerisms" />
                            <Form.Check type="checkbox" id="stereotypes" label="Stereotypes" />
                            <Form.Check type="checkbox" id="posturing" label="Posturing" />
                            <Form.Check type="checkbox" id="waxy flexibility" label="Waxy Flexibility" />
                            <Form.Check type="checkbox" id="negativism" label="Negativism" />
                            <Form.Check type="checkbox" id="ambitendency" label="Ambitendency" />
                            <Form.Check type="checkbox" id="automatic obedience" label="Automatic Obedience" />
                            <Form.Check type="checkbox" id="Echo- Praxia" label="Echo- Praxia" />
                            <Form.Check type="checkbox" id="psychological-pillow" label="Psychological-Pillow" />
                          </div>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Conversion and dissociative signs:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <Form.Check type="checkbox" id="pseudo seizures" label="Pseudo Seizures" />
                            <Form.Check type="checkbox" id="possession states" label="possession States" />
                          </div>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Social manner:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <Form.Check type="checkbox" id="social-increased" label="Increased" />
                            <Form.Check type="checkbox" id="social-decreased" label="Decreased" />
                            <Form.Check type="checkbox" id="inappropriate" label="Inappropriate" />
                          </div>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Rapport:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <Form.Check type="checkbox" id="relationship_patient" label="Whether a working empathic relationship can be established with the patient, should mentioned." />
                          </div>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Hallucinatory behaviour:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <Form.Check type="checkbox" id="smiling" label="Smiling without reason" />
                            <Form.Check type="checkbox" id="crying" label="Crying without reason" />
                            <Form.Check type="checkbox" id="Muttering to self" label="Muttering to self" />
                            <Form.Check type="checkbox" id="Talking to self audibly" label="Talking to self audibly" />
                            <Form.Check type="checkbox" id="Engages in non-social speech" label="Engages in non-social speech" />
                            <Form.Check type="checkbox" id="Odd gesturing in response to auditory" label="Odd gesturing in response to auditory" />
                            <Form.Check type="checkbox" id="visual hallucinations" label="Visual Hallucinations" />
                          </div>
                        </li>
                        <Col md={12} className="text-center mt-3">
                          <Button type='submit' className='btn btn-success'>Save</Button>
                        </Col>



                      </Form>
                    </ul>

                  </li>
                  {/* GENERAL APPEARANCE AND BEHAVIOUR END*/}

                  {/* SPEECH START*/}
                  <li className="tab-content tab-content-2 typography">
                    <h1>2. SPEECH</h1>
                    <ul>
                      <Form>
                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Rate and quantity of speech:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <Form.Check type="checkbox" id="present" label="Speech is present" />
                            <Form.Check type="checkbox" id="absent" label="Speech is Absent" />
                            <Form.Check type="checkbox" id="spontaneous" label="If present, whether it is spontaneous" />
                            <Form.Check type="checkbox" id="productivity_increase" label="Productivity is increased" />
                            <Form.Check type="checkbox" id="productivity_decreased" label="Productivity is Decreased" />
                            <Form.Check type="checkbox" id="rapid" label="Rate is rapid" />
                            <Form.Check type="checkbox" id="slow" label="Rate is slow" />
                            <Form.Check type="checkbox" id="Pressure of speech" label="Pressure of speech" />
                            <Form.Check type="checkbox" id="poverty of speech" label="Poverty of Speech" />
                          </div>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Volume and tone of speech:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <Form.Check type="checkbox" id="volume_increase" label="Increased" />
                            <Form.Check type="checkbox" id="volume_decrease" label="Decreased" />
                          </div>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Flow and rhythm of speech:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <Form.Check type="checkbox" id="Smooth" label="Smooth" />
                            <Form.Check type="checkbox" id="hesitant" label="Hesitant" />
                            <Form.Check type="checkbox" id="Dysprosody" label="Dysprosody" />
                            <Form.Check type="checkbox" id="blocking" label="Blocking (sudden)" />
                            <Form.Check type="checkbox" id="Circumstantiality" label="Circumstantiality" />
                            <Form.Check type="checkbox" id="Tangentiality" label="Tangentiality" />
                            <Form.Check type="checkbox" id="loosening of associations" label="Loosening of associations" />
                            <Form.Check type="checkbox" id="Verbigeration" label="Verbigeration" />
                            <Form.Check type="checkbox" id="Perseveration" label="Perseveration" />
                            <Form.Check type="checkbox" id="stereotypies" label="Stereotypies (verbal)" />
                            <Form.Check type="checkbox" id="Flight of ideas" label="Flight of ideas" />
                            <Form.Check type="checkbox" id="clang associations" label="Clang associations" />
                          </div>
                        </li>

                        <Col md={12} className="text-center mt-3">
                          <Button type='submit' className='btn btn-success'>Save</Button>
                        </Col>

                      </Form>
                    </ul>
                  </li>
                  {/* SPEECH END*/}

                  {/* MOOD AND AFFECT START*/}
                  <li className="tab-content tab-content-3 typography">
                    <h1>3. MOOD AND AFFECT</h1>
                    <ul>
                      <Form>
                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Mood Described as:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <Form.Check type="checkbox" id="Relaxed" label="Relaxed" />
                            <Form.Check type="checkbox" id="Happy" label="Happy" />
                            <Form.Check type="checkbox" id="Anxious" label="Anxious" />
                            <Form.Check type="checkbox" id="Angry" label="Angry" />
                            <Form.Check type="checkbox" id="Depressed" label="Depressed" />
                            <Form.Check type="checkbox" id="Hopeless" label="Hopeless" />
                            <Form.Check type="checkbox" id="Hopeful" label="Hopeful" />
                            <Form.Check type="checkbox" id="Apathetic" label="Apathetic" />
                            <Form.Check type="checkbox" id="Euphoric" label="Euphoric" />
                            <Form.Check type="checkbox" id="Euthymic" label="Euthymic" />
                            <Form.Check type="checkbox" id="Elated" label="Elated" />
                            <Form.Check type="checkbox" id="Irritable" label="Irritable" />
                            <Form.Check type="checkbox" id="Fearful" label="Fearful" />
                            <Form.Check type="checkbox" id="Silly" label="Silly" />
                          </div>
                        </li>
                        <li className="icon-li">
                          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>How do they appear to you?</Form.Label>
                            <Form.Control as="textarea" rows={2} />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Ask the patient directly how he/she feels</Form.Label>
                            <Form.Control as="textarea" rows={2} />
                          </Form.Group>
                        </li>

                        <h4 style={{ display: "inline" }}>Question to ask about Mood:</h4>
                        <li className="icon-li">
                          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>How do you generally feel most of the time?</Form.Label>
                            <Form.Control as="textarea" rows={2} />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>What's your mood like?</Form.Label>
                            <Form.Control as="textarea" rows={2} />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>How would you say you feel generally - happy, sad, frightened, angry ?</Form.Label>
                            <Form.Control as="textarea" rows={2} />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Rescue Looks like:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <Form.Check type="checkbox" id="depressed mood" label="Depressed Mood" />
                            <Form.Check type="checkbox" id="irritable mood" label="Irritable Mood" />
                            <Form.Check type="checkbox" id="blut affect" label="Blunt Affect" />
                            <Form.Check type="checkbox" id="flat affect" label="Flat Affect" />
                          </div>
                        </li>

                        <Col md={12} className="text-center mt-3">
                          <Button type='submit' className='btn btn-success'>Save</Button>
                        </Col>

                      </Form>
                    </ul>
                  </li>
                  {/* MOOD AND AFFECT END*/}

                  {/* THOUGHT START*/}
                  <li className="tab-content tab-content-4 typography">
                    <h1>4. THOUGHT</h1>
                    <ul>
                      <li className='icon-li'>
                        <h4 style={{ display: "inline" }}>Stream and form of thought:</h4>
                        <div className="d-flex flex-wrap gap-3 mt-2">
                          <Form.Check type="checkbox" id="Spontaneity" label="Spontaneity" />
                          <Form.Check type="checkbox" id="productivity" label="Productivity" />
                          <Form.Check type="checkbox" id="flight of ideas" label="Flight of Ideas" />
                          <Form.Check type="checkbox" id="poverty of content of speech" label="Poverty of content of speech" />
                          <Form.Check type="checkbox" id="thought block" label="thought block" />
                          <Form.Check type="checkbox" id="thought is assessed" label="Continuity of thought is assessed" />
                          <Form.Check type="checkbox" id="questions asked" label="Whether the thought processes are relevant to the questions asked." />
                          <Form.Check type="checkbox" id="loosening of associations" label="Loose of associations" />
                          <Form.Check type="checkbox" id="loosening of tangentiality" label="Loose of tangentiality" />
                          <Form.Check type="checkbox" id="loosening of circumstantiality" label="Loose of circumstantiality" />
                          <Form.Check type="checkbox" id="Illogical thinking" label="Illogical thinking" />
                          <Form.Check type="checkbox" id="perseveration" label="Perseveration" />
                          <Form.Check type="checkbox" id="verbigeration is noted" label="Verbigeration is noted" />
                        </div>
                      </li>

                      <li className='icon-li'>
                        <h4 style={{ display: "inline" }}>Content of thought:</h4>
                        <div className="d-flex flex-wrap gap-3 mt-2">
                          <Form.Check type="checkbox" id="obession" label="Obsessions and contents of phobias" />
                          <Form.Check type="checkbox" id="ideas and delusions" label="Ideas and delusions of persecution" />
                          <Form.Check type="checkbox" id="reference" label="Reference" />
                          <Form.Check type="checkbox" id="grandeur" label="Grandeur" />
                          <Form.Check type="checkbox" id="love" label="Love" />
                          <Form.Check type="checkbox" id="jealousy" label="Jealousy (infidelity)" />
                          <Form.Check type="checkbox" id="guilt" label="Guilt" />
                          <Form.Check type="checkbox" id="nihilism" label="Nihilism" />
                          <Form.Check type="checkbox" id="poverty" label="Poverty" />
                          <Form.Check type="checkbox" id="Hypochondriacal symptoms" label="Hypochondriacal symptoms" />
                          <Form.Check type="checkbox" id="hopelessness" label="Hopelessness" />
                          <Form.Check type="checkbox" id="helplessness" label="Helplessness" />
                          <Form.Check type="checkbox" id="worthlessness" label="Worthlessness" />
                          <Form.Check type="checkbox" id="suicidal ideation" label="suicide should be explored" />
                          <Form.Check type="checkbox" id="Delusions of control" label="Delusions of control" />
                          <Form.Check type="checkbox" id="thought insertion" label="thought insertion" />
                          <Form.Check type="checkbox" id="thought withdrawal" label="thought withdrawal" />
                          <Form.Check type="checkbox" id="thought broadcasting" label="thought broadcasting" />
                          <Form.Check type="checkbox" id="Neologisms" label="Neologisms" />
                        </div> 
                      </li>
                    </ul>
                  </li>

                  <li className="tab-content tab-content-last typography">
                    <h1>Isaac Newton</h1>
                    <p>English physicist and mathematician who is widely regarded as one of the most influential scientists of all time...</p>
                    <p>Newton's Principia formulated the laws of motion and universal gravitation that dominated scientists' view of the physical universe for the next three centuries...</p>
                    <p className="text-right"><em>Find out more about Isaac Newton from <a href="http://en.wikipedia.org/wiki/Isaac_Newton" target="_blank" rel="noopener noreferrer">Wikipedia</a>.</em></p>
                  </li>
                </ul>
              </div>
              {/*/ tabs */}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default MSE_form
