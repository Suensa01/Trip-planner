import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Nav from 'react-bootstrap/Nav';
import { useAuth } from '../../Context/AuthContext';
import './login.css';

function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agree, setAgree] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!agree) {
            setError('You must agree to the terms and conditions.');
            return;
        }

        setSubmitting(true);
        try {
            if (isRegister) {
                const user = await register(name, email, password, 'TRAVELER');
                setSuccess(`Account created for ${user?.name || email}! Redirecting...`);
            } else {
                const user = await login(email, password);
                setSuccess(`Signed in as ${user?.name || email}! Redirecting...`);
            }

            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (err) {
            setError(err.message || 'Authentication failed. Please check credentials.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card p-4 p-sm-5 text-start">
                <Nav className="auth-nav-tabs justify-content-center mb-4 border-bottom border-secondary border-opacity-25">
                    <Nav.Item>
                        <Nav.Link 
                            className={!isRegister ? 'active' : ''} 
                            onClick={() => { setIsRegister(false); setError(''); }}
                        >
                            Sign In
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link 
                            className={isRegister ? 'active' : ''} 
                            onClick={() => { setIsRegister(true); setError(''); }}
                        >
                            Create Account
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                <h3 className="fw-bold text-light text-center mb-4">
                    {isRegister ? 'Join Quest Travel' : 'Welcome Back'}
                </h3>

                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                {success && <Alert variant="success" className="py-2 small">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                    {isRegister && (
                        <Form.Group className="mb-3">
                            <Form.Label className="small text-light">Full Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter your name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label className="small text-light">Email address</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="name@example.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="small text-light">Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Enter password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Check 
                            type="checkbox"
                            id="terms-check"
                            label={<span className="small text-light opacity-75">I agree to Quest Travel Terms & Conditions</span>}
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                        />
                    </Form.Group>

                    <Button variant="success" type="submit" disabled={submitting} className="w-100 py-2 fw-bold text-uppercase mb-3">
                        {submitting ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default Login;
