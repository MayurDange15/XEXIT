import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Alert,
  Link,
} from "@mui/material";

const HRDashboard = () => {
  const [resignations, setResignations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResignations = async () => {
      try {
        const res = await axiosInstance.get("/admin/resignations", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setResignations(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch resignation requests."
        );
      }
    };

    fetchResignations();
  }, []);

  const handleAction = async (resignationId, approved, lwd) => {
    try {
      await axiosInstance.put(
        "/admin/conclude_resignation",
        { resignationId, approved, lwd },
        { headers: { Authorization: localStorage.getItem("token") } }
      );

      // Update UI after action
      setResignations((prev) =>
        prev.map((r) =>
          r._id === resignationId
            ? { ...r, status: approved ? "approved" : "rejected" }
            : r
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Action failed. Please try again."
      );
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        HR Dashboard
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee ID</TableCell>
            <TableCell>Last Working Day</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resignations.map((resignation) => (
            <TableRow key={resignation._id}>
              {/* Render the username instead of the whole employeeId object */}
              <TableCell>
                {resignation.employeeId?.username || "Unknown"}
              </TableCell>
              <TableCell>{resignation.lwd || "Not specified"}</TableCell>
              <TableCell>{resignation.status || "Unknown"}</TableCell>
              <TableCell>
                {resignation.status === "pending" ? (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() =>
                        handleAction(resignation._id, true, resignation.lwd)
                      }
                      sx={{ marginRight: 1 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleAction(resignation._id, false, null)}
                    >
                      Reject
                    </Button>
                  </>
                ) : resignation.status === "approved" ? (
                  <Link href={`/exit-responses`} target="_blank" rel="noopener">
                    View Exit Interview Responses
                  </Link>
                ) : (
                  "No actions available"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default HRDashboard;
