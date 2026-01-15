import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import axios from 'axios';

const WithdrawalForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    amount: '',
    method: 'UPI',
    status: 'Pending',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) return alert('Please enter a valid user email.');

    const payload = {
      ...form,
      amount: parseFloat(form.amount),
      date: new Date(),
    };

    try {
      await axios.post('https://lx-backend-0mh6.onrender.com/putBalance', payload);
      alert('Withdrawal request submitted.');
      setForm({ name: '', email: '', amount: '', method: 'UPI', status: 'Pending' });
    } catch (err) {
      console.error(err);
      alert('Error submitting withdrawal request.');
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 15 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Submit Withdrawal Request
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={form.name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Amount"
              name="amount"
              type="number"
              fullWidth
              value={form.amount}
              onChange={handleChange}
              required
            />
            <TextField
              select
              label="Method"
              name="method"
              value={form.method}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="UPI">UPI</MenuItem>
              <MenuItem value="Bank">Bank</MenuItem>
            </TextField>
            <TextField
              select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default WithdrawalForm;
