import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

// css
import "../styles/Signup.css";

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        fullName: '',
        email: '',      
        mobile: '',
        aadhaar: '',
        pan: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { fullName, email, mobile, aadhaar, pan, password } = signupInfo;

        // Basic frontend validation
        if (!fullName || !email || !mobile || !aadhaar || !pan || !password) {
            return handleError('All fields are required');
        }

        try {
            const url = `https://leveragexfund-4rz6.onrender.com/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });

            // Check for any non-200 response
            if (!response.ok) {
                const errorResponse = await response.json();
                const errorMsg = errorResponse.error?.details[0]?.message || errorResponse.message;
                return handleError(errorMsg);
            }

            const result = await response.json();
            const { success, message } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                handleError(result.message || "Something went wrong.");
            }
        } catch (err) {
            handleError("Internal Server Error. Please try again later.");
        }
    };

    return (
        <div className='signup'>
            <h1>Signup</h1>
            <form onSubmit={handleSignup} className='signup-form'>
                <div className='input-data'>
                    <label htmlFor='fullName'>Full Name</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='fullName'
                        placeholder='Enter your full name...'
                        value={signupInfo.fullName}
                    />
                </div>
                <div className='input-data'>
                    <label htmlFor='email'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={signupInfo.email}
                    />
                </div>
                <div className='input-data'>
                    <label htmlFor='mobile'>Mobile</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='mobile'
                        placeholder='Enter your mobile number...'
                        value={signupInfo.mobile}
                    />
                </div>
                <div className='input-data'>
                    <label htmlFor='aadhaar'>Aadhaar</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='aadhaar'
                        placeholder='Enter your Aadhaar number...'
                        value={signupInfo.aadhaar}
                    />
                </div>
                <div className='input-data'>
                    <label htmlFor='pan'>PAN</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='pan'
                        placeholder='Enter your PAN number...'
                        value={signupInfo.pan}
                    />
                </div>
                <div className='input-data'>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={signupInfo.password}
                    />
                </div>
                <button className='signup-button' type='submit'>Signup</button>
                <span className='redirect-login'>Already have an account ?
                    <Link to="/login">Login</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Signup;
