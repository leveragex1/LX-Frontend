import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TradingView from '../components/TradingView';
import '../styles/WatchList.css';

import { BsGraphUp } from "react-icons/bs";

const WatchList1 = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [updatedBalance, setUpdatedBalance] = useState(0);
  const [stocks, setStocks] = useState([]);
  const [showGraph, setShowGraph] = useState(false); // State to show TradingView
  const [selectedStockForGraph, setSelectedStockForGraph] = useState(null); // Selected stock for graph
  
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  const fetchStocks = async () => {
    try {
      const response = await axios.get('https://lx-backend-wwos.onrender.com/api/watchlist1');
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching WatchList2 stocks:', error);
    }
  };

  const fetchBalance = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(`https://lx-backend-wwos.onrender.com/api/users/balance/${userId}`);
      setCurrentBalance(response.data.balance);
      setUpdatedBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching user balance:', error);
    }
  };

  useEffect(() => {
    fetchStocks();
    fetchBalance();
    const interval = setInterval(() => {
      fetchStocks(); // Fetch updated WatchList1 stock prices
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleBuyClick = (option) => {
    const maxQuantity = Math.floor(currentBalance / option.price);
    setSelectedOption(option);
    setQuantity(maxQuantity);
    setInvestedAmount(option.price * maxQuantity);
    setUpdatedBalance(currentBalance - (option.price * maxQuantity));
    setShowPopup(true);
  };

  const handleGraph = (stock) => {
    setSelectedStockForGraph(stock); // Set the selected stock for the graph
    setShowGraph(true); // Show TradingView component
  };

  const handleCloseGraph = () => {
    setShowGraph(false); // Close the TradingView component
  };

  const handleBuy = async () => {
    if (updatedBalance < 0) {
      alert("Insufficient funds for this purchase.");
      return;
    }

    try {
      const response = await axios.post('https://lx-backend-wwos.onrender.com/api/watchlist1/buy', {
        stockName: selectedOption.name,
        userId: userId,
        quantity: quantity
      });

      if (response.status === 200) {
        setCurrentBalance(response.data.updatedBalance);
        setUpdatedBalance(response.data.updatedBalance);
        setShowPopup(false);

        localStorage.setItem('watchlistType', '1');

        navigate('/pnl', {
          state: {
            watchlistType: '1',  // Flag for WatchList1
            selectedOption,
            quantity,
            investedAmount,
            updatedBalance: response.data.updatedBalance,
          }
        });
      } else {
        alert('Error purchasing stock.');
      }
    } catch (error) {
      console.error('Error buying stock:', error);
    }
  };

  return (
    <div className="watchlist-container">
      <div className="sidebar">
        <h2 className='currency-opt'>Currency Options</h2>
        <div className="options">
          {stocks.map((option, index) => (
            <div key={index} className="option">
              <span>{option.name}</span>
              <span>₹{option.price.toFixed(2)}</span>

              <button className='graph' onClick={() => handleGraph(option)}><BsGraphUp /></button>

              <button className="buy-btn" onClick={() => handleBuyClick(option)}>Buy</button>
            </div>
          ))}
        </div>

        <div className="balance-folder">
        <div className="leverage-balance">
          <div className="company1">
            <h1 className="company-name">
              Leverage <span>X</span>
            </h1>
            {/* <p className="forex-trade">Forex Trading Account</p> */}
          </div>
          <div className="balance">
            <span>
              Balance Amount <p>₹{currentBalance.toFixed(2)}</p>
            </span>
          </div>
        </div>
        </div>

      </div>

      {showPopup && (
        <div className="buy-stocks">

        <div className="selected-stocks">
          <h3 className="stock-name">{selectedOption.name}</h3>
          <p>Quantity: {quantity}</p>
        </div>


        <div className="inv-update">

          <div className="invested-bal">
            <p>Invested</p>
            <p>₹{investedAmount.toFixed(2)}</p>
          </div>

          <div className="balance-div">
            <p>Balance</p>
            <p>₹{updatedBalance.toFixed(2)}</p>
          </div>

        </div>


        <div className="purchage-cancel">

          <button onClick={handleBuy} disabled={quantity === 0}>
            Confirm
          </button>

          <button onClick={() => setShowPopup(false)}>Cancel</button>
        </div>

      </div>
      )}

      {showGraph && (
        <div className="graph-container">
          <button className="close-btn" onClick={handleCloseGraph}>✖</button>
          <TradingView stock={selectedStockForGraph} />
        </div>
      )}

    </div>
  );
};

export default WatchList1;
