import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  Divider,
  Box,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import Img from "../Assets/leverage.png";

const WithdrawalHistory = () => {
  const email = localStorage.getItem("userEmail");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!email) return;

    axios
      .get(`https://lx-backend-og1d.onrender.com/putBalance?email=${email}`)
      .then((res) => setHistory(res.data))
      .catch((err) => {
        console.error(err);
        setHistory([]);
      });
  }, [email]);

  return (
    <div style={{ minHeight: '62vh' }}>
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 15 }}>
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          color="green"
          gutterBottom
        >
          Withdrawal History
        </Typography>

        <Paper elevation={3} sx={{ backgroundColor: 'black', borderRadius: 5 }}>
          {history.length === 0 ? (
            <Typography
              variant="body1"
              align="center"
              fontWeight="bold"
              color="text.secondary"
            >
              No withdrawal history found
            </Typography>
          ) : (
            <List>
              {history.map(({ _id, name, amount, method, date, status }) => (
                <React.Fragment key={_id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        src={Img}
                        sx={{ width: 40, height: 40, border: 1 }}
                      />
                    </ListItemAvatar>

                    <Box>
                      <Typography
                        variant="subtitle1"
                        color="white"
                        component="div"
                      >
                        <Box component="span" color="green" fontWeight="bold">
                          {name}
                        </Box>{' '}
                        • ₹{Number(amount).toLocaleString()} • {method}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="white"
                        component="div"
                      >
                        Received on {new Date(date).toLocaleString()}
                      </Typography>

                      <Box mt={1}>
                        <Chip
                          label={status}
                          icon={<CheckCircleIcon />}
                          size="small"
                          color={status === 'Completed' ? 'success' : 'warning'}
                        />
                      </Box>
                    </Box>
                  </ListItem>
                  <Divider
                    variant="inset"
                    component="li"
                    sx={{ borderBottomWidth: 1, borderColor: 'white' }}
                  />
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default WithdrawalHistory;
