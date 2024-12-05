import React, { useState } from "react";
import Axios from "axios";
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook



const Register = () => {
    // State to store username, email, profile, password, and registration status
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [profile, setProfile] = useState('');
    const [password, setPassword] = useState('');
    const [registerStatus, setRegisterStatus] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate hook


    // Function to handle form submission
    const handleRegister = async (e) => {
        e.preventDefault(); // Prevent page reload on form submit

        try {
            // Send POST request to backend with registration credentials
            const response = await Axios.post(' https://online-voting-platform-4iqo.onrender.com/users/register', {
                username,
                email,
                profile,
                password
            });

            const data = response.data;

            // Handle successful registration
            if (data.message === "User registered successfully") {
                setRegisterStatus(`You registered successfully, ${username}  Now "LOG IN"`);
            } else {
                setRegisterStatus('Error registering user');
            }
        } catch (error) {
            setRegisterStatus('An error occurred. Please try again later.');
        }
    };

    const handleRedirectToLogin = () => {
        navigate('/login'); // Redirect to the register page
    };

    return (
        <div>
            <h2>Register, New Account</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Profile:</label>
                    <input
                        type="text"
                        placeholder="Enter profile"
                        value={profile}
                        onChange={(e) => setProfile(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Register</button>
            </form>

            <div id="registerStatus">{registerStatus}</div>
            <div>
                <button onClick={handleRedirectToLogin} >Login</button>
            </div>
    </div >
  );
};

export default Register;
