import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const EmployeeDashboard = () => {
  const [resignation, setResignation] = useState(null);
  const [lwd, setLwd] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResignation = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      try {
        const res = await axiosInstance.get("/user/resign", {
          headers: { Authorization: token },
        });
        setResignation(res.data.data || null);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          // Optional: Redirect to login page
        } else {
          setError(
            err.response?.data?.message ||
              "Failed to fetch resignation details."
          );
        }
      }
    };

    fetchResignation();
  }, []);

  const handleResignationSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axiosInstance.post(
        "/user/resign",
        { lwd },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      setResignation(res.data.data.resignation);
      setSuccess("Resignation submitted successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit resignation.");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employee Dashboard
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {!resignation ? (
        <Box
          component="form"
          onSubmit={handleResignationSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 400,
          }}
        >
          <TextField
            label="Last Working Day"
            type="date"
            value={lwd}
            onChange={(e) => setLwd(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Submit Resignation
          </Button>
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Last Working Day</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{resignation.lwd}</TableCell>
              <TableCell>{resignation.status}</TableCell>
              <TableCell>
                {resignation.status === "approved" && (
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ marginTop: 2 }}
                    onClick={() => navigate("/exit-interview")}
                  >
                    Complete Exit Interview
                  </Button>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default EmployeeDashboard;
