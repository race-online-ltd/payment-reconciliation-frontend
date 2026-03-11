// src/components/layout/Layout.jsx
import React, { useState } from "react";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";

export default function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // On mobile: sidebar starts closed. On desktop: starts open.
  const [open, setOpen] = useState(!isMobile);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose  = () => setOpen(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100vw", overflowX: "hidden" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar open={open} isMobile={isMobile} onClose={handleClose} />

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          width: "100%",
          transition: "all 0.3s ease",
          bgcolor: "#f8fafc",
        }}
      >
        <Topbar open={open} handleToggle={handleToggle} isMobile={isMobile} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: { xs: 1, sm: 1, md: 1 },
            py: { xs: 1, sm: 1, md: 1 },
            mt: 8,
            width: "100%",
          }}
        >
          <Outlet />
        </Box>

        <Footer />
      </Box>
    </Box>
  );
}