import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await axios.post('http://localhost:8080/api/auth/register', { username, email, password });
      alert('Registration Successful');
      navigate('/login');
    } catch (error) {
      setError('Registration Failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: '#f8f9fa' }}>
      <div className="p-4 shadow rounded text-center" style={{ width: '350px', background: '#fff' }}>
       
        <h3 className="mb-3">Register</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <input 
          type="text" 
          className="form-control my-2" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          type="email" 
          className="form-control my-2" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          className="form-control my-2" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <input 
          type="password" 
          className="form-control my-2" 
          placeholder="Confirm Password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />
        <button className="btn btn-primary w-100 mt-2" onClick={handleRegister}>Sign Up</button>
        <p className="mt-2">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
