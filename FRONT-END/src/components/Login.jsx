import React, { useState } from "react";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ onSwitchToSignup }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // TODO: Implement actual login logic
      console.log("Login data:", { ...formData, rememberMe });
      alert("Login successful!");
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth login
    console.log("Google login initiated");
    alert("Google login feature coming soon!");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // TODO: Implement forgot password functionality
    alert("Forgot password feature coming soon!");
  };

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="Login illustration" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="Company Logo" />
          </div>
          <div className="login-center">
            <h2>Welcome Back!</h2>
            <p>Sign in to continue your multilingual conversations</p>
            
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="input-group">
                <div className="pass-input-div">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    placeholder="Password" 
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? 'error' : ''}
                  />
                  {showPassword ? 
                    <FaEyeSlash 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="password-toggle"
                    /> : 
                    <FaEye 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="password-toggle"
                    />
                  }
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="login-center-options">
                <div className="remember-div">
                  <input 
                    type="checkbox" 
                    id="remember-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-checkbox">
                    Remember me for 30 days
                  </label>
                </div>
                <a href="#" onClick={handleForgotPassword} className="forgot-pass-link">
                  Forgot password?
                </a>
              </div>
              
              <div className="login-center-buttons">
                <button type="submit" className="primary-btn">
                  Sign In
                </button>
                <button type="button" onClick={handleGoogleLogin} className="google-btn">
                  <img src={GoogleSvg} alt="Google" />
                  Continue with Google
                </button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Don't have an account? 
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault(); 
                onSwitchToSignup?.();
              }}
              className="switch-link"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
