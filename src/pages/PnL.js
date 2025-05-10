import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/PnL.css";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { Typography } from "@mui/material";

const PnL = () => {
  const [stocks, setStocks] = useState([]);
  const [userBalance, setUserBalance] = useState(0);
  const [updatedStocks, setUpdatedStocks] = useState([]);
  const userId = localStorage.getItem("userId");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  const fetchUserStocks = async () => {
    try {
      const response = await axios.get(
        `https://lx-backend-yz03.onrender.com/api/users/stocks/${userId}`
      );
      setStocks(response.data.stocks);
      setUserBalance(response.data.balance);
    } catch (error) {
      console.error("Error fetching user stocks:", error);
    }
  };

  // Fetch real-time price from the watchlist (1 or 2)
  const fetchRealTimePrices = async () => {
    try {
      const storedWatchlistType = localStorage.getItem("watchlistType");
      const watchlistType =
        storedWatchlistType || location.state?.watchlistType || "1"; // Default to WatchList1 if none is found
      const response = await axios.get(
        `https://lx-backend-yz03.onrender.com/api/watchlist${watchlistType}`
      );
      setUpdatedStocks(response.data);
    } catch (error) {
      console.error("Error fetching real-time prices:", error);
    }
  };

  useEffect(() => {
    fetchUserStocks();
    fetchRealTimePrices();
    const interval = setInterval(() => {
      fetchRealTimePrices(); // Update prices every second
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const calculateProfitLoss = (buyPrice, currentPrice, quantity) => {
    return (currentPrice - buyPrice) * quantity;
  };

  const handleSell = async (stockName, quantity, autoSell = false) => {
    try {
      const watchlistType =
        location.state?.watchlistType ||
        localStorage.getItem("watchlistType") ||
        "1";
      const response = await axios.post(
        "https://lx-backend-yz03.onrender.com/api/users/sell",
        {
          userId,
          stockName,
          quantity,
          watchlistType,
          autoSell, // Pass the auto-sell flag
        }
      );

      if (response.status === 200) {
        // Update user balance after sell
        if (!autoSell) {
          setUserBalance(
            (prevBalance) => prevBalance + quantity * response.data.currentPrice
          ); // Manual sell: update balance correctly
        }
        fetchUserStocks(); // Fetch updated user stocks after sell
      }
    } catch (error) {
      console.error("Error selling stock:", error.message || error);
    }
  };

  const autoSellIfNeeded = (stock, currentPrice) => {
    if (stock.quantity === 0) return; // Prevent auto-sell if quantity is zero

    const profitLoss = calculateProfitLoss(
      stock.buyPrice,
      currentPrice,
      stock.quantity
    );

    // Calculate the auto-sell threshold using your new formula
    const threshold = 0.1 * (stock.quantity * stock.buyPrice + userBalance); // 10% of (quantity * stock buy price + current balance)

    // Auto-sell condition: when profit/loss (negative) is less than or equal to the threshold
    if (profitLoss <= -threshold) {
      console.log(
        `Auto-selling ${stock.stockName} due to profit/loss threshold met.`
      );

      // Disable button and prevent multiple auto-sells
      if (stock.isBeingSold) return;
      stock.isBeingSold = true;

      // Perform auto-sell and set balance to zero after successful sell
      handleSell(stock.stockName, stock.quantity, true) // Pass true for auto-sell
        .then(() => {
          console.log("Auto-sell successful");
          // After successful auto-sell, set user balance to zero in UI
          setUserBalance(0);
        })
        .catch((error) => {
          console.error("Auto-sell error:", error.message || error);
        })
        .finally(() => {
          stock.isBeingSold = false; // Reset after handling
        });
    }
  };

  // Payout
  const [payoutEnabled, setPayoutEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayoutStatus = async () => {
      try {
        const response = await axios.get(
          `https://lx-backend-yz03.onrender.com/api/payout/users/${userId}`
        );
        setPayoutEnabled(response.data.payoutEnabled);
      } catch (err) {
        console.error("Failed to fetch payout status:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchPayoutStatus();
  }, [userId]);

  const handleShow = () => {
    navigate("/history");
  };

  return (
    <div className="pnl-container">
      <h2 className="positions-head">Positions</h2>
      <div className="portfolio">
        {stocks.map((stock, index) => {
          const currentStock = updatedStocks.find(
            (s) => s.name === stock.stockName
          );
          const currentPrice = currentStock
            ? currentStock.price
            : stock.buyPrice;
          const profitLoss = calculateProfitLoss(
            stock.buyPrice,
            currentPrice,
            stock.quantity
          );

          // Auto-sell check
          autoSellIfNeeded(stock, currentPrice);

          return (
            <div key={index} className="position-window">
              <div className="Profit-Loss">
                <p className="total-name">Total P&L</p>
                <p
                  className={`moving-pnl ${
                    profitLoss >= 0 ? "positive" : "negative"
                  }`}
                >
                  ₹{profitLoss.toFixed(2)}
                </p>
              </div>

              <div className="sec-box">
                <p className="stockName">{stock.stockName}</p>

                <p>
                  Qty<span className="qunty">{stock.quantity}</span>
                </p>

                <p>
                  Avg Price{" "}
                  <span className="buyPrice">₹{stock.buyPrice.toFixed(2)}</span>
                </p>

                <p>
                  CMP{" "}
                  <span className="curr-price">₹{currentPrice.toFixed(2)}</span>
                </p>

                <p>
                  Invested Amount{" "}
                  <span className="invst-amt">
                    ₹{stock.investedAmount.toFixed(2)}
                  </span>
                </p>
              </div>

              <button
                onClick={() => handleSell(stock.stockName, stock.quantity)}
                className="sell-btn"
              >
                Sell
              </button>
            </div>
          );
        })}
      </div>

      <div className="balance-updt">
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
                Balance Amount <p>₹{userBalance.toFixed(2)}</p>
              </span>
            </div>

            <button
              className="payout-btn"
              disabled={!payoutEnabled}
              onClick={() => {
                if (payoutEnabled) {
                  navigate("/congrats");
                }
              }}
              style={{
                backgroundColor: payoutEnabled ? "#4CAF50" : "grey",
                cursor: payoutEnabled ? "pointer" : "not-allowed",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                marginTop: "20px",
                fontSize: "20px",
                gap: "30px",
              }}
            >
              <FaMoneyCheckAlt /> Withdrawal
            </button>
            <Typography
              variant="body1"
              color="white"
              mt={2}
              sx={{ textDecoration: "underline", cursor: "pointer" }}
              textAlign={"right"}
              onClick={() => handleShow()}
            >
              Withdrawal History
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PnL;
