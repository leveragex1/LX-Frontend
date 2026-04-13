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
    const [customAmount, setCustomAmount] = useState("");

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
            setCustomAmount("");
            setShowPopup(true);
        }
    };

    const getUpiLink = () => {
        let amount = 0;

        if (selectedPlan === 'Rapid') amount = 1000;
        else if (selectedPlan === 'Evolution') amount = 5000;
        else if (selectedPlan === 'Prime') amount = customAmount;

        if (!amount || Number(amount) <= 0) {
            alert("Please enter valid amount");
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
            handleError(error.response?.data?.msg || 'Welcome to LeverageX ✨');
            navigate('/watchlist1');
        }
    };

    return (
        <div className="plans-container">
            <h1 className="plans-title">Membership Plans</h1>

            <table className="plans-table">
                <thead>
                    <tr>
                        <th>Plan</th>
                        <th>Balance</th>
                        <th>Days</th>
                        <th>Margin</th>
                        <th>Cost</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {['Rapid', 'Evolution', 'Prime'].map((plan, i) => (
                        <tr key={i}>
                            <td>{plan}</td>
                            <td>{plan === 'Rapid' ? '₹10,000' : plan === 'Evolution' ? '₹50,000' : 'Custom'}</td>
                            <td>5</td>
                            <td>10X</td>
                            <td>{plan === 'Rapid' ? '₹1,000' : plan === 'Evolution' ? '₹5,000' : 'Custom'}</td>

                            <td>
                                <button
                                    className={hasBoughtRapid && plan === 'Rapid' ? "disabled-btn" : "buy-now-btn"}
                                    onClick={() => buyPlan(plan)}
                                    disabled={hasBoughtRapid && plan === 'Rapid'}
                                >
                                    {hasBoughtRapid && plan === 'Rapid' ? 'Used' : 'Buy Now'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 🔥 PROFESSIONAL PAYMENT POPUP */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">

                        {/* Header */}
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h3>LeverageX Payment</h3>
                            <span style={{ cursor: "pointer" }} onClick={() => setShowPopup(false)}>✕</span>
                        </div>

                        {/* Plan */}
                        <p style={{ marginTop: "5px", color: "gray" }}>
                            {selectedPlan} Plan
                        </p>

                        {/* Amount */}
                        <div style={{
                            background: "#f5f5f5",
                            padding: "15px",
                            borderRadius: "10px",
                            marginTop: "10px"
                        }}>
                            <p>Total Amount</p>
                            <h2>
                                ₹{
                                    selectedPlan === 'Rapid'
                                        ? 1000
                                        : selectedPlan === 'Evolution'
                                        ? 5000
                                        : customAmount || 0
                                }
                            </h2>
                        </div>

                        {/* Prime Input */}
                        {selectedPlan === 'Prime' && (
                            <input
                                type="number"
                                placeholder="Enter amount"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                style={{ width: "100%", padding: "10px", marginTop: "10px" }}
                            />
                        )}

                        {/* Pay Button */}
                        <button
                            onClick={() => {
                                const link = getUpiLink();
                                if (link) window.location.href = link;
                            }}
                            style={{
                                width: "100%",
                                padding: "12px",
                                background: "#0f9d58",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                marginTop: "10px",
                                cursor: "pointer"
                            }}
                        >
                            Pay via UPI App
                        </button>

                        <p style={{ margin: "10px 0" }}>OR</p>

                        {/* QR */}
                        <div style={{ textAlign: "center" }}>
                            <img src={qrcode1} alt="QR" style={{ width: "150px" }} />
                            <p>supportleveragex@okicici</p>
                        </div>

                        <img src={upiImg} alt="upi" style={{ width: "120px", marginTop: "10px" }} />

                        {/* Txn */}
                        <input
                            placeholder="Enter Transaction ID"
                            style={{ width: "100%", padding: "10px", marginTop: "10px" }}
                        />

                        <p style={{ color: "red", fontSize: "12px" }}>
                            Use Google Pay / PhonePe above ₹2000
                        </p>

                        {/* Confirm */}
                        <button
                            onClick={handlePayment}
                            style={{
                                width: "100%",
                                padding: "12px",
                                background: "black",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                marginTop: "10px",
                                cursor: "pointer"
                            }}
                        >
                            Confirm Payment
                        </button>

                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}

export default Plans;
