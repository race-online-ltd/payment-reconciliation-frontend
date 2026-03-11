// src/components/layout/Topbar.jsx
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/api/authApi";
import React, { useState } from "react";
import {
  AppBar, Toolbar, IconButton, Typography, Box, useTheme,
  Menu, MenuItem, Divider, Avatar, ListItemIcon,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import FormatIndentDecreaseIcon from "@mui/icons-material/FormatIndentDecrease";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation } from "react-router-dom";

export default function Topbar({ open, handleToggle, isMobile }) {
  const navigate  = useNavigate();
  const theme     = useTheme();
  const location  = useLocation();

  const [anchorAvatar, setAnchorAvatar] = useState(null);
  const openAvatar = Boolean(anchorAvatar);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const storedUser = localStorage.getItem("authUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.appBar,
        // On mobile: full width (sidebar is overlay, not in flow)
        // On desktop: shrink based on sidebar state
        width: isMobile ? "100%" : `calc(100% - ${open ? 240 : 60}px)`,
        ml:    isMobile ? 0       : `${open ? 240 : 60}px`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        bgcolor: "#f9fafb",
        color: "#111",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <Toolbar>
        {/* Sidebar Toggle */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleToggle}
          sx={{ mr: 2, "&:focus": { outline: "none", boxShadow: "none" } }}
        >
          {open && !isMobile ? <FormatIndentDecreaseIcon /> : <MenuIcon />}
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {/* Avatar */}
        <IconButton
          onClick={(e) => setAnchorAvatar(e.currentTarget)}
          sx={{ ml: 1, "&:focus": { outline: "none", boxShadow: "none" } }}
        >
          <Avatar sx={{ bgcolor: "grey.500", width: 36, height: 36 }}>
            <PersonIcon sx={{ fontSize: 20 }} />
          </Avatar>
        </IconButton>

        {/* Avatar Dropdown */}
        <Menu
          anchorEl={anchorAvatar}
          open={openAvatar}
          onClose={() => setAnchorAvatar(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{ sx: { width: 220, p: 1 } }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography fontWeight={600}>{user?.name || "User"}</Typography>
          </Box>

          <Divider />

          <MenuItem sx={{ color: "red" }} onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: "red" }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}