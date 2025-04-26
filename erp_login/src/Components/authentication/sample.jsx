





import React, { useState } from 'react';


const Login = () => {
  const [isLoginActive, setIsLoginActive] = useState(true);

//   const handleToggle = () => {
//     setIsLoginActive(!isLoginActive);
//   };

  return (
    <div className="hero">
      <div className="form-box">
        <div className="button-box">
          <div
            id="btn"
            style={{ left: isLoginActive ? '0px' : '130px' }}
          ></div>
          <button
            type="button"
            className="toggle-btn"
            onClick={() => setIsLoginActive(true)}
          >
            Log in
          </button>
          <button
            type="button"
            className="toggle-btn"
            onClick={() => setIsLoginActive(false)}
          >
            Register
          </button>
        </div>
        

        {isLoginActive ? (
          <form className="input-group">
            <input
              type="text"
              className="input-field"
              placeholder="User Name"
              required
            />
            <input
              type="password"
              className="input-field"
              placeholder="Enter Password"
              required
            />
            <div>
              <input type="checkbox" className="check-box" />
              <span>Remember Password</span>
            </div>
            <button type="submit" className="submit-btn">
              Log in
            </button>
          </form>
        ) : (
          <form className="input-group">
            <input
              type="text"
              className="input-field"
              placeholder="User Name"
              required
            />
            <input
              type="email"
              className="input-field"
              placeholder="Email Id"
              required
            />
            <input
              type="password"
              className="input-field"
              placeholder="Enter Password"
              required
            />
            <div>
              <input type="checkbox" className="check-box" />
              <span>Send me updates</span>
            </div>
            <button type="submit" className="submit-btn">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
