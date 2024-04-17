import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const SignInForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            username: username,
            email: email,
            password: password
        };

        try {
            const response = await axios.post('http://localhost:5000/v1/post/signup', formData);
            if (response.status === 201) {
                handleSignInClick();
           } 
            console.log(response.data); // Log the response from the server
            
        } catch (error) {
            if (error.response.status === 400) {
                console.log("Email already in use");
                // Handle case where email is already in use (display error message to user, clear form fields, etc.)
            } else {
                console.error(error);
                // Handle other error cases
            }
        }
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const navigate = useNavigate();

    
    const handleSignInClick = () => {
        navigate('/signin');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <div style={{ maxWidth: '400px', padding: '20px', border: '2px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={username} onChange={handleUsernameChange} placeholder="Username" style={{ marginBottom: '10px', padding: '5px', width: '100%' }} />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={handleEmailChange} placeholder="Email" style={{ marginBottom: '10px', padding: '5px', width: '100%' }} />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={handlePasswordChange} placeholder="Password" style={{ marginBottom: '10px', padding: '5px', width: '100%' }} />

                    <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px', border: 'none', cursor: 'pointer', width: '100%' }}>Sign Up</button>
                </form>
                <div  style={{fontSize:15, display: 'flex', justifyContent: 'flex-end',cursor:'pointer' }} onClick={handleSignInClick} >Log In</div>
              
            </div>
        </div>
    );
};

export default SignInForm;
