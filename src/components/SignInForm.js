import React, { useState } from 'react';
import axios from 'axios';

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
            console.log(response.data); // Log the response from the server
        } catch (error) {
            console.error(error);
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

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={username} onChange={handleUsernameChange} placeholder="Username" />
            <input type="email" value={email} onChange={handleEmailChange} placeholder="Email" />
            <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default SignInForm;
