import React, { useState } from 'react';
import './login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic (e.g., API call for authentication)
        console.log('Email:', email, 'Password:', password);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2 className="login-title">LOGIN</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input  type="email"id="email"placeholder="Enter email"value={email}onChange={(e) => setEmail(e.target.value)}required/>
                    </div>
                    <div className="form-group">  
                        <input  type="password"id="password"placeholder="Enter password"value={password}onChange={(e) => setPassword(e.target.value)}required/>
                    </div>
                    <button type="submit" className="login-button">Sign In</button>
                    <div className='foot'>
                        <input type="checkbox" />
                        <h5>Terms & conditions</h5>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
