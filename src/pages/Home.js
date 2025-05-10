import React from 'react';
import '../styles/Home.css';
import homeImage from "../Assets/home page.png";
import featureImage from "../Assets/fetch page.png";
import ProgramImage from "../Assets/home page2222.png"

const Home = () => {
    return (
        <div className="home-container">

            {/* Header Section */}
            <header className="header">
                <div className="header-content">
                    <h1>"Fast Payouts in 5 Days:<br /> Affordable Plans, High Leverage!"</h1>
                    <p>
                        - Up to ₹1,00,000 Trading Balance per user<br />
                        - Real-Money payouts on Trading Profit<br />
                        - No Payment for Losses<br />
                        - forex option Trading in INR
                    </p>
                    {/* <div className="header-buttons">
                        <button className="btn know-more">Know More</button>
                        <button className="btn buy-now">Buy Now</button>
                    </div> */}
                </div>
                <div className="header-image">
                    <img src={homeImage} alt="Trading App" />
                </div>
            </header>

            {/* Features Section */}
            <section className="features">
                <div className="feature-item">
                    <h3>24/7</h3>
                    <p>On-site Chat Support</p>
                </div>
                <div className="feature-item">
                    <h3>50%</h3>
                    <p>Payout Profit Share</p>
                </div>
                <div className="feature-item">
                    <h3>5 Days</h3>
                    <p>Each Trading Cycle</p>
                </div>
                <div className="feature-item">
                    <h3>No Limit</h3>
                    <p>Real-Money Payouts</p>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <h2>How It Works?</h2>
                <div className="steps">
                    <div className="step">
                        <h3>Setting Up</h3>
                        <p>Select the best Membership Plan for your trading style, add to cart and complete the transaction.</p>
                    </div>
                    <div className="step">
                        <h3>Trade</h3>
                        <p>Receive account login details via email within 24-48 hours of payment. Start trading!</p>
                    </div>
                    <div className="step">
                        <h3>Real-Money Payout</h3>
                        <p>Request Real-Money payouts on WebTrader/Mobile App after hitting profit targets.</p>
                    </div>
                </div>
            </section>

            {/* Membership Plans Section */}
            <section className="membership-plans" id="plans">
                <h2>Membership Plans</h2>
                {/* <div className="plan-tabs">
                    <button className="tab active">Evaluation</button>
                    <button className="tab">Rapid</button>
                </div> */}
                <div className="plans-container">
                <table className="plans-table">
                    <thead>
                        <tr>
                            <th>PLAN'S</th>
                            <th>TRADING BALANCE</th>
                            <th>Minimum Trading Days</th>
                            <th>Margin</th>
                            <th>PLAN COST</th>
                            <th>Life Cycle</th>
                            <th>MAX LOSS</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Rapid</td>
                            <td>₹10,000</td>
                            <td>5 Days</td>
                            <td>10X</td>
                            <td>₹1,000</td>
                            <td>One Times</td>
                            <td>10%</td>
                           
                        </tr>
                        <tr>
                            <td>Evolution</td>
                            <td>₹50,000</td>
                            <td>5 Days</td>
                            <td>10X</td>
                            <td>₹5,000</td>
                            <td>Unlimited</td>
                            <td>10%</td>
                        </tr>
                        <tr>
                            <td>Prime</td>
                            <td>₹1,00,000</td>
                            <td>5 Days</td>
                            <td>10X</td>
                            <td>₹10,000</td>
                            <td>Unlimited</td>
                            <td>10%</td>
                           
                        </tr>
                    </tbody>
                </table>
                </div>
            </section>

            {/* Features */}
            <section className="features-section">
                <h2>Features</h2>
                <div className='incline-block'> 
                    <div className='feature-image'>
                    <img className='features-img' src={featureImage} alt="Trading App" />
                    </div>
                    <div className='feature'>
                        <p>Real-Money Payout on Profits</p>
                        <p>No Payment for Losses</p>
                        <p>Unlimited Accounts per User</p>
                        <p>No Upper Limit on Real-Money Payouts</p>
                        <p>Mystery Rewards for Consistent Traders</p>

                    </div>
                </div>
            </section>
            
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
                        <p>For serious traders aiming to trade with large amounts of capital and maximize their profit potential, the Prime Plan offers the highest funding level. At Rs 10,000, this plan is built for experienced traders who want to significantly scale up their operations and have access to substantial funding. If you’re ready to trade like a pro, the Prime Plan is for you.</p>
                    </div>
                </div>

            </section>


            <section className='section-fund'>
                    <h2 className='linear-gd'>Join Our Community of Funded Traders</h2>
                    <div className='funded' >
                        <h3 className='color'>Thousands of traders have already joined our funded trader program, taking their trading careers to the next level. Whether you're aiming to scale up your trading or are just looking for a way to access more capital, we're here to help you succeed</h3>

                     </div>
            </section>

            <section className='section-program'>
                    <h2 className='join-program'>Why Join Our Program?</h2>
                <div className='incline-block'>
                    <div className='program'>
                        <h3>Plans for Every Trader: </h3>
                        <p>Whether you’re just starting out or are an experienced trader looking for large funding, our three plans cater to all types of traders.</p>
                        <h3>Small Investment, Huge Potential:</h3>
                        <p>Get funded with real capital for as little as Rs 1,000.</p>
                        <h3>Flexible Profit-Sharing: </h3>
                        <p>Keep the majority of your profits and watch your trading career grow</p>
                        <h3>Risk Management Support:</h3>
                        <p>Our evaluation process helps you develop sound risk management habits, ensuring that you can trade safely and confidently.</p>
                        <h3>Dedicated Customer Support:</h3>
                        <p>We’re here to help you every step of the way with round-the-clock assistance.</p>
                    </div>

                    <div className='program-image'>
                        <img className='program-img' src={ProgramImage} alt="Trading App" />
                    </div>
            
                </div>    

            </section>

        </div>
    );
};

export default Home;
