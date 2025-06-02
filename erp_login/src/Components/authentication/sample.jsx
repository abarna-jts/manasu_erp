import React, { useState } from 'react';

function Sample() {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="container">
      {/* Step Indicator */}
      <div className="step-indicator">
        <div className={`step ${step === 1 ? 'active' : ''}`}>1</div>
        <div className={`step ${step === 2 ? 'active' : ''}`}>2</div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="form-step">
          <h3>Step 1</h3>
          <input type="text" placeholder="Enter First Name" />
          <button className="btn" onClick={nextStep}>Next</button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="form-step">
          <h3>Step 2</h3>
          <input type="email" placeholder="Enter Email" />
          <button className="btn" onClick={prevStep}>Back</button>
          <button className="btn" style={{ marginLeft: '10px' }}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default Sample;
