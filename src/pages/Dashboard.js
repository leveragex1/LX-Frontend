// Importing necessary libraries and components
import React, { useState, useEffect } from "react"; // React hooks for state and lifecycle management
import axios from "axios"; // For making HTTP requests to the backend
import { ToastContainer } from "react-toastify"; // For showing success and error notifications
import { handleError, handleSuccess } from "../utils"; // Utility functions to show error and success messages
import "../styles/Admin.css"; // Admin dashboard styles
import { useNavigate } from "react-router-dom"; // For navigation between routes

// Dashboard component for managing users and stocks
function Dashboard() {
  // State variables for managing users and stock data
  const [users, setUsers] = useState([]); // List of users
  const [newUserBalance, setNewUserBalance] = useState({}); // Object to store updated balance for users
  const [watchList1Stocks, setWatchList1Stocks] = useState([]); // List of stocks in WatchList1
  const [watchList2Stocks, setWatchList2Stocks] = useState([]); // List of stocks in WatchList2
  const [newStockName1, setNewStockName1] = useState(""); // Input field for new stock name in WatchList1
  const [newStockPrice1Input, setNewStockPrice1Input] = useState(""); // Input field for new stock price in WatchList1
  const [newStockName2, setNewStockName2] = useState(""); // Input field for new stock name in WatchList2
  const [newStockPrice2Input, setNewStockPrice2Input] = useState(""); // Input field for new stock price in WatchList2
  const [watchlist1_A, setWatchlist1_A] = useState(""); // Input for A value in WatchList1
  const [watchlist1_B, setWatchlist1_B] = useState(""); // Input for B value in WatchList1
  const [watchlist2_A, setWatchlist2_A] = useState(""); // Input for A value in WatchList2
  const [watchlist2_B, setWatchlist2_B] = useState(""); // Input for B value in WatchList2
  const [updateValues, setUpdateValues] = useState({});
  const navigate = useNavigate(); // Object to store updated A/B values for stocks

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // useEffect hook to fetch user data and stock data when the component mounts
  useEffect(() => {
    fetchUsers(); // Fetch users on component mount

    // Interval to fetch stock data every second for real-time updates
    const fetchStocksInterval = setInterval(() => {
      fetchWatchList1Stocks(); // Fetch WatchList1 stocks
      fetchWatchList2Stocks(); // Fetch WatchList2 stocks
    }, 1000); // Polling interval: 1 second

    return () => clearInterval(fetchStocksInterval); // Cleanup interval on component unmount
  }, []); // Empty dependency array ensures the effect runs only once on mount

  // Function to fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `https://lx-backend-1jck.onrender.com/api/users`
      ); // Get request to fetch users
      setUsers(response.data); // Update users state with fetched data
    } catch (error) {
      console.error("Error fetching users:", error); // Handle errors while fetching users
    }
  };

  // Function to fetch WatchList1 stocks from the backend
  const fetchWatchList1Stocks = async () => {
    try {
      const response = await axios.get(
        `https://lx-backend-1jck.onrender.com/api/watchlist1`
      ); // Get request to fetch WatchList1 stocks
      setWatchList1Stocks(response.data); // Update WatchList1 stocks state with fetched data
    } catch (error) {
      handleError("Error fetching WatchList1 stocks"); // Handle errors while fetching WatchList1 stocks
    }
  };

  // Function to fetch WatchList2 stocks from the backend
  const fetchWatchList2Stocks = async () => {
    try {
      const response = await axios.get(
        `https://lx-backend-1jck.onrender.com/api/watchlist2`
      ); // Get request to fetch WatchList2 stocks
      setWatchList2Stocks(response.data); // Update WatchList2 stocks state with fetched data
    } catch (error) {
      handleError("Error fetching WatchList2 stocks"); // Handle errors while fetching WatchList2 stocks
    }
  };

  // Handle user balance input change
  const handleBalanceChange = (userId, value) => {
    setNewUserBalance((prevState) => ({
      ...prevState,
      [userId]: value, // Update the specific user's balance in the newUserBalance state
    }));
  };

  // Function to update user's balance in the backend
  const updateUserBalance = async (userId) => {
    const balance = newUserBalance[userId]; // Get the balance value for the specific user
    if (!balance || isNaN(balance)) {
      handleError("Please enter a valid balance."); // Validation for non-empty and numeric balance
      return;
    }
    try {
      await axios.put(
        `https://lx-backend-1jck.onrender.com/api/users/balance/${userId}`,
        {
          balance,
        }
      ); // PUT request to update balance
      handleSuccess("User balance updated successfully!"); // Show success message
      fetchUsers(); // Refresh the user list after updating balance
    } catch (error) {
      handleError("Error updating user balance"); // Handle errors during balance update
    }
  };

  // Function to add a new stock to WatchList1
  const addStockToWatchList1 = async () => {
    // Validate inputs
    if (
      !newStockName1 ||
      isNaN(newStockPrice1Input) ||
      isNaN(watchlist1_A) ||
      isNaN(watchlist1_B)
    ) {
      handleError("Please enter valid stock name, price, and A/B values."); // Error if any input is invalid
      return;
    }
    try {
      await axios.post(`https://lx-backend-1jck.onrender.com/api/watchlist1`, {
        name: newStockName1,
        price: newStockPrice1Input,
        watchlist1_A,
        watchlist1_B,
      }); // POST request to add stock to WatchList1
      handleSuccess("Stock added to WatchList1 successfully!"); // Show success message
      // Clear input fields after adding
      setNewStockName1("");
      setNewStockPrice1Input("");
      setWatchlist1_A("");
      setWatchlist1_B("");
      fetchWatchList1Stocks(); // Refresh WatchList1 stocks
    } catch (error) {
      handleError("Error adding stock to WatchList1"); // Handle errors during adding stock
    }
  };

  // Function to add a new stock to WatchList2
  const addStockToWatchList2 = async () => {
    // Validate inputs
    if (
      !newStockName2 ||
      isNaN(newStockPrice2Input) ||
      isNaN(watchlist2_A) ||
      isNaN(watchlist2_B)
    ) {
      handleError("Please enter valid stock name, price, and A/B values."); // Error if any input is invalid
      return;
    }
    try {
      await axios.post(`https://lx-backend-1jck.onrender.com/api/watchlist2`, {
        name: newStockName2,
        price: newStockPrice2Input,
        watchlist2_A,
        watchlist2_B,
      }); // POST request to add stock to WatchList2
      handleSuccess("Stock added to WatchList2 successfully!"); // Show success message
      // Clear input fields after adding
      setNewStockName2("");
      setNewStockPrice2Input("");
      setWatchlist2_A("");
      setWatchlist2_B("");
      fetchWatchList2Stocks(); // Refresh WatchList2 stocks
    } catch (error) {
      handleError("Error adding stock to WatchList2"); // Handle errors during adding stock
    }
  };

  // Function to update the A and B values of a stock in WatchList1 or WatchList2

  // Function to update the A and B values of a stock in WatchList1
  const updateStockABWatchList1 = async (stockId) => {
    const { A, B } = updateValues[stockId] || {}; // Get the A and B values for the stock
    if (A == null || B == null || isNaN(A) || isNaN(B)) {
      handleError("Please enter valid values for A and B."); // Validation for A and B inputs
      return;
    }
    try {
      // Log payload for debugging
      console.log(
        `Updating stockId: ${stockId}, watchlist: WatchList1, A: ${A}, B: ${B}`
      );

      // PUT request to update A/B values for WatchList1
      const response = await axios.put(
        `https://lx-backend-1jck.onrender.com/api/watchlist1/${stockId}`,
        { A, B }
      );

      // Log the response to check if the update was successful
      console.log("Update response for WatchList1:", response.data);

      handleSuccess("A and B values updated successfully for WatchList1!");
      fetchWatchList1Stocks(); // Refresh WatchList1 stocks if updated
    } catch (error) {
      // Log error for debugging
      console.error(
        "Error updating A and B values for WatchList1:",
        error.response ? error.response.data : error.message
      );
      handleError("Error updating A and B values for WatchList1");
    }
  };

  // Function to update the A and B values of a stock in WatchList2
  const updateStockABWatchList2 = async (stockId) => {
    const { A, B } = updateValues[stockId] || {}; // Get the A and B values for the stock
    if (A == null || B == null || isNaN(A) || isNaN(B)) {
      handleError("Please enter valid values for A and B."); // Validation for A and B inputs
      return;
    }
    try {
      // Log payload for debugging
      console.log(
        `Updating stockId: ${stockId}, watchlist: WatchList2, A: ${A}, B: ${B}`
      );

      // PUT request to update A/B values for WatchList2
      const response = await axios.put(
        `https://lx-backend-1jck.onrender.com/api/watchlist2/${stockId}`,
        { A, B }
      );

      // Log the response to check if the update was successful
      console.log("Update response for WatchList2:", response.data);

      handleSuccess("A and B values updated successfully for WatchList2!");
      fetchWatchList2Stocks(); // Refresh WatchList2 stocks if updated
    } catch (error) {
      // Log error for debugging
      console.error(
        "Error updating A and B values for WatchList2:",
        error.response ? error.response.data : error.message
      );
      handleError("Error updating A and B values for WatchList2");
    }
  };

  // Handle change in A and B values for stocks
  const handleABChange = (stockId, field, value) => {
    setUpdateValues((prev) => ({
      ...prev,
      [stockId]: {
        ...prev[stockId],
        [field]: value, // Update either A or B for the specific stock
      },
    }));

    // Log to check if the A/B values are being updated correctly
    console.log(
      `Updated stockId: ${stockId}, field: ${field}, value: ${value}`
    );
  };

  // Payout

  const togglePayout = async (userId, newStatus) => {
    try {
      await axios.put(
        `https://lx-backend-1jck.onrender.com/api/payout/${userId}`,
        { payoutStatus: newStatus }
      );
      handleSuccess(`Payout status set to ${newStatus}`);
      fetchUsers(); // Refresh
    } catch (error) {
      handleError("Failed to update payout status");
    }
  };

  const handleShow = () => {
    navigate("/putBalance");
  };

  // here i 'll make button consistent so that when admin

  // JSX to render the dashboard UI
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {/* WatchList1 Section */}
      <div className="stocks-section">
        <h2>Manage WatchList1 Stocks</h2>
        <div>
          <input
            type="text"
            placeholder="Stock Name"
            value={newStockName1}
            onChange={(e) => setNewStockName1(e.target.value)} // Input for new stock name
          />
          <input
            type="number"
            placeholder="Stock Price"
            value={newStockPrice1Input}
            onChange={(e) => setNewStockPrice1Input(e.target.value)} // Input for new stock price
          />
          <input
            type="number"
            placeholder="Watchlist A"
            value={watchlist1_A}
            onChange={(e) => setWatchlist1_A(e.target.value)} // Input for A value
          />
          <input
            type="number"
            placeholder="Watchlist B"
            value={watchlist1_B}
            onChange={(e) => setWatchlist1_B(e.target.value)} // Input for B value
          />
          <button onClick={addStockToWatchList1}>
            Add Stock to WatchList1
          </button>{" "}
          {/* Button to add stock */}
        </div>

        <table>
          <thead>
            <tr>
              <th>Stock Name</th>
              <th>Current Price</th>
              <th>A Value</th>
              <th>B Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {watchList1Stocks.map((stock) => (
              <tr key={stock._id}>
                <td>{stock.name}</td>
                <td>₹{stock.price.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    value={updateValues[stock._id]?.A || stock.watchlist1_A}
                    onChange={(e) =>
                      handleABChange(stock._id, "A", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={updateValues[stock._id]?.B || stock.watchlist1_B}
                    onChange={(e) =>
                      handleABChange(stock._id, "B", e.target.value)
                    }
                  />
                </td>
                <td>
                  <button onClick={() => updateStockABWatchList1(stock._id)}>
                    Update A/B
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* WatchList2 Section */}
      <div className="stocks-section">
        <h2>Manage WatchList2 Stocks</h2>
        <div>
          <input
            type="text"
            placeholder="Stock Name"
            value={newStockName2}
            onChange={(e) => setNewStockName2(e.target.value)} // Input for new stock name
          />
          <input
            type="number"
            placeholder="Stock Price"
            value={newStockPrice2Input}
            onChange={(e) => setNewStockPrice2Input(e.target.value)} // Input for new stock price
          />
          <input
            type="number"
            placeholder="Watchlist A"
            value={watchlist2_A}
            onChange={(e) => setWatchlist2_A(e.target.value)} // Input for A value
          />
          <input
            type="number"
            placeholder="Watchlist B"
            value={watchlist2_B}
            onChange={(e) => setWatchlist2_B(e.target.value)} // Input for B value
          />
          {/* Add Withdrawal History */}
          <button onClick={addStockToWatchList2}>
            Add Stock to WatchList2
          </button>{" "}
          {/* Button to add stock */}
        </div>

        <table>
          <thead>
            <tr>
              <th>Stock Name</th>
              <th>Current Price</th>
              <th>A Value</th>
              <th>B Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {watchList2Stocks.map((stock) => (
              <tr key={stock._id}>
                <td>{stock.name}</td>
                <td>₹{stock.price.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    value={updateValues[stock._id]?.A || stock.watchlist2_A}
                    onChange={(e) =>
                      handleABChange(stock._id, "A", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={updateValues[stock._id]?.B || stock.watchlist2_B}
                    onChange={(e) =>
                      handleABChange(stock._id, "B", e.target.value)
                    }
                  />
                </td>
                <td>
                  <button onClick={() => updateStockABWatchList2(stock._id)}>
                    Update A/B
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Button For Adding Withdrawal History */}
      <div>
        Add Users Withdrawal History 👉
        <button onClick={() => handleShow()}>
          Add Users Withdrawal History
        </button>
      </div>
      {/* User Balance Section */}
      <div className="users-section">
        <h2>Manage User Balances</h2>
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Mobile no.</th>
              <th>Current Balance</th>
              <th>New Balance</th>
              <th>Action</th>
              <th>Payout</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.fullName}</td>
                <td>{user.mobile}</td>
                <td>₹{user.balance.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    value={newUserBalance[user._id] || ""}
                    onChange={(e) =>
                      handleBalanceChange(user._id, e.target.value)
                    }
                  />
                </td>
                <td>
                  <button onClick={() => updateUserBalance(user._id)}>
                    Update Balance
                  </button>
                </td>
                <td>
                  <select
                    value={user.payoutStatus}
                    onChange={(e) => togglePayout(user._id, e.target.value)}
                  >
                    <option value="Enable">Enable</option>
                    <option value="Pending">Pending</option>
                    <option value="Disable">Disable</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer /> {/* Notification container */}
    </div>
  );
}

// Exporting the Dashboard component
export default Dashboard;
