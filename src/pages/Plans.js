
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

    const [customAmount, setCustomAmount] = useState(10000); // Prime amount
    const [txnNumber, setTxnNumber] = useState(''); // ✅ Txn number

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
                    txnNumber // ✅ send txn number
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
            </div>

            {/* PLAN INFO */}
            <section className='section-plan'>
                <h2>Choose Your Plan</h2>

                <div className='plan-amt'>
                    <div className='amt'>
                        <h3>Rapid Plan (₹ 1,000)</h3>
                        <p>Start small and fast with leveraged capital.</p>
                    </div>

                    <div className='amt'>
                        <h3>Evolution Plan (₹ 5,000)</h3>
                        <p>Grow your trading with more capital.</p>
                    </div>

                    <div className='amt'>
                        <h3>Prime Plan (Custom ₹10,000+)</h3>
                        <p>Enter your own amount and scale trading.</p>
                    </div>
                </div>
            </section>

            {/* POPUP */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup qr-background">

                        <h2 className='qr-h2'>Pay for {selectedPlan}</h2>

                        <p className='qr-p'>
                            Total: ₹ {
                                selectedPlan === 'Rapid'
                                    ? 1000
                                    : selectedPlan === 'Evolution'
                                    ? 5000
                                    : customAmount
                            } /-
                        </p>

                        {/* Prime Amount Input */}
                        {selectedPlan === 'Prime' && (
                            <input
                                type="number"
                                className="input-num"
                                placeholder="Enter Amount (Min ₹10,000)"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                min={10000}
                            />
                        )}

                        <p className='pay-here'>Pay Here</p>

                        <img
                            src={qrcode1}
                            alt="QR Code"
                            className="qr-image"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                window.location.href = getUpiLink();
                            }}
                        />

                        <button
                            onClick={() => {
                                window.location.href = getUpiLink();
                            }}
                            className="buy-now-btn"
                        >
                            Pay via UPI App
                        </button>

                        <p className='qr-p qr-pq'>supportleveragex@okicici</p>
                        <img src={upiImg} alt="upi-logo" className='upi-img' />

                        {/* Txn Number Input */}
                        <input
                            type="text"
                            placeholder="Enter Txn Number"
                            className="input-num"
                            value={txnNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setTxnNumber(value);
                            }}
                        />

                        <div className="popup-actions">
                            <button
                                className="done-btn done-bttn"
                                onClick={handlePayment}
                                disabled={
                                    (selectedPlan === 'Prime' && customAmount < 10000) ||
                                    txnNumber.length !== 12
                                }
                            >
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
