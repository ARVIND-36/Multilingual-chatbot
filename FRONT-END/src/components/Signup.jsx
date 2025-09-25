import React, { useState } from "react";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authAPI, tokenUtils } from '../services/api';

const Signup = ({ onSwitchToLogin, onSignupSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    aadhar_no: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.aadhar_no.trim()) {
      newErrors.aadhar_no = 'Aadhar number is required';
    } else if (!/^\d{12}$/.test(formData.aadhar_no)) {
      newErrors.aadhar_no = 'Aadhar number must be exactly 12 digits';
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

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        const { confirmPassword, ...signupData } = formData;
        const response = await authAPI.signup(signupData);
        
        if (response.success) {
          // Store token and user data
          tokenUtils.setToken(response.token);
          tokenUtils.setUser(response.user);
          
          alert("Account created successfully!");
          onSignupSuccess?.(response.user);
        }
      } catch (error) {
        console.error('Signup error:', error);
        if (error.errors) {
          // Handle validation errors from backend
          const backendErrors = {};
          error.errors.forEach(err => {
            backendErrors[err.path || err.param] = err.msg;
          });
          setErrors(backendErrors);
        } else {
          alert(error.message || 'Failed to create account. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
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
                  name="username"
                  placeholder="Username" 
                  value={formData.username}
                  onChange={handleInputChange}
                  className={errors.username ? 'error' : ''}
                  disabled={isLoading}
                />
                {errors.username && <span className="error-message">{errors.username}</span>}
              </div>

              <div className="input-group">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  disabled={isLoading}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="input-group">
                <input 
                  type="text" 
                  name="aadhar_no"
                  placeholder="Aadhar Number (12 digits)" 
                  value={formData.aadhar_no}
                  onChange={handleInputChange}
                  className={errors.aadhar_no ? 'error' : ''}
                  disabled={isLoading}
                  maxLength="12"
                />
                {errors.aadhar_no && <span className="error-message">{errors.aadhar_no}</span>}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                <button type="submit" className="primary-btn" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
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