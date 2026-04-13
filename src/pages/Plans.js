import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import "../styles/Plans.css";

import qrcode1 from "../Assets/qrCode.jpg";
import upiImg from "../Assets/upiImg.png";

function Plans() {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [hasBoughtRapid, setHasBoughtRapid] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [customAmount, setCustomAmount] = useState(""); // 🔥 for Prime

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserPlanStatus = async () => {
            try {
                const response = await axios.get(
                    `https://lx-backend-1-yo5e.onrender.com/api/plans/user-plan/${userId}`
                );
                if (response.data) {
                    setHasBoughtRapid(response.data.hasBoughtRapidPlan);
                    setCurrentPlan(response.data.plan);
                }
            } catch (error) {
                console.error("Error fetching user plan status:", error);
            }
        };

        fetchUserPlanStatus();
    }, [navigate]);

    const buyPlan = (plan) => {
        if (plan === 'Rapid' && hasBoughtRapid) {
            alert('You cannot buy the Rapid plan again!');
        } else {
            setSelectedPlan(plan);
            setCustomAmount(""); // reset for Prime
            setShowPopup(true);
        }
    };

    // 🔥 Dynamic UPI link
    const getUpiLink = () => {
        let amount = 0;

        if (selectedPlan === 'Rapid') {
            amount = 1000;
        } else if (selectedPlan === 'Evolution') {
            amount = 5000;
        } else if (selectedPlan === 'Prime') {
            amount = customAmount;
        }

        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        return `upi://pay?pa=supportleveragex@okicici&pn=LeverageX&am=${amount}&cu=INR`;
    };

    const handlePayment = async () => {
        try {
            const userId = localStorage.getItem('userId');

            const response = await axios.post(
                'https://lx-backend-1-yo5e.onrender.com/api/plans/purchase',
                { userId, plan: selectedPlan }
            );

            if (response.status === 200) {
                handleSuccess(response.data.msg);
                setShowPopup(false);
                setCurrentPlan(selectedPlan);

                navigate('/watchlist1');
            }
        } catch (error) {
            handleError(error.response?.data?.msg || 'Welcome to LeverageX Team ✨');
            navigate('/watchlist1');
        }
    };

    return (
        <div className="plans-container">
            <h1 className="plans-title">Membership Plans</h1>

            <div className="plans-container">
                <table className="plans-table">
                    <thead>
                        <tr>
                            <th>Plan's</th>
                            <th>Trading Balance</th>
                            <th>Minimum Trading Days</th>
                            <th>Margin</th>
                            <th>Plan Cost</th>
                            <th>Life Cycle</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className='membership-plan'>
                        {['Rapid', 'Evolution', 'Prime'].map((plan, index) => (
                            <tr key={index}>
                                <td>{plan}</td>
                                <td>
                                    {plan === 'Rapid'
                                        ? '₹10,000'
                                        : plan === 'Evolution'
                                        ? '₹50,000'
                                        : '₹Custom'}
                                </td>
                                <td>5 Days</td>
                                <td>10X</td>
                                <td>
                                    {plan === 'Rapid'
                                        ? '₹1,000'
                                        : plan === 'Evolution'
                                        ? '₹5,000'
                                        : 'Custom'}
                                </td>
                                <td>{plan === 'Rapid' ? 'One Time' : 'Unlimited'}</td>
                                <td>
                                    <button
                                        className={
                                            hasBoughtRapid && plan === 'Rapid'
                                                ? "disabled-btn"
                                                : "buy-now-btn"
                                        }
                                        onClick={() => buyPlan(plan)}
                                        disabled={hasBoughtRapid && plan === 'Rapid'}
                                    >
                                        {hasBoughtRapid && plan === 'Rapid'
                                            ? 'Plan Used'
                                            : 'Buy Now'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup qr-background">
                        <h2 className='qr-h2'>Pay for {selectedPlan}</h2>

                        {/* ✅ Amount Display */}
                        <p className='qr-p'>
                            Total: ₹ {
                                selectedPlan === 'Rapid'
                                    ? 1000
                                    : selectedPlan === 'Evolution'
                                    ? 5000
                                    : customAmount || 0
                            } /-
                        </p>

                        {/* 🔥 Input for Prime only */}
                        {selectedPlan === 'Prime' && (
                            <input
                                type="number"
                                placeholder="Enter amount for Prime"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                className="input-num"
                            />
                        )}

                        <p className='pay-here'>Pay Here</p>

                        {/* 🔥 Clickable QR */}
                        <img
                            src={qrcode1}
                            alt="QR Code"
                            className="qr-image"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                const link = getUpiLink();
                                if (link) window.location.href = link;
                            }}
                        />

                        <p className='qr-p'>supportleveragex@okicici</p>
                        <img src={upiImg} alt="upi-logo" className='upi-img' />

                        {/* ⚠️ Important instruction */}
                        <p style={{ color: "red", fontSize: "14px" }}>
                            ⚠️ For payments above ₹2000, use Google Pay / PhonePe (WhatsApp may fail)
                        </p>

                        <input
                            placeholder='Enter Txn Number'
                            type="number"
                            className="input-num"
                            required
                        />

                        <div className="popup-actions">
                            <button className="done-btn" onClick={handlePayment}>
                                Done
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={() => setShowPopup(false)}
                            >
                                X
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}

export default Plans;
