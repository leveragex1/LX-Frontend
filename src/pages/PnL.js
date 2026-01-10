import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/PnL.css";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { Typography } from "@mui/material";
// import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdOutlineAttachMoney } from "react-icons/md";

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
        `https://leveragexfund-4rz6.onrender.com/api/users/stocks/${userId}`
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
        `https://leveragexfund-4rz6.onrender.com/api/watchlist${watchlistType}`
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
        "https://leveragexfund-4rz6.onrender.com/api/users/sell",
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
  const [payoutStatus, setPayoutStatus] = useState("Disable");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayoutStatus = async () => {
      try {
        const response = await axios.get(
          `https://leveragexfund-4rz6.onrender.com/api/payout/users/${userId}`
        );
        setPayoutStatus(response.data.payoutStatus); // Assuming backend sends payoutStatus now
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

  // Pending Popup

  const [showPendingPopup, setShowPendingPopup] = useState(false);

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
              disabled={payoutStatus === "Disable"}
              onClick={() => {
                if (payoutStatus === "Pending") {
                  setShowPendingPopup(true); // show modal
                } else if (payoutStatus === "Enable") {
                  navigate("/congrats");
                }
              }}
              style={{
                backgroundColor:
                  payoutStatus === "Disable" ? "grey" : "#4CAF50",
                cursor: payoutStatus === "Disable" ? "not-allowed" : "pointer",
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

            {showPendingPopup && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1000,
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "30px",
                    borderRadius: "10px",
                    textAlign: "center",
                    width: "300px",
                    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <h1 className="company-name">
                Leverage <span>X</span>
              </h1>
                  <h2 style={{ marginBottom: "20px", color: "#ff9800" }}>
                  <MdOutlineAttachMoney />Pending Payment!!!
                  </h2>
                  <p>Please clear your payment before withdrawal.</p>
                  <p> Check your Mail for more information.</p>
                  <button
                    onClick={() => setShowPendingPopup(false)}
                    style={{
                      marginTop: "20px",
                      padding: "10px 20px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

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
