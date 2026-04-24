
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

    const [txnNumber, setTxnNumber] = useState('');

    const navigate = useNavigate();

    // ✅ UPI LINK ONLY FOR RAPID
    const getUpiLink = () => {
        const amount = 1000;
        return `upi://pay?pa=leveragexfundon-3@oksbi&pn=LeverageX&am=${amount}&cu=INR`;
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
                { userId, plan: selectedPlan, txnNumber }
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
                                <td>{plan === 'Rapid' ? '₹10,000' : plan === 'Evolution' ? '₹50,000' : '₹1,00,000'}</td>
                                <td>5 Days</td>
                                <td>10X</td>
                                <td>{plan === 'Rapid' ? '₹1,000' : plan === 'Evolution' ? '₹5,000' : '₹10,000'}</td>
                                <td>{plan === 'Rapid' ? 'One Time' : 'Unlimited'}</td>

                                <td>
                                    <button
                                        className={hasBoughtRapid && plan === 'Rapid' ? "disabled-btn" : "buy-now-btn"}
                                        onClick={() => buyPlan(plan)}
                                        disabled={hasBoughtRapid && plan === 'Rapid'}
                                    >
                                        {hasBoughtRapid && plan === 'Rapid' ? 'Plan Used' : 'Buy Now'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <section className='section-plan'>
                <h2>Choose Your Plan</h2>
                <div className='plan-amt'>
                    <div className='amt'>
                        <h3>Rapid Plan (₹ 1,000)</h3>
                        <p>Perfect for traders who want to start small and fast.</p>
                    </div>
                    <div className='amt'>
                        <h3>Evolution Plan (₹ 5,000)</h3>
                        <p>Take your trading to the next level.</p>
                    </div>
                    <div className='amt'>
                        <h3>Prime Plan (₹ 10,000)</h3>
                        <p>For serious traders with high capital.</p>
                    </div>
                </div>
            </section>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup qr-background">

                        <h2 className='qr-h2'>Pay for {selectedPlan}</h2>

                        <p className='qr-p'>
                            Total: ₹ {selectedPlan === 'Rapid' ? '1000' : selectedPlan === 'Evolution' ? '5000' : '10,000'} /-
                        </p>

                        <p className='pay-here'>Pay Here</p>

                        {/* ✅ QR CLICK ONLY FOR RAPID */}
                        <img
                            src={qrcode1}
                            alt="QR Code"
                            className="qr-image"
                            style={{ cursor: selectedPlan === 'Rapid' ? "pointer" : "not-allowed" }}
                            onClick={() => {
                                if (selectedPlan === 'Rapid') {
                                    window.location.href = getUpiLink();
                                }
                            }}
                        />


                        <p className='qr-p qr-pq'>leveragexfundon@okaxis</p>

                        <p className='qr-p qr-pq'>leveragexfundon@okhdfcbank</p>

                        <img src={upiImg} alt="upi-logo" className='upi-img' />

                        {/* ✅ 12 DIGIT TXN INPUT */}
                        <input
                            type="text"
                            placeholder="Enter 12-digit Txn Number"
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
                                disabled={txnNumber.length !== 12}
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
