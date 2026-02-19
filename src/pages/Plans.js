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
    const [currentPlan, setCurrentPlan] = useState(null); // Store current plan
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token) {
            console.error("User is not logged in. Redirecting to login page.");
            navigate('/login');
            return;
        }

        const fetchUserPlanStatus = async () => {
            try {
                const response = await axios.get(`https://lx-backend-0mh6.onrender.com/api/plans/user-plan/${userId}`);
                if (response.data) {
                    setHasBoughtRapid(response.data.hasBoughtRapidPlan);  // Set Rapid plan status
                    setCurrentPlan(response.data.plan);  // Set current plan
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
            const response = await axios.post('https://lx-backend-0mh6.onrender.com/api/plans/purchase', { userId, plan: selectedPlan });

            if (response.status === 200) {
                handleSuccess(response.data.msg);
                setShowPopup(false);
                setCurrentPlan(selectedPlan); // Set the current plan after purchase
                if (selectedPlan === 'Rapid') {
                    setHasBoughtRapid(true);
                    navigate('/watchlist1');
                } else if (selectedPlan === 'Evolution' || selectedPlan === 'Prime') {
                    navigate('/watchlist1');
                }
            }
        }
        catch (error) {
                handleError(error.response?.data?.msg || 'Welcome to LeverageX Team ✨');
                navigate('/watchlist1');
           }
    };

    return (
        <div className="plans-container">
            <h1 className="plans-title">Membership Plans</h1>
            {/* <p>Current Plan: {currentPlan ? currentPlan : 'No Plan Selected'}</p>  */}

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
                        <p>Perfect for traders who want to start small and fast. For just Rs 1,000, you can join our Rapid Plan and start trading with leveraged capital. This plan is ideal for newer traders looking to test the waters or experienced traders who want quick access to funds with a low entry barrier.</p>
                    </div>
                    <div className='amt'>
                       <h3>Evolution Plan (₹ 5,000)</h3>
                        <p>Designed for those who are ready to take their trading to the next level, the Evolution Plan gives you a larger amount of capital and more flexibility. With an affordable Rs 5,000 upfront cost, this plan is ideal for traders who are confident in their strategies and are looking to grow their trading portfolios.</p>
                    </div>
                    <div className='amt'>
                        <h3>Prime Plan (₹ 10,000)</h3>
                        <p>For serious traders aiming to trade with large amounts of capital and maximize their profit potential, the Prime Plan offers the highest funding level. At Rs 10,000, this plan is built for experienced traders who want to significantly scale up their operations and have access to substantial funding. If you're ready to trade like a pro, the Prime Plan is for you.</p>
                    </div>
                </div>

            </section>


            {showPopup && (
                <div className="popup-overlay ">
                    <div className="popup qr-background">
                        <h2 className='qr-h2'>Pay for {selectedPlan}</h2>
                        <p className='qr-p'>Total:  ₹ {selectedPlan === 'Rapid' ? '1000' : selectedPlan === 'Evolution' ? '5000' : '10,000'} /-</p>
                        <p className='pay-here'>Pay Here</p>
                        <img src={qrcode1} alt="QR Code" className="qr-image" />

                        <p className='qr-p qr-pq'>fundleveragex-2@okicici</p>
                        <img src={upiImg} alt="upi-logo" className='upi-img' />
                        <input placeholder='Enter Txn Number' type="number" className="input-num" required />
                        <div className="popup-actions">
                            <button className="done-btn done-bttn" onClick={handlePayment}>Done</button>
                            <button className="cancel-btn" onClick={() => setShowPopup(false)}>X</button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default Plans;
