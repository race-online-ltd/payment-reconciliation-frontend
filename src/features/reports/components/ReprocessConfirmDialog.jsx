// src/features/reports/components/ReprocessConfirmDialog.jsx
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Stack,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/CachedOutlined";
import { format } from "date-fns";

export default function ReprocessConfirmDialog({ open, onClose, onConfirm, row }) {
  if (!row) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, border: "1px solid #e2e8f0" } }}
    >
      <DialogTitle sx={{
        display: "flex", alignItems: "center", gap: 1.5,
        borderBottom: "1px solid #e2e8f0", p: "14px 18px",
      }}>
        <Box sx={{
          width: 34, height: 34, borderRadius: "8px",
          bgcolor: "#f1f5e8", border: "1px solid #f1f5e8",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <CachedIcon sx={{ fontSize: 18, color: "rgb(176, 200, 125)" }} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
            Confirm Reprocess
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#64748b" }}>
            This will create a new comparison run
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: "20px 18px" }}>
        <Stack spacing={1.5}>
          <Typography sx={{ fontSize: 13, color: "#475569" }}>
            You are about to reprocess the data of:
          </Typography>

          <Box sx={{
            bgcolor: "#f8fafc", border: "1px solid #e2e8f0",
            borderRadius: "8px", p: "10px 14px",
          }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
              {format(new Date(row.start_date), "dd-MM-yyyy")} → {format(new Date(row.end_date), "dd-MM-yyyy")}
            </Typography>
          </Box>

          <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
            Current comparisons will be moved to history. New files will be compared as process #{(row.process_no ?? 0) + 1}.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: "12px 18px", borderTop: "1px solid #e2e8f0", gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "#64748b", fontWeight: 600, fontSize: 13,
            textTransform: "none", borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          Cancel
        </Button>
        <Button
            onClick={onConfirm}
            variant="contained"
            sx={{
                bgcolor: "rgb(58, 113, 74)", // updated color
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
                "&:hover": { bgcolor: "rgb(70, 130, 85)" },// you can change hover if needed
            }}
            >
            Confirm
            </Button>

      </DialogActions>
    </Dialog>
  );
}