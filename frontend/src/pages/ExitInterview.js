import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

const ExitInterview = () => {
  const [responses, setResponses] = useState([
    { questionText: "What motivated you to resign?", response: "" },
    { questionText: "What could the company improve?", response: "" },
    {
      questionText: "Would you recommend this company to others?",
      response: "",
    },
  ]);
  const [message, setMessage] = useState("");

  const handleInputChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index].response = value;
    setResponses(newResponses);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post(
        "/user/responses",
        { responses },
        { headers: { Authorization: token } }
      );

      setMessage("Exit interview submitted successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error submitting exit interview."
      );
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Exit Interview
      </Typography>

      <Card>
        <CardContent>
          {responses.map((item, index) => (
            <Box key={index} sx={{ marginBottom: 3 }}>
              <Typography variant="body1" gutterBottom>
                {item.questionText}
                <span style={{ color: "red" }}>&nbsp;*</span>
              </Typography>
              <TextField
                value={item.response}
                onChange={(e) => handleInputChange(index, e.target.value)}
                multiline
                fullWidth
                required
              />
            </Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Submit
          </Button>
          {message && (
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              {message}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExitInterview;
