import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

const HRExitInterviews = () => {
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("/admin/exit_responses", {
          headers: { Authorization: token },
        });

        setResponses(response.data.data || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to fetch exit interview responses."
        );
      }
    };

    fetchResponses();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Exit Interview Responses
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Username</TableCell>
              <TableCell>Responses</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {responses.length > 0 ? (
              responses.map((response) => (
                <TableRow key={response.employeeId?._id || response.employeeId}>
                  {/* Display username or fallback */}
                  <TableCell>
                    {response.employeeId?.username || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {response.responses?.length > 0 ? (
                      response.responses.map((item, index) => (
                        <Box key={index} sx={{ marginBottom: 2 }}>
                          <Typography variant="body2">
                            <strong>{item.questionText}</strong>
                          </Typography>
                          <Typography variant="body1">
                            {item.response || "No response provided."}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography>No responses submitted.</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography>No exit interview responses found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HRExitInterviews;
