import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

//css
import "../styles/Login.css";

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError("Email and password are required");
        }
        try {
            const url = `https://lx-backend-k6r1.onrender.com/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginInfo),
            });

            const result = await response.json();

            const { success, message, jwtToken, fullName, userId } = result;  // Include _id
            if (success) {
                handleSuccess(message);
                localStorage.setItem("token", jwtToken);
                localStorage.setItem("loggedInUser", fullName); // Store fullName in localStorage
                localStorage.setItem("userId", userId);  // Store userId in localStorage
                localStorage.setItem("userEmail", email);  // Store email in localStorage
                setTimeout(() => {
                    navigate("/plans");
                }, 1000);
            } else {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={handleLogin} className="login-form">
                <div className="input-data">
                    <label htmlFor="email">Email</label>
                    <input
                        onChange={handleChange}
                        type="email"
                        name="email"
                        placeholder="Enter your email..."
                        value={loginInfo.email}
                    />
                </div>
                <div className="input-data">
                    <label htmlFor="password">Password</label>
                    <input
                        onChange={handleChange}
                        type="password"
                        name="password"
                        placeholder="Enter your password..."
                        value={loginInfo.password}
                    />
                </div>
                <button type="submit" className="login-button">
                    Login
                </button>
                <span className="redirect-signup">
                    Doesn't have an account? <Link to="/signup">Signup</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Login;
