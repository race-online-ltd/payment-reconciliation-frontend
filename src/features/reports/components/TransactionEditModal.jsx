import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Stack, TextField, Button, MenuItem,
  Switch, Typography, Grid, Box, useMediaQuery, useTheme
} from "@mui/material";
import {
  Close as CloseIcon,
  LockOutlined as LockIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { Formik, Form } from "formik";

const C = {
  bg:           "#f8fafc",
  surface:      "#ffffff",
  border:       "#e2e8f0",
  borderFocus:  "#3b82f6",
  accent:       "#16a34a",
  accentHover:  "#15803d",
  text:         "#0f172a",
  muted:        "#64748b",
  success:      "#16a34a",
  successBg:    "#dcfce7",
  successBorder:"#86efac",
  error:        "#dc2626",
  vendorBlue:   "#2563eb",
  vendorBg:     "#eff6ff",
  vendorBorder: "#93c5fd",
  disabled:     "#f1f5f9",
  disabledText: "#94a3b8",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: C.surface,
    borderRadius: "8px",
    fontSize: 13,
    "& input": { padding: "8.5px 12px" },
    "& fieldset": { borderColor: C.border },
    "&:hover fieldset": { borderColor: "#94a3b8" },
    "&.Mui-focused fieldset": { borderColor: C.borderFocus, borderWidth: 1.5 },
  },
  "& .MuiInputLabel-root": {
    fontSize: 12,
    transform: "translate(14px, 9px) scale(1)",
  },
  "& .MuiInputLabel-shrink": {
    transform: "translate(14px, -8px) scale(0.75)",
    bgcolor: C.surface,
    px: 0.5,
  },
};

const SectionLabel = ({ children }) => (
  <Typography sx={{
    fontSize: 10.5, fontWeight: 700, letterSpacing: "0.09em",
    textTransform: "uppercase", color: C.muted, mb: 1.5,
    fontFamily: "'Inter', sans-serif",
  }}>
    {children}
  </Typography>
);

const Card = ({ children, sx = {} }) => (
  <Box sx={{
    bgcolor: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: "12px",
    p: { xs: "14px 14px", sm: "16px 18px" },
    ...sx,
  }}>
    {children}
  </Box>
);

// Fetches all wallets then filters client-side by channelId
// Same pattern as uploadApi.js fetchWallets()
const WalletFetcher = ({ channelId, onWalletsFetched }) => {
  useEffect(() => {
    if (!channelId) {
      onWalletsFetched([]);
      return;
    }

    api.get("/wallets").then((res) => {
      const data = res.data.data ?? [];
      const filtered = data
        .filter((w) =>
          w.payment_channel?.id === channelId ||
          w.payment_channel_id === channelId
        )
        .map((w) => ({ id: w.id, label: w.wallet_number }));
      onWalletsFetched(filtered);
    });
  }, [channelId]);

  return null;
};

const TransactionEditModal = ({ open, onClose, initialData, onSave }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [channels, setChannels] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loadingWallets, setLoadingWallets] = useState(false);

  // Fetch channels once on open
  useEffect(() => {
    if (!open) return;
    api.get("/payment-channels").then((res) => {
      const data = res.data.data ?? [];
      setChannels(data.map((c) => ({ id: c.id, label: c.channel_name })));
    });
  }, [open]);

  if (!initialData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          bgcolor: C.bg,
          backgroundImage: "none",
          borderRadius: fullScreen ? 0 : "16px",
          border: fullScreen ? "none" : `1px solid ${C.border}`,
          boxShadow: "0 20px 60px -10px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          maxHeight: fullScreen ? "100%" : "calc(100% - 64px)",
        },
      }}
    >
      <DialogTitle sx={{
        p: { xs: "12px 16px", sm: "14px 18px" },
        borderBottom: `1px solid ${C.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        bgcolor: C.surface,
        zIndex: 10,
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{
            width: 34, height: 34, borderRadius: "8px",
            bgcolor: "#f0fdf4", border: `1px solid ${C.successBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ReceiptIcon sx={{ fontSize: 17, color: C.success }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>
              Update Transaction
            </Typography>
            <Typography sx={{ fontSize: 11, color: C.muted }}>
              System Reconciliation Tool
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small" sx={{ border: `1px solid ${C.border}` }}>
          <CloseIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </DialogTitle>

      <Formik
        initialValues={{
          ...initialData,
          status:     initialData.status     || "mismatch",
          own_db:     !!initialData.own_db   || !!initialData.ownDb,
          vendor:     !!initialData.vendor,
          channel_id: initialData.channel_id || "",
          wallet_id:  initialData.wallet_id  || "",
        }}
        enableReinitialize
        onSubmit={onSave}
      >
        {({ values, handleChange, setFieldValue, handleSubmit, isSubmitting }) => (
          <Form style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

            {/* Watches values.channel_id — fires on initial load and on every channel change */}
            <WalletFetcher
              channelId={values.channel_id}
              onWalletsFetched={(list) => {
                setWallets(list);
                setLoadingWallets(false);
              }}
            />

            <DialogContent sx={{ p: { xs: "16px", sm: "20px" }, bgcolor: C.bg, flexGrow: 1, overflowY: "auto" }}>
              <Stack spacing={2}>

                <Card sx={{ bgcolor: "#fafbff", border: "1px solid #e0e7ff" }}>
                  <SectionLabel>Transaction Reference</SectionLabel>
                  <TextField
                    fullWidth
                    label="Transaction ID"
                    value={values.trxId || values.transaction_id || "N/A"}
                    size="small"
                    disabled
                    InputProps={{ endAdornment: <LockIcon sx={{ fontSize: 14, color: C.disabledText }} /> }}
                    sx={fieldSx}
                  />
                </Card>

                <Card>
                  <SectionLabel>Basic Information</SectionLabel>
                  <Stack spacing={1.5}>

                    <TextField
                      fullWidth label="Sender No." name="senderWallet"
                      value={values.senderWallet || ""} onChange={handleChange}
                      size="small" sx={fieldSx}
                    />

                    <TextField
                      fullWidth label="User ID" name="userId"
                      value={values.userId || ""} onChange={handleChange}
                      size="small" sx={fieldSx}
                    />

                    {/* Channel dropdown */}
                    <TextField
                      select fullWidth label="Channel" name="channel_id"
                      value={values.channel_id || ""}
                      onChange={(e) => {
                        setFieldValue("channel_id", e.target.value);
                        setFieldValue("wallet_id", "");   // reset wallet on channel change
                        setLoadingWallets(true);           // WalletFetcher will set this back to false
                      }}
                      size="small" sx={fieldSx}
                    >
                      {channels.map((c) => (
                        <MenuItem key={c.id} value={c.id}>{c.label}</MenuItem>
                      ))}
                    </TextField>

                    {/* Wallet dropdown */}
                    <TextField
                      select fullWidth label="Wallet" name="wallet_id"
                      value={values.wallet_id || ""}
                      onChange={(e) => setFieldValue("wallet_id", e.target.value)}
                      size="small"
                      disabled={!values.channel_id || loadingWallets}
                      sx={fieldSx}
                    >
                      {loadingWallets
                        ? <MenuItem disabled>Loading...</MenuItem>
                        : wallets.map((w) => (
                            <MenuItem key={w.id} value={w.id}>{w.label}</MenuItem>
                          ))
                      }
                    </TextField>

                    <TextField
                      fullWidth label="Entity" name="entity"
                      value={values.entity || ""} onChange={handleChange}
                      size="small" sx={fieldSx}
                    />

                  </Stack>
                </Card>

                <Card>
                  <SectionLabel>Financial Details</SectionLabel>
                  <Grid container spacing={1.5}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth label="Amount" name="amount" type="number"
                        value={values.amount || ""} onChange={handleChange}
                        size="small" sx={fieldSx}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth label="Vendor Date" name="date" type="date"
                        value={values.date || ""} onChange={handleChange}
                        size="small" InputLabelProps={{ shrink: true }} sx={fieldSx}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth label="Bill Date" name="billing_date" type="date"
                        value={values.billing_date || ""} onChange={handleChange}
                        size="small" InputLabelProps={{ shrink: true }} sx={fieldSx}
                      />
                    </Grid>
                  </Grid>
                </Card>

                <Card>
                  <SectionLabel>Verification Flags</SectionLabel>
                  <Grid container spacing={1.5}>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select fullWidth label="Status" name="status"
                        value={values.status} onChange={handleChange}
                        size="small"
                        sx={{
                          ...fieldSx,
                          "& .MuiSelect-select": {
                            fontWeight: 700,
                            color: values.status === "matched" ? C.success : C.error,
                          },
                        }}
                      >
                        <MenuItem value="matched">Matched</MenuItem>
                        <MenuItem value="mismatch">Mismatch</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        px: 1.5, py: 0.8, borderRadius: "8px",
                        bgcolor: values.own_db ? C.successBg : C.bg,
                        border: `1px solid ${values.own_db ? C.successBorder : C.border}`,
                        height: "100%", boxSizing: "border-box",
                      }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: values.own_db ? C.success : C.muted }}>
                          Own DB
                        </Typography>
                        <Switch
                          checked={values.own_db}
                          onChange={(e) => setFieldValue("own_db", e.target.checked)}
                          size="small"
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        px: 1.5, py: 0.8, borderRadius: "8px",
                        bgcolor: values.vendor ? C.vendorBg : C.bg,
                        border: `1px solid ${values.vendor ? C.vendorBorder : C.border}`,
                        height: "100%", boxSizing: "border-box",
                      }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: values.vendor ? C.vendorBlue : C.muted }}>
                          Vendor
                        </Typography>
                        <Switch
                          checked={values.vendor}
                          onChange={(e) => setFieldValue("vendor", e.target.checked)}
                          size="small"
                        />
                      </Box>
                    </Grid>

                  </Grid>
                </Card>

              </Stack>
            </DialogContent>

            <DialogActions sx={{
              p: "12px 18px", bgcolor: C.surface,
              borderTop: `1px solid ${C.border}`,
              flexDirection: { xs: "column-reverse", sm: "row" }, gap: 1,
            }}>
              <Button
                onClick={onClose} fullWidth={fullScreen}
                sx={{ color: C.muted, fontWeight: 600, fontSize: 13, textTransform: "none", borderRadius: "8px", border: `1px solid ${C.border}` }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit} variant="contained" disabled={isSubmitting} fullWidth={fullScreen}
                sx={{ bgcolor: C.accent, color: "#fff", fontWeight: 700, fontSize: 13, textTransform: "none", borderRadius: "8px", px: 3 }}
              >
                Update Transaction
              </Button>
            </DialogActions>

          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default TransactionEditModal;