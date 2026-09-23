import React from "react";
import { Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const steps = [
  { label: "Basic Info" },
  { label: "Details" },
  { label: "Salary" },
  { label: "Application" },
  { label: "Preview" },
];

export default function CustomStepper({ activeStep = 0 }) {
  const totalSteps = steps.length - 1;
  const progressPercentage = (activeStep / totalSteps) * 100;

  return (
    <Box mb={6} position="relative">
      {/* Line container */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: "10px",
          width: "100%",
          height: 4,
          bgcolor: "grey.300",
          zIndex: 0,
        }}
      >
        {/* Filled progress line */}
        <Box
          sx={{
            position: "absolute",
            left: "10%", // start at center of first circle
            top: 0,
            height: 4,
            bgcolor: "#20365c",
            zIndex: 1,
            width: `calc(${progressPercentage * 0.8}% + 0%)`, // adjust to end exactly at active step
            borderRadius: 2,
            transition: "width 0.4s ease",
          }}
        />
      </Box>

      {/* Steps */}
      <Box display="flex" justifyContent="space-between" position="relative" zIndex={2}>
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          return (
            <Box key={index} textAlign="center" width={`${100 / steps.length}%`}>
              {/* Circle */}
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  mx: "auto",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: 14,
                  color: "white",
                  background: isCompleted
                    ? "linear-gradient(135deg, #20365c, #3567de)"
                    : isActive
                    ? "linear-gradient(135deg, #3567de, #20365c)"
                    : "grey.300",
                  boxShadow: isActive ? "0 0 10px rgba(36, 64, 52, 0.3)" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                {isCompleted ? <CheckIcon sx={{ fontSize: 18 }} /> : index + 1}
              </Box>

              {/* Label */}
              <Typography
                variant="caption"
                fontWeight={500}
                sx={{ color: isActive || isCompleted ? "#20365c" : "grey.500" }}
              >
                {step.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
