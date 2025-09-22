import React, { useState } from "react";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

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
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // TODO: Implement actual signup logic
      console.log("Signup data:", formData);
      alert("Account created successfully!");
      onSwitchToLogin?.();
    }
  };

  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth signup
    console.log("Google signup initiated");
    alert("Google signup feature coming soon!");
  };

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="Signup illustration" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="Company Logo" />
          </div>
          <div className="login-center">
            <h2>Create Your Account</h2>
            <p>Engaging Citizens, Enriching Lives Daily</p>
            
            <form onSubmit={handleSignup}>
              <div className="input-group">
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="Full Name" 
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

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
                    placeholder="Create Password" 
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

              <div className="input-group">
                <div className="pass-input-div">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    name="confirmPassword"
                    placeholder="Confirm Password" 
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  {showConfirmPassword ? 
                    <FaEyeSlash 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                      className="password-toggle"
                    /> : 
                    <FaEye 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                      className="password-toggle"
                    />
                  }
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="terms-checkbox" required />
                  <label htmlFor="terms-checkbox">
                    I agree to the <a href="#" className="terms-link">Terms & Conditions</a>
                  </label>
                </div>
              </div>
              
              <div className="login-center-buttons">
                <button type="submit" className="primary-btn">
                  Create Account
                </button>
                <button type="button" onClick={handleGoogleSignup} className="google-btn">
                  <img src={GoogleSvg} alt="Google" />
                  Sign up with Google
                </button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Already have an account? 
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault(); 
                onSwitchToLogin?.();
              }}
              className="switch-link"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;