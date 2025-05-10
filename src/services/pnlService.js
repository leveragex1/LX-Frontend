// src/services/pnlService.js
import axios from 'axios';

export async function savePnLDataToBackend(pnlData) {
  try {
    const response = await axios.post('https://lx-backend-yz03.onrender.com/api/pnl/save', {
      userId: pnlData.userId,  // The logged-in user's ID
      stocks: pnlData.stocks,  // Array of stocks
      totalBalance: pnlData.totalBalance // Total balance
    });
    console.log('PnL data saved:', response.data);
  } catch (error) {
    console.error('Error saving PnL data:', error);
  }
}

export async function loadPnLDataFromBackend(userId) {
  try {
    const response = await axios.get(`https://lx-backend-yz03.onrender.com/api/pnl/${userId}`);
    if (response.data.success) {
      return response.data.pnl;
    } else {
      console.log('No PnL data found');
      return null;
    }
  } catch (error) {
    console.error('Error loading PnL data:', error);
    return null;
  }
}
