
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

    const [customAmount, setCustomAmount] = useState(10000);
    const [txnNumber, setTxnNumber] = useState('');

    const navigate = useNavigate();

    const getUpiLink = () => {
        const amount =
            selectedPlan === 'Rapid'
                ? 1000
                : selectedPlan === 'Evolution'
                ? 5000
                : customAmount;

        return `upi://pay?pa=supportleveragex@okicici&pn=LeverageX&am=${amount}&cu=INR`;
    };

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
            setShowPopup(true);
        }
    };

    const handlePayment = async () => {
        try {
            const userId = localStorage.getItem('userId');

            const response = await axios.post(
                'https://lx-backend-1-yo5e.onrender.com/api/plans/purchase',
                {
                    userId,
                    plan: selectedPlan,
                    amount: selectedPlan === 'Prime' ? customAmount : undefined,
                    txnNumber
                }
            );

            if (response.status === 200) {
                handleSuccess(response.data.msg);
                setShowPopup(false);
                setCurrentPlan(selectedPlan);

                if (selectedPlan === 'Rapid') {
                    setHasBoughtRapid(true);
                }

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

                <tbody>
                    {['Rapid', 'Evolution', 'Prime'].map((plan, index) => (
                        <tr key={index}>
                            <td>{plan}</td>

                            <td>
                                {plan === 'Rapid'
                                    ? '₹10,000'
                                    : plan === 'Evolution'
                                    ? '₹50,000'
                                    : 'Custom'}
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

                            <td>
                                {plan === 'Rapid' ? 'One Time' : 'Unlimited'}
                            </td>

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

            {/* POPUP */}
            {showPopup && (
                <div
                    className="popup-overlay"
                    onClick={() => setShowPopup(false)}
                >
                    <div
                        className="popup qr-background"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Pay for {selectedPlan}</h2>

                        <p>
                            Total: ₹ {
                                selectedPlan === 'Rapid'
                                    ? 1000
                                    : selectedPlan === 'Evolution'
                                    ? 5000
                                    : customAmount
                            }
                        </p>

                        {selectedPlan === 'Prime' && (
                            <input
                                type="number"
                                placeholder="Enter Amount (Min ₹10,000)"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                            />
                        )}

                        <img
                            src={qrcode1}
                            alt="QR"
                            onClick={() => window.location.href = getUpiLink()}
                            style={{ cursor: "pointer" }}
                        />

                        <button onClick={() => window.location.href = getUpiLink()}>
                            Pay via UPI
                        </button>

                        <input
                            type="text"
                            placeholder="Enter 8-digit Txn Number"
                            value={txnNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setTxnNumber(value);
                            }}
                        />

                        {txnNumber && txnNumber.length !== 8 && (
                            <p style={{ color: 'red', fontSize: '12px' }}>
                                Must be exactly 8 digits
                            </p>
                        )}

                        <button
                            onClick={handlePayment}
                            disabled={
                                (selectedPlan === 'Prime' && customAmount < 10000) ||
                                txnNumber.length !== 8
                            }
                        >
                            Done
                        </button>

                        <button onClick={() => setShowPopup(false)}>Cancel</button>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}

export default Plans;
