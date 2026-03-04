// // src/features/reports/components/TransactionEditModal.jsx
// import React from "react";
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   IconButton, Stack, TextField, Button, MenuItem,
//   Switch, Typography, Grid, Box,
// } from "@mui/material";
// import {
//   Close as CloseIcon,
//   LockOutlined as LockIcon,
//   Receipt as ReceiptIcon,
// } from "@mui/icons-material";
// import { Formik, Form } from "formik";

// /* ── Light theme palette matching the screenshot ── */
// const C = {
//   bg:          "#f8fafc",
//   surface:     "#ffffff",
//   border:      "#e2e8f0",
//   borderFocus: "#3b82f6",
//   accent:      "#16a34a",
//   accentHover: "#15803d",
//   text:        "#0f172a",
//   muted:       "#64748b",
//   success:     "#16a34a",
//   successBg:   "#dcfce7",
//   successBorder:"#86efac",
//   error:       "#dc2626",
//   vendorBlue:  "#2563eb",
//   vendorBg:    "#eff6ff",
//   vendorBorder:"#93c5fd",
//   disabled:    "#f1f5f9",
//   disabledText:"#94a3b8",
// };

// const fieldSx = {
//   "& .MuiOutlinedInput-root": {
//     bgcolor: C.surface,
//     borderRadius: "8px",
//     color: C.text,
//     fontSize: 13.5,
//     fontFamily: "'Inter', sans-serif",
//     "& fieldset": { borderColor: C.border },
//     "&:hover fieldset": { borderColor: "#94a3b8" },
//     "&.Mui-focused fieldset": { borderColor: C.borderFocus, borderWidth: 1.5 },
//     "&.Mui-disabled": { bgcolor: C.disabled },
//     "&.Mui-disabled fieldset": { borderColor: C.border, borderStyle: "dashed" },
//     "&.Mui-disabled input": { color: C.disabledText, WebkitTextFillColor: C.disabledText },
//   },
//   "& .MuiInputLabel-root": { color: C.muted, fontSize: 13, fontFamily: "'Inter', sans-serif" },
//   "& .MuiInputLabel-root.Mui-focused": { color: C.borderFocus },
//   "& .MuiInputLabel-root.Mui-disabled": { color: C.disabledText },
//   "& .MuiSelect-icon": { color: C.muted },
// };

// const SectionLabel = ({ children }) => (
//   <Typography sx={{
//     fontSize: 10.5, fontWeight: 700, letterSpacing: "0.09em",
//     textTransform: "uppercase", color: C.muted, mb: 1.5,
//     fontFamily: "'Inter', sans-serif",
//   }}>
//     {children}
//   </Typography>
// );

// const Card = ({ children, sx = {} }) => (
//   <Box sx={{
//     bgcolor: C.surface,
//     border: `1px solid ${C.border}`,
//     borderRadius: "12px",
//     p: "16px 18px",
//     ...sx,
//   }}>
//     {children}
//   </Box>
// );

// const TransactionEditModal = ({ open, onClose, initialData, onSave }) => {
//   if (!initialData) return null;

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: {
//           bgcolor: C.bg,
//           backgroundImage: "none",
//           borderRadius: "16px",
//           border: `1px solid ${C.border}`,
//           boxShadow: "0 20px 60px -10px rgba(0,0,0,0.12), 0 8px 24px -6px rgba(0,0,0,0.06)",
//           overflow: "hidden",
//         }
//       }}
//     >
//       {/* ── Header ── */}
//       <DialogTitle sx={{
//         p: "14px 18px",
//         borderBottom: `1px solid ${C.border}`,
//         display: "flex", justifyContent: "space-between", alignItems: "center",
//         bgcolor: C.surface,
//       }}>
//         <Stack direction="row" spacing={1.5} alignItems="center">
//           <Box sx={{
//             width: 34, height: 34, borderRadius: "8px",
//             bgcolor: "#f0fdf4", border: `1px solid ${C.successBorder}`,
//             display: "flex", alignItems: "center", justifyContent: "center",
//           }}>
//             <ReceiptIcon sx={{ fontSize: 17, color: C.success }} />
//           </Box>
//           <Box>
//             <Typography sx={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: "'Inter', sans-serif", lineHeight: 1.3 }}>
//               Update Transaction
//             </Typography>
//             <Typography sx={{ fontSize: 11.5, color: C.muted, fontFamily: "'Inter', sans-serif" }}>
//               System Reconciliation Tool
//             </Typography>
//           </Box>
//         </Stack>

//         <IconButton onClick={onClose} size="small" sx={{
//           color: C.muted, bgcolor: C.bg,
//           border: `1px solid ${C.border}`, borderRadius: "7px",
//           width: 28, height: 28,
//           "&:hover": { bgcolor: C.border, color: C.text },
//         }}>
//           <CloseIcon sx={{ fontSize: 15 }} />
//         </IconButton>
//       </DialogTitle>

//       <Formik
//         initialValues={{
//           ...initialData,
//           status: initialData.status || "mismatch",
//           own_db: !!initialData.own_db || !!initialData.ownDb,
//           vendor: !!initialData.vendor,
//         }}
//         enableReinitialize
//         onSubmit={onSave}
//       >
//         {({ values, handleChange, setFieldValue, handleSubmit, isSubmitting }) => (
//           <Form>
//             <DialogContent sx={{ p: "16px 18px", bgcolor: C.bg }}>
//               <Stack spacing={1.5}>

//                 {/* ── Transaction ID (read-only) ── */}
//                 <Card sx={{ bgcolor: "#fafbff", border: "1px solid #e0e7ff" }}>
//                   <SectionLabel>Transaction Reference</SectionLabel>
//                   <TextField
//                     fullWidth label="Transaction ID"
//                     value={values.trxId || values.transaction_id || "N/A"}
//                     size="small" disabled
//                     InputProps={{
//                       endAdornment: <LockIcon sx={{ fontSize: 14, color: C.disabledText }} />,
//                     }}
//                     sx={fieldSx}
//                   />
//                 </Card>

//                 {/* ── Basic Information ── */}
//                 <Card>
//                   <SectionLabel>Basic Information</SectionLabel>
//                   <Grid container spacing={1.5}>
//                     <Grid item xs={6}>
//                       <TextField fullWidth label="Sender Number" name="senderWallet"
//                         value={values.senderWallet || ""} onChange={handleChange} size="small" sx={fieldSx} />
//                     </Grid>
//                     <Grid item xs={6}>
//                       <TextField fullWidth label="Customer ID" name="userId"
//                         value={values.userId || ""} onChange={handleChange} size="small" sx={fieldSx} />
//                     </Grid>
//                     <Grid item xs={6}>
//                       <TextField fullWidth label="Channel" name="channel"
//                         value={values.channel || ""} onChange={handleChange} size="small" sx={fieldSx} />
//                     </Grid>
//                     <Grid item xs={6}>
//                       <TextField fullWidth label="Wallet" name="wallet"
//                         value={values.wallet || ""} onChange={handleChange} size="small" sx={fieldSx} />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField fullWidth label="Entity Name" name="entity"
//                         value={values.entity || ""} onChange={handleChange} size="small" sx={fieldSx} />
//                     </Grid>
//                   </Grid>
//                 </Card>

//                 {/* ── Financial Details ── */}
//                 <Card>
//                   <SectionLabel>Financial Details</SectionLabel>
//                   <Grid container spacing={1.5}>
//                     <Grid item xs={6}>
//                       <TextField fullWidth label="Amount" name="amount" type="number"
//                         value={values.amount || ""} onChange={handleChange} size="small" sx={fieldSx} />
//                     </Grid>
//                     <Grid item xs={6}>
//                       <TextField
//                         select fullWidth label="Status" name="status"
//                         value={values.status} onChange={handleChange} size="small"
//                         sx={{
//                           ...fieldSx,
//                           "& .MuiSelect-select": {
//                             fontWeight: 700,
//                             color: values.status === "matched" ? C.success : C.error,
//                           },
//                         }}
//                         SelectProps={{
//                           MenuProps: {
//                             PaperProps: {
//                               sx: {
//                                 borderRadius: "10px", border: `1px solid ${C.border}`,
//                                 boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
//                                 "& .MuiMenuItem-root": { fontSize: 13, fontFamily: "'Inter', sans-serif" },
//                               }
//                             }
//                           }
//                         }}
//                       >
//                         <MenuItem value="matched" sx={{ color: C.success, fontWeight: 700 }}>Matched</MenuItem>
//                         <MenuItem value="mismatch" sx={{ color: C.error, fontWeight: 700 }}>Mismatch</MenuItem>
//                       </TextField>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <TextField fullWidth label="Vendor Date" name="date" type="date"
//                         value={values.date || ""} onChange={handleChange}
//                         size="small" InputLabelProps={{ shrink: true }} sx={fieldSx} />
//                     </Grid>
//                     <Grid item xs={6}>
//                       <TextField fullWidth label="Billing Date" name="billing_date" type="date"
//                         value={values.billing_date || ""} onChange={handleChange}
//                         size="small" InputLabelProps={{ shrink: true }} sx={fieldSx} />
//                     </Grid>
//                   </Grid>
//                 </Card>

//                 {/* ── Verification Flags ── */}
//                 <Card>
//                   <SectionLabel>Verification Flags</SectionLabel>
//                   <Grid container spacing={1.5}>
//                     <Grid item xs={6}>
//                       <Box sx={{
//                         display: "flex", alignItems: "center", justifyContent: "space-between",
//                         px: 1.5, py: 1.2, borderRadius: "8px",
//                         bgcolor: values.own_db ? C.successBg : C.bg,
//                         border: `1px solid ${values.own_db ? C.successBorder : C.border}`,
//                         transition: "all 0.18s ease",
//                       }}>
//                         <Typography sx={{
//                           fontSize: 12.5, fontWeight: 600,
//                           color: values.own_db ? C.success : C.muted,
//                           fontFamily: "'Inter', sans-serif",
//                         }}>
//                           Own DB
//                         </Typography>
//                         <Switch
//                           checked={values.own_db}
//                           onChange={(e) => setFieldValue("own_db", e.target.checked)}
//                           size="small"
//                           sx={{
//                             "& .MuiSwitch-switchBase.Mui-checked": { color: C.success },
//                             "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: C.successBorder },
//                           }}
//                         />
//                       </Box>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Box sx={{
//                         display: "flex", alignItems: "center", justifyContent: "space-between",
//                         px: 1.5, py: 1.2, borderRadius: "8px",
//                         bgcolor: values.vendor ? C.vendorBg : C.bg,
//                         border: `1px solid ${values.vendor ? C.vendorBorder : C.border}`,
//                         transition: "all 0.18s ease",
//                       }}>
//                         <Typography sx={{
//                           fontSize: 12.5, fontWeight: 600,
//                           color: values.vendor ? C.vendorBlue : C.muted,
//                           fontFamily: "'Inter', sans-serif",
//                         }}>
//                           Vendor
//                         </Typography>
//                         <Switch
//                           checked={values.vendor}
//                           onChange={(e) => setFieldValue("vendor", e.target.checked)}
//                           size="small"
//                           sx={{
//                             "& .MuiSwitch-switchBase.Mui-checked": { color: C.vendorBlue },
//                             "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: C.vendorBorder },
//                           }}
//                         />
//                       </Box>
//                     </Grid>
//                   </Grid>
//                 </Card>

//               </Stack>
//             </DialogContent>

//             {/* ── Actions ── */}
//             <DialogActions sx={{
//               p: "12px 18px", bgcolor: C.surface,
//               borderTop: `1px solid ${C.border}`, gap: 1,
//             }}>
//               <Button
//                 onClick={onClose}
//                 sx={{
//                   color: C.muted, fontWeight: 600, fontSize: 13,
//                   textTransform: "none", borderRadius: "8px", px: 2.5,
//                   fontFamily: "'Inter', sans-serif",
//                   border: `1px solid ${C.border}`,
//                   "&:hover": { bgcolor: C.bg, borderColor: "#94a3b8", color: C.text },
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleSubmit}
//                 variant="contained"
//                 disabled={isSubmitting}
//                 sx={{
//                   bgcolor: C.accent, color: "#fff",
//                   fontWeight: 700, fontSize: 13,
//                   textTransform: "none", borderRadius: "8px", px: 3,
//                   fontFamily: "'Inter', sans-serif",
//                   boxShadow: "0 2px 8px rgba(22,163,74,0.25)",
//                   "&:hover": { bgcolor: C.accentHover, boxShadow: "0 4px 12px rgba(22,163,74,0.35)" },
//                   "&.Mui-disabled": { bgcolor: C.border, color: C.disabledText, boxShadow: "none" },
//                 }}
//               >
//                 Update Transaction
//               </Button>
//             </DialogActions>
//           </Form>
//         )}
//       </Formik>
//     </Dialog>
//   );
// };

// export default TransactionEditModal;


import React from "react";
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

/* ── Light theme palette ── */
const C = {
  bg:          "#f8fafc",
  surface:     "#ffffff",
  border:      "#e2e8f0",
  borderFocus: "#3b82f6",
  accent:      "#16a34a",
  accentHover: "#15803d",
  text:        "#0f172a",
  muted:       "#64748b",
  success:     "#16a34a",
  successBg:   "#dcfce7",
  successBorder:"#86efac",
  error:       "#dc2626",
  vendorBlue:  "#2563eb",
  vendorBg:    "#eff6ff",
  vendorBorder:"#93c5fd",
  disabled:    "#f1f5f9",
  disabledText:"#94a3b8",
};

/* ── Custom Field Styles (Fixed transform and background) ── */
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
    bgcolor: C.surface, // Prevents border line strike-through
    px: 0.5,
  }
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

const TransactionEditModal = ({ open, onClose, initialData, onSave }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
        }
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
          status: initialData.status || "mismatch",
          own_db: !!initialData.own_db || !!initialData.ownDb,
          vendor: !!initialData.vendor,
        }}
        enableReinitialize
        onSubmit={onSave}
      >
        {({ values, handleChange, setFieldValue, handleSubmit, isSubmitting }) => (
          <Form style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <DialogContent sx={{ p: { xs: "16px", sm: "20px" }, bgcolor: C.bg, flexGrow: 1, overflowY: "auto" }}>
              <Stack spacing={2}>

                <Card sx={{ bgcolor: "#fafbff", border: "1px solid #e0e7ff" }}>
                  <SectionLabel>Transaction Reference</SectionLabel>
                  <TextField
                    fullWidth label="Transaction ID"
                    value={values.trxId || values.transaction_id || "N/A"}
                    size="small" disabled
                    InputProps={{ endAdornment: <LockIcon sx={{ fontSize: 14, color: C.disabledText }} /> }}
                    sx={fieldSx}
                  />
                </Card>

                <Card>
                  <SectionLabel>Basic Information</SectionLabel>
                  <Grid container spacing={1.5}>
                    {/* Consistent 50% width fields */}
                    <TextField 
                        fullWidth 
                        label="Sender" 
                        name="senderWallet" 
                        value={values.senderWallet || ""} 
                        onChange={handleChange} 
                        size="small" 
                        sx={fieldSx} 
                    />

                    <TextField 
                        fullWidth 
                        label="User ID" 
                        name="userId" 
                        value={values.userId || ""} 
                        onChange={handleChange} 
                        size="small" 
                        sx={fieldSx} 
                    />

                    <TextField 
                        fullWidth 
                        label="Channel" 
                        name="channel" 
                        value={values.channel || ""} 
                        onChange={handleChange} 
                        size="small" 
                        sx={fieldSx} 
                    />

                    <TextField 
                        fullWidth 
                        label="Wallet" 
                        name="wallet" 
                        value={values.wallet || ""} 
                        onChange={handleChange} 
                        size="small" 
                        sx={fieldSx} 
                    />
                    
                    <TextField 
                        fullWidth 
                        label="Entity" 
                        name="entity" 
                        value={values.entity || ""} 
                        onChange={handleChange} 
                        size="small" 
                        sx={fieldSx} 
                    />
                    
                  </Grid>
                </Card>

                <Card>
                    <SectionLabel>Financial Details</SectionLabel>
                    {/* Added justifyContent="center" to align items in the middle */}
                    <Grid container spacing={1.5} justifyContent="center">
                        
                        {/* First Row: Amount and Status centered */}
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                fullWidth label="Amount" name="amount" type="number" 
                                value={values.amount || ""} onChange={handleChange} 
                                size="small" sx={fieldSx} 
                            />
                        </Grid>

                        {/* Second Row: Dates centered */}
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
                    {/* Added justifyContent="center" to keep fields balanced in the middle */}
                    <Grid container spacing={1.5} justifyContent="center">
                        
                        {/* Status Dropdown - 100% on mobile, 50% on desktop */}
                        <Grid item xs={12} sm={6}>
                        <TextField 
                            select 
                            fullWidth 
                            label="Status" 
                            name="status" 
                            value={values.status} 
                            onChange={handleChange} 
                            size="small"
                            sx={{ 
                            ...fieldSx, 
                            "& .MuiSelect-select": { 
                                fontWeight: 700, 
                                color: values.status === "matched" ? C.success : C.error 
                            } 
                            }}
                        >
                            <MenuItem value="matched">Matched</MenuItem>
                            <MenuItem value="mismatch">Mismatch</MenuItem>
                        </TextField>
                        </Grid>

                        {/* Own DB Switch - 100% on mobile, 50% on desktop */}
                        <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "space-between", 
                            px: 1.5, 
                            py: 0.8, // Slightly tighter padding to match text fields
                            borderRadius: "8px", 
                            bgcolor: values.own_db ? C.successBg : C.bg, 
                            border: `1px solid ${values.own_db ? C.successBorder : C.border}`,
                            height: "100%", // Ensures it matches the height of the Status field
                            boxSizing: "border-box"
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

                        {/* Vendor Switch - 100% on mobile, 50% on desktop */}
                        <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "space-between", 
                            px: 1.5, 
                            py: 0.8, 
                            borderRadius: "8px", 
                            bgcolor: values.vendor ? C.vendorBg : C.bg, 
                            border: `1px solid ${values.vendor ? C.vendorBorder : C.border}`,
                            height: "100%",
                            boxSizing: "border-box"
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

            <DialogActions sx={{ p: "12px 18px", bgcolor: C.surface, borderTop: `1px solid ${C.border}`, flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: 1 }}>
              <Button onClick={onClose} fullWidth={fullScreen} sx={{ color: C.muted, fontWeight: 600, fontSize: 13, textTransform: "none", borderRadius: "8px", border: `1px solid ${C.border}` }}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting} fullWidth={fullScreen} sx={{ bgcolor: C.accent, color: "#fff", fontWeight: 700, fontSize: 13, textTransform: "none", borderRadius: "8px", px: 3 }}>Update Transaction</Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default TransactionEditModal;