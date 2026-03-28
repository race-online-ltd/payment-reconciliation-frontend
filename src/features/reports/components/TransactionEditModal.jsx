// import React, { useEffect, useState } from "react";
// import api from "../../../api/axios";
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   IconButton, Stack, TextField, Button, MenuItem,
//   Switch, Typography, Box, useMediaQuery, useTheme
// } from "@mui/material";
// import {
//   Close as CloseIcon,
//   LockOutlined as LockIcon,
//   Receipt as ReceiptIcon,
// } from "@mui/icons-material";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";

// /* ─── palette ─────────────────────────────────────────────────── */
// const C = {
//   bg:"#f8fafc",
//   surface:"#ffffff",
//   border:"#e2e8f0",
//   borderFocus:"#3b82f6",
//   accent:"#16a34a",
//   accentHover:"#15803d",
//   text:"#0f172a",
//   muted:"#64748b",
//   success:"#16a34a",
//   successBg:"#dcfce7",
//   successBorder:"#86efac",
//   vendorBlue:"#2563eb",
//   vendorBg:"#eff6ff",
//   vendorBorder:"#93c5fd",
//   disabled:"#f1f5f9",
//   disabledText:"#94a3b8",
// };

// /* ─── shared field styles ──────────────────────────────────────── */
// const fieldSx = {
//   "& .MuiOutlinedInput-root":{
//     bgcolor:C.surface,
//     borderRadius:"8px",
//     fontSize:13,
//     "& input":{padding:"8.5px 12px"},
//     "& fieldset":{borderColor:C.border},
//     "&:hover fieldset":{borderColor:"#94a3b8"},
//     "&.Mui-focused fieldset":{borderColor:C.borderFocus,borderWidth:1.5},
//   },
//   "& .MuiInputLabel-root":{
//     fontSize:12,
//     transform:"translate(14px, 9px) scale(1)",
//   },
//   "& .MuiInputLabel-shrink":{
//     transform:"translate(14px, -8px) scale(0.75)",
//     bgcolor:C.surface,
//     px:0.5,
//   },
//   "& .MuiFormHelperText-root":{
//     fontSize:10.5,
//     mx:0,
//     mt:0.5,
//   },
// };

// /* ─── date field styles — cursor pointer so the whole field feels clickable ── */
// const dateSx = {
//   ...fieldSx,
//   "& .MuiOutlinedInput-root":{
//     ...fieldSx["& .MuiOutlinedInput-root"],
//     cursor:"pointer",
//     "& input":{
//       ...fieldSx["& .MuiOutlinedInput-root"]["& input"],
//       cursor:"pointer",
//     },
//   },
// };

// /* ─── Yup validation schema ────────────────────────────────────── */
// const validationSchema = Yup.object({
//   senderWallet: Yup.string()
//     .required("Sender number is required")
//     .matches(/^\d+$/, "Only digits are allowed")
//     .min(10, "Must be at least 10 digits")
//     .max(13, "Must be at most 13 digits"),

//   userId: Yup.string()
//     .required("User ID is required")
//     .min(2, "User ID must be at least 2 characters"),

//   entity: Yup.string()
//     .required("Entity is required")
//     .min(2, "Entity must be at least 2 characters"),

//   amount: Yup.number()
//     .typeError("Amount must be a number")
//     .required("Amount is required")
//     .positive("Amount must be greater than 0"),

//   channel_id: Yup.string()
//     .required("Channel is required"),

//   wallet_id: Yup.string()
//     .required("Wallet is required"),

//   vendor_trx_date: Yup.string()
//     .required("Vendor date is required"),

//   vendor: Yup.boolean()
//     .oneOf([true], "Vendor must be confirmed"),

//   billing_trx_date: Yup.string()
//     .required("Billing system date is required"),

//   own_db: Yup.boolean()
//     .oneOf([true], "Billing system must be confirmed"),

//   billing_system_id: Yup.string()
//     .required("Billing system selection is required"),

//   status: Yup.string()
//     .oneOf(["matched", "mismatch"], "Invalid status")
//     .required("Status is required"),
// });

// /* ─── small UI helpers ─────────────────────────────────────────── */
// const SectionLabel = ({ children }) => (
//   <Typography sx={{
//     fontSize:10.5, fontWeight:700, letterSpacing:"0.09em",
//     textTransform:"uppercase", color:C.muted, mb:1.5,
//   }}>
//     {children}
//   </Typography>
// );

// const Card = ({ children }) => (
//   <Box sx={{
//     bgcolor:C.surface,
//     border:`1px solid ${C.border}`,
//     borderRadius:"12px",
//     p:{xs:"14px", sm:"16px"},
//   }}>
//     {children}
//   </Box>
// );

// /* ─── helper: open native date picker on any click inside the field ── */
// const openDatePicker = (e) => {
//   const input = e.currentTarget.querySelector('input[type="date"]');
//   if (input && typeof input.showPicker === "function") {
//     input.showPicker();
//   }
// };

// /* ─── wallet fetcher ───────────────────────────────────────────── */
// const WalletFetcher = ({ channelId, onWalletsFetched }) => {
//   useEffect(() => {
//     if (!channelId) { onWalletsFetched([]); return; }
//     api.get("/wallets").then(res => {
//       const data = res.data.data ?? [];
//       const filtered = data
//         .filter(w => w.payment_channel?.id === channelId || w.payment_channel_id === channelId)
//         .map(w => ({ id: w.id, label: w.wallet_number }));
//       onWalletsFetched(filtered);
//     });
//   }, [channelId]);
//   return null;
// };

// /* ─── main component ───────────────────────────────────────────── */
// const TransactionEditModal = ({ open, onClose, initialData, onSave }) => {

//   const theme      = useTheme();
//   const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

//   const [channels,       setChannels]       = useState([]);
//   const [wallets,        setWallets]        = useState([]);
//   const [loadingWallets, setLoadingWallets] = useState(false);
//   const [billingSystems, setBillingSystems] = useState([]);

//   useEffect(() => {
//     if (!open) return;

//     api.get("/payment-channels").then(res => {
//       const data = res.data.data ?? [];
//       setChannels(data.map(c => ({ id: c.id, label: c.channel_name })));
//     });

//     api.get("/billing-systems").then(res => {
//       const data = res.data.data ?? [];
//       setBillingSystems(data.map(b => ({ id: b.id, label: b.billing_name })));
//     });
//   }, [open]);

//   if (!initialData) return null;

//   /* wire Formik touched+errors into MUI error/helperText props */
//   const fp = (name, errors, touched) => ({
//     error:      !!(touched[name] && errors[name]),
//     helperText: touched[name] && errors[name] ? errors[name] : "",
//   });

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullScreen={fullScreen}
//       maxWidth="sm"
//       fullWidth
//       scroll="paper"
//       PaperProps={{
//         sx:{
//           bgcolor:C.bg,
//           borderRadius:fullScreen ? 0 : "16px",
//           border:fullScreen ? "none" : `1px solid ${C.border}`,
//           display:"flex",
//           flexDirection:"column",
//           maxHeight:fullScreen ? "100%" : "calc(100% - 64px)",
//         },
//       }}
//     >

//       {/* ── header ── */}
//       <DialogTitle sx={{
//         p:"14px 18px",
//         borderBottom:`1px solid ${C.border}`,
//         display:"flex",
//         justifyContent:"space-between",
//         alignItems:"center",
//         bgcolor:C.surface,
//       }}>
//         <Stack direction="row" spacing={1.5} alignItems="center">
//           <Box sx={{
//             width:34, height:34, borderRadius:"8px",
//             bgcolor:"#f0fdf4", border:`1px solid ${C.successBorder}`,
//             display:"flex", alignItems:"center", justifyContent:"center",
//           }}>
//             <ReceiptIcon sx={{ fontSize:17, color:C.success }} />
//           </Box>
//           <Box>
//             <Typography sx={{ fontSize:14, fontWeight:700, color:C.text }}>
//               Update Transaction
//             </Typography>
//             <Typography sx={{ fontSize:11, color:C.muted }}>
//               System Reconciliation Tool
//             </Typography>
//           </Box>
//         </Stack>

//         <IconButton onClick={onClose} size="small" sx={{ border:`1px solid ${C.border}` }}>
//           <CloseIcon sx={{ fontSize:15 }} />
//         </IconButton>
//       </DialogTitle>

//       {/* ── Formik ── */}
//       <Formik
//         initialValues={{
//           ...initialData,
//           status:            initialData.status            || "mismatch",
//           own_db:            !!initialData.own_db          || !!initialData.ownDb,
//           vendor:            !!initialData.vendor,
//           channel_id:        initialData.channel_id        || "",
//           wallet_id:         initialData.wallet_id         || "",
//           vendor_trx_date:   initialData.vendor_trx_date   || "",
//           billing_trx_date:  initialData.billing_trx_date  || "",
//           billing_system_id: initialData.billing_system_id || "",
//         }}
//         enableReinitialize
//         validationSchema={validationSchema}
//         onSubmit={onSave}
//       >
//         {({
//           values, errors, touched,
//           handleChange, handleBlur,
//           setFieldValue, setFieldTouched,
//           handleSubmit, isSubmitting, isValid, dirty,
//         }) => (

//           <Form style={{ display:"flex", flexDirection:"column", height:"100%" }}>

//             <WalletFetcher
//               channelId={values.channel_id}
//               onWalletsFetched={(list) => {
//                 setWallets(list);
//                 setLoadingWallets(false);
//               }}
//             />

//             <DialogContent sx={{ p:"20px", flexGrow:1, overflowY:"auto" }}>
//               <Stack spacing={2}>

//                 {/* ══ Transaction Details ══ */}
//                 <Card>
//                   <SectionLabel>Transaction Details</SectionLabel>
//                   <Stack spacing={1.5}>

//                     {/* Transaction ID — read-only */}
//                     <TextField
//                       fullWidth
//                       label="Transaction ID"
//                       value={values.trxId || values.transaction_id || "N/A"}
//                       size="small"
//                       disabled
//                       InputProps={{
//                         endAdornment: <LockIcon sx={{ fontSize:14, color:C.disabledText }} />,
//                       }}
//                       sx={fieldSx}
//                     />

//                     {/* Sender No. */}
//                     <TextField
//                       fullWidth
//                       label="Sender No."
//                       name="senderWallet"
//                       value={values.senderWallet || ""}
//                       onChange={(e) => {
//                         const val = e.target.value.replace(/\D/g, "").slice(0, 13);
//                         setFieldValue("senderWallet", val);
//                       }}
//                       onBlur={() => setFieldTouched("senderWallet", true)}
//                       size="small"
//                       {...fp("senderWallet", errors, touched)}
//                       sx={fieldSx}
//                     />

//                     {/* User ID */}
//                     <TextField
//                       fullWidth
//                       label="User ID"
//                       name="userId"
//                       value={values.userId || ""}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       size="small"
//                       {...fp("userId", errors, touched)}
//                       sx={fieldSx}
//                     />

//                     {/* Entity */}
//                     <TextField
//                       fullWidth
//                       label="Entity"
//                       name="entity"
//                       value={values.entity || ""}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       size="small"
//                       {...fp("entity", errors, touched)}
//                       sx={fieldSx}
//                     />

//                     {/* Amount */}
//                     <TextField
//                       fullWidth
//                       label="Amount"
//                       name="amount"
//                       type="number"
//                       value={values.amount || ""}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       size="small"
//                       {...fp("amount", errors, touched)}
//                       sx={fieldSx}
//                     />

//                   </Stack>
//                 </Card>

//                 {/* ══ Database Verification ══ */}
//                 <Card>
//                   <SectionLabel>Payment Getway</SectionLabel>
//                   <Stack spacing={1.5}>

//                     {/* Channel */}
//                     <TextField
//                       select
//                       fullWidth
//                       label="Channel"
//                       name="channel_id"
//                       value={values.channel_id || ""}
//                       onChange={(e) => {
//                         setFieldValue("channel_id", e.target.value);
//                         setFieldValue("wallet_id", "");
//                         setLoadingWallets(true);
//                       }}
//                       onBlur={() => setFieldTouched("channel_id", true)}
//                       size="small"
//                       {...fp("channel_id", errors, touched)}
//                       sx={fieldSx}
//                     >
//                       {channels.map(c => (
//                         <MenuItem key={c.id} value={c.id}>{c.label}</MenuItem>
//                       ))}
//                     </TextField>

//                     {/* Wallet */}
//                     <TextField
//                       select
//                       fullWidth
//                       label="Wallet"
//                       name="wallet_id"
//                       value={values.wallet_id || ""}
//                       onChange={(e) => setFieldValue("wallet_id", e.target.value)}
//                       onBlur={() => setFieldTouched("wallet_id", true)}
//                       size="small"
//                       disabled={!values.channel_id || loadingWallets}
//                       {...fp("wallet_id", errors, touched)}
//                       sx={fieldSx}
//                     >
//                       {loadingWallets
//                         ? <MenuItem disabled>Loading...</MenuItem>
//                         : wallets.map(w => (
//                             <MenuItem key={w.id} value={w.id}>{w.label}</MenuItem>
//                           ))
//                       }
//                     </TextField>

//                     {/* Vendor Date — click anywhere to open picker */}
//                     <Box onClick={openDatePicker} sx={{ cursor:"pointer" }}>
//                       <TextField
//                         fullWidth
//                         label="Vendor Date"
//                         name="vendor_trx_date"
//                         type="date"
//                         value={values.vendor_trx_date || ""}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         size="small"
//                         InputLabelProps={{ shrink: true }}
//                         {...fp("vendor_trx_date", errors, touched)}
//                         sx={dateSx}
//                       />
//                     </Box>

//                     {/* Vendor switch */}
//                     <Box>
//                       <Box sx={{
//                         display:"flex", justifyContent:"space-between",
//                         px:1.5, py:0.8, borderRadius:"8px",
//                         bgcolor: values.vendor ? C.vendorBg : C.bg,
//                         border:`1px solid ${
//                           touched.vendor && errors.vendor ? "#ef4444"
//                           : values.vendor ? C.vendorBorder : C.border
//                         }`,
//                       }}>
//                         <Typography sx={{ fontSize:12, fontWeight:600 }}>Vendor</Typography>
//                         <Switch
//                           checked={values.vendor}
//                           disabled={!values.channel_id || !values.wallet_id || !values.vendor_trx_date}
//                           onChange={(e) => {
//                             const checked = e.target.checked;
//                             setFieldValue("vendor", checked);
//                             setFieldTouched("vendor", true);
//                             // ── auto-status: matched when both switches ON ──
//                             if (checked && values.own_db) {
//                               setFieldValue("status", "matched");
//                             } else {
//                               setFieldValue("status", "mismatch");
//                             }
//                           }}
//                           size="small"
//                         />
//                       </Box>
//                       {touched.vendor && errors.vendor && (
//                         <Typography sx={{ fontSize:10.5, color:"#ef4444", mt:0.5 }}>
//                           {errors.vendor}
//                         </Typography>
//                       )}
//                     </Box>

//                   </Stack>
//                 </Card>

//                 {/* ══ Billing System ══ */}
//                 <Card>
//                   <SectionLabel>Billing System</SectionLabel>
//                   <Stack spacing={1.5}>

//                     {/* Billing System Date — click anywhere to open picker */}
//                     <Box onClick={openDatePicker} sx={{ cursor:"pointer" }}>
//                       <TextField
//                         fullWidth
//                         label="Billing System Date"
//                         name="billing_trx_date"
//                         type="date"
//                         value={values.billing_trx_date || ""}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         size="small"
//                         InputLabelProps={{ shrink: true }}
//                         {...fp("billing_trx_date", errors, touched)}
//                         sx={dateSx}
//                       />
//                     </Box>

//                     {/* Billing System switch */}
//                     <Box>
//                       <Box sx={{
//                         display:"flex", justifyContent:"space-between",
//                         px:1.5, py:0.8, borderRadius:"8px",
//                         bgcolor: values.own_db ? C.successBg : C.bg,
//                         border:`1px solid ${
//                           touched.own_db && errors.own_db ? "#ef4444"
//                           : values.own_db ? C.successBorder : C.border
//                         }`,
//                       }}>
//                         <Typography sx={{ fontSize:12, fontWeight:600 }}>Billing System</Typography>
//                         <Switch
//                           checked={values.own_db}
//                           disabled={!values.billing_trx_date}
//                           onChange={(e) => {
//                             const checked = e.target.checked;
//                             setFieldValue("own_db", checked);
//                             setFieldTouched("own_db", true);
//                             if (!checked) setFieldValue("billing_system_id", "");
//                             // ── auto-status: matched when both switches ON ──
//                             if (checked && values.vendor) {
//                               setFieldValue("status", "matched");
//                             } else {
//                               setFieldValue("status", "mismatch");
//                             }
//                           }}
//                           size="small"
//                         />
//                       </Box>
//                       {touched.own_db && errors.own_db && (
//                         <Typography sx={{ fontSize:10.5, color:"#ef4444", mt:0.5 }}>
//                           {errors.own_db}
//                         </Typography>
//                       )}
//                     </Box>

//                     {/* Billing System dropdown */}
//                     <TextField
//                       select
//                       fullWidth
//                       label="Billing System"
//                       name="billing_system_id"
//                       value={values.billing_system_id || ""}
//                       onChange={(e) => setFieldValue("billing_system_id", e.target.value)}
//                       onBlur={() => setFieldTouched("billing_system_id", true)}
//                       size="small"
//                       disabled={!values.own_db}
//                       {...fp("billing_system_id", errors, touched)}
//                       sx={fieldSx}
//                     >
//                       {billingSystems.length === 0
//                         ? <MenuItem disabled>No options</MenuItem>
//                         : billingSystems.map(b => (
//                             <MenuItem key={b.id} value={b.id}>{b.label}</MenuItem>
//                           ))
//                       }
//                     </TextField>
//                   </Stack>
//                 </Card>

//                 {/* ══ Status ══ */}
//                 <Card>
//                   <SectionLabel>Status</SectionLabel>
//                   <Stack spacing={1.5}>

//                     {/* Status */}
//                     <TextField
//                       select
//                       fullWidth
//                       label="Status"
//                       name="status"
//                       value={values.status}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       size="small"
//                       disabled={!values.vendor || !values.own_db}
//                       {...fp("status", errors, touched)}
//                       sx={fieldSx}
//                     >
//                       <MenuItem value="matched">Matched</MenuItem>
//                       <MenuItem value="mismatch">Mismatch</MenuItem>
//                     </TextField>

//                   </Stack>
//                 </Card>

//               </Stack>
//             </DialogContent>

//             {/* ── footer ── */}
//             <DialogActions sx={{
//               p:"12px 18px",
//               bgcolor:C.surface,
//               borderTop:`1px solid ${C.border}`,
//               gap:1,
//             }}>
//               <Button
//                 onClick={onClose}
//                 sx={{
//                   color:C.muted, fontWeight:600, fontSize:13,
//                   textTransform:"none", borderRadius:"8px",
//                   border:`1px solid ${C.border}`,
//                 }}
//               >
//                 Cancel
//               </Button>

//               <Button
//                 onClick={handleSubmit}
//                 variant="contained"
//                 disabled={isSubmitting || !isValid || !dirty}
//                 sx={{
//                   bgcolor:C.accent, color:"#fff",
//                   fontWeight:700, fontSize:13,
//                   textTransform:"none", borderRadius:"8px", px:3,
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





import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Stack, TextField, Button, MenuItem,
  Switch, Typography, Box, useMediaQuery, useTheme
} from "@mui/material";
import {
  Close as CloseIcon,
  LockOutlined as LockIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

/* ─── palette ─────────────────────────────────────────────────── */
const C = {
  bg:"#f8fafc",
  surface:"#ffffff",
  border:"#e2e8f0",
  borderFocus:"#3b82f6",
  accent:"#16a34a",
  accentHover:"#15803d",
  text:"#0f172a",
  muted:"#64748b",
  success:"#16a34a",
  successBg:"#dcfce7",
  successBorder:"#86efac",
  vendorBlue:"#2563eb",
  vendorBg:"#eff6ff",
  vendorBorder:"#93c5fd",
  disabled:"#f1f5f9",
  disabledText:"#94a3b8",
  required:"#ef4444",
};

/* ─── shared field styles ──────────────────────────────────────── */
const fieldSx = {
  "& .MuiOutlinedInput-root":{
    bgcolor:C.surface,
    borderRadius:"8px",
    fontSize:13,
    "& input":{padding:"8.5px 12px"},
    "& fieldset":{borderColor:C.border},
    "&:hover fieldset":{borderColor:"#94a3b8"},
    "&.Mui-focused fieldset":{borderColor:C.borderFocus,borderWidth:1.5},
  },
  "& .MuiInputLabel-root":{
    fontSize:12,
    transform:"translate(14px, 9px) scale(1)",
  },
  "& .MuiInputLabel-shrink":{
    transform:"translate(14px, -8px) scale(0.75)",
    bgcolor:C.surface,
    px:0.5,
  },
  "& .MuiFormHelperText-root":{
    fontSize:10.5,
    mx:0,
    mt:0.5,
  },
};

/* ─── date field styles ─────────────────────────────────────────── */
const dateSx = {
  ...fieldSx,
  "& .MuiOutlinedInput-root":{
    ...fieldSx["& .MuiOutlinedInput-root"],
    cursor:"pointer",
    "& input":{
      ...fieldSx["& .MuiOutlinedInput-root"]["& input"],
      cursor:"pointer",
    },
  },
};

/* ─── Yup validation schema ────────────────────────────────────── */
const validationSchema = Yup.object({
  senderWallet: Yup.string()
    .matches(/^\d+$/, "Only digits are allowed")
    .min(10, "Must be at least 10 digits")
    .max(13, "Must be at most 13 digits"),

  userId: Yup.string()
    .required("User ID is required")
    .min(2, "User ID must be at least 2 characters"),

  entity: Yup.string()
    .required("Entity is required")
    .min(2, "Entity must be at least 2 characters"),

  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .positive("Amount must be greater than 0"),

  channel_id: Yup.string()
    .required("Channel is required"),

  wallet_id: Yup.string()
    .required("Wallet is required"),

  vendor_trx_date: Yup.string()
    .required("Vendor date is required"),

  vendor: Yup.boolean()
    .oneOf([true], "Vendor must be confirmed"),

  billing_trx_date: Yup.string()
    .required("Billing system date is required"),

  own_db: Yup.boolean()
    .oneOf([true], "Billing system must be confirmed"),

  billing_system_id: Yup.string()
    .required("Billing system selection is required"),

  status: Yup.string()
    .oneOf(["matched", "mismatch"], "Invalid status")
    .required("Status is required"),
});

/* ─── small UI helpers ─────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <Typography sx={{
    fontSize:10.5, fontWeight:700, letterSpacing:"0.09em",
    textTransform:"uppercase", color:C.muted, mb:1.5,
  }}>
    {children}
  </Typography>
);

const Card = ({ children }) => (
  <Box sx={{
    bgcolor:C.surface,
    border:`1px solid ${C.border}`,
    borderRadius:"12px",
    p:{xs:"14px", sm:"16px"},
  }}>
    {children}
  </Box>
);

/* ─── RequiredLabel: "Label *" with red asterisk for TextField label prop ── */
const RequiredLabel = ({ label }) => (
  <span>
    {label}
    <span style={{ color: C.required, marginLeft: 2, fontWeight: 700 }}>*</span>
  </span>
);

/* ─── helper: open native date picker on any click inside the field ── */
const openDatePicker = (e) => {
  const input = e.currentTarget.querySelector('input[type="date"]');
  if (input && typeof input.showPicker === "function") {
    input.showPicker();
  }
};

/* ─── wallet fetcher ───────────────────────────────────────────── */
const WalletFetcher = ({ channelId, onWalletsFetched }) => {
  useEffect(() => {
    if (!channelId) { onWalletsFetched([]); return; }
    api.get("/wallets").then(res => {
      const data = res.data.data ?? [];
      const filtered = data
        .filter(w => w.payment_channel?.id === channelId || w.payment_channel_id === channelId)
        .map(w => ({ id: w.id, label: w.wallet_number }));
      onWalletsFetched(filtered);
    });
  }, [channelId]);
  return null;
};

/* ─── main component ───────────────────────────────────────────── */
const TransactionEditModal = ({ open, onClose, initialData, onSave }) => {

  const theme      = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [channels,       setChannels]       = useState([]);
  const [wallets,        setWallets]        = useState([]);
  const [loadingWallets, setLoadingWallets] = useState(false);
  const [billingSystems, setBillingSystems] = useState([]);
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    api.get("/payment-channels").then(res => {
      const data = res.data.data ?? [];
      setChannels(data.map(c => ({ id: c.id, label: c.channel_name })));
    });

    api.get("/billing-systems").then(res => {
      const data = res.data.data ?? [];
      setBillingSystems(data.map(b => ({ id: b.id, label: b.billing_name })));
    });
  }, [open]);

  if (!initialData) return null;

  /* wire Formik touched+errors into MUI error/helperText props */
  const fp = (name, errors, touched) => ({
    error:      !!(touched[name] && errors[name]),
    helperText: touched[name] && errors[name] ? errors[name] : "",
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx:{
          bgcolor:C.bg,
          borderRadius:fullScreen ? 0 : "16px",
          border:fullScreen ? "none" : `1px solid ${C.border}`,
          display:"flex",
          flexDirection:"column",
          maxHeight:fullScreen ? "100%" : "calc(100% - 64px)",
        },
      }}
    >

      {/* ── header ── */}
      <DialogTitle sx={{
        p:"14px 18px",
        borderBottom:`1px solid ${C.border}`,
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        bgcolor:C.surface,
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{
            width:34, height:34, borderRadius:"8px",
            bgcolor:"#f0fdf4", border:`1px solid ${C.successBorder}`,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <ReceiptIcon sx={{ fontSize:17, color:C.success }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize:14, fontWeight:700, color:C.text }}>
              Update Transaction
            </Typography>
            <Typography sx={{ fontSize:11, color:C.muted }}>
              System Reconciliation Tool
            </Typography>
          </Box>
        </Stack>

        <IconButton onClick={onClose} size="small" sx={{ border:`1px solid ${C.border}` }}>
          <CloseIcon sx={{ fontSize:15 }} />
        </IconButton>
      </DialogTitle>

      {/* ── Formik ── */}
      <Formik
        initialValues={{
          ...initialData,
          status:            initialData.status            || "mismatch",
          own_db:            !!initialData.own_db          || !!initialData.ownDb,
          vendor:            !!initialData.vendor,
          channel_id:        initialData.channel_id        || "",
          wallet_id:         initialData.wallet_id         || "",
          vendor_trx_date:   initialData.vendor_trx_date   || "",
          billing_trx_date:  initialData.billing_trx_date  || "",
          billing_system_id: initialData.billing_system_id || "",
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={onSave}
      >
        {({
          values, errors, touched,
          handleChange, handleBlur,
          setFieldValue, setFieldTouched,
          handleSubmit, isSubmitting, isValid, dirty,
        }) => (

          <Form style={{ display:"flex", flexDirection:"column", height:"100%" }}>

            <WalletFetcher
              channelId={values.channel_id}
              onWalletsFetched={(list) => {
                setWallets(list);
                setLoadingWallets(false);
              }}
            />

            <DialogContent sx={{ p:"20px", flexGrow:1, overflowY:"auto" }}>
              <Stack spacing={2}>

                {/* ══ Transaction Details ══ */}
                <Card>
                  <SectionLabel>Transaction Details</SectionLabel>
                  <Stack spacing={1.5}>

                    {/* Transaction ID — read-only, no asterisk */}
                    <TextField
                      fullWidth
                      label="Transaction ID"
                      value={values.trxId || values.transaction_id || "N/A"}
                      size="small"
                      disabled
                      InputProps={{
                        endAdornment: <LockIcon sx={{ fontSize:14, color:C.disabledText }} />,
                      }}
                      sx={fieldSx}
                    />

                    {/* Sender No. — optional, no asterisk */}
                    <TextField
                      fullWidth
                      label="Sender No."
                      name="senderWallet"
                      value={values.senderWallet || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 13);
                        setFieldValue("senderWallet", val);
                      }}
                      onBlur={() => setFieldTouched("senderWallet", true)}
                      size="small"
                      {...fp("senderWallet", errors, touched)}
                      sx={fieldSx}
                    />

                    {/* User ID — required */}
                    <TextField
                      fullWidth
                      label={<RequiredLabel label="User ID" />}
                      name="userId"
                      value={values.userId || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="small"
                      {...fp("userId", errors, touched)}
                      sx={fieldSx}
                    />

                    {/* Entity — required */}
                    <TextField
                      fullWidth
                      label={<RequiredLabel label="Entity" />}
                      name="entity"
                      value={values.entity || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="small"
                      {...fp("entity", errors, touched)}
                      sx={fieldSx}
                    />

                    {/* Amount — required */}
                    <TextField
                      fullWidth
                      label={<RequiredLabel label="Amount" />}
                      name="amount"
                      type="number"
                      value={values.amount || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="small"
                      {...fp("amount", errors, touched)}
                      sx={fieldSx}
                    />

                  </Stack>
                </Card>

                {/* ══ Payment Gateway ══ */}
                <Card>
                  <SectionLabel>Payment Gateway</SectionLabel>
                  <Stack spacing={1.5}>

                    {/* Channel — required */}
                    <TextField
                      select
                      fullWidth
                      label={<RequiredLabel label="Channel" />}
                      name="channel_id"
                      value={values.channel_id || ""}
                      onChange={(e) => {
                        setFieldValue("channel_id", e.target.value);
                        setFieldValue("wallet_id", "");
                        setLoadingWallets(true);
                      }}
                      onBlur={() => setFieldTouched("channel_id", true)}
                      size="small"
                      {...fp("channel_id", errors, touched)}
                      sx={fieldSx}
                    >
                      {channels.map(c => (
                        <MenuItem key={c.id} value={c.id}>{c.label}</MenuItem>
                      ))}
                    </TextField>

                    {/* Wallet — required */}
                    <TextField
                      select
                      fullWidth
                      label={<RequiredLabel label="Wallet" />}
                      name="wallet_id"
                      value={values.wallet_id || ""}
                      onChange={(e) => setFieldValue("wallet_id", e.target.value)}
                      onBlur={() => setFieldTouched("wallet_id", true)}
                      size="small"
                      disabled={!values.channel_id || loadingWallets}
                      {...fp("wallet_id", errors, touched)}
                      sx={fieldSx}
                    >
                      {loadingWallets
                        ? <MenuItem disabled>Loading...</MenuItem>
                        : wallets.map(w => (
                            <MenuItem key={w.id} value={w.id}>{w.label}</MenuItem>
                          ))
                      }
                    </TextField>

                    {/* Vendor Date — required */}
                    <Box onClick={openDatePicker} sx={{ cursor:"pointer" }}>
                      <TextField
                        fullWidth
                        label={<RequiredLabel label="Vendor Date" />}
                        name="vendor_trx_date"
                        type="date"
                        value={values.vendor_trx_date || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        {...fp("vendor_trx_date", errors, touched)}
                        sx={dateSx}
                      />
                    </Box>

                    {/* Vendor switch — required */}
                    <Box>
                      <Box sx={{
                        display:"flex", justifyContent:"space-between",
                        alignItems:"center",
                        px:1.5, py:0.8, borderRadius:"8px",
                        bgcolor: values.vendor ? C.vendorBg : C.bg,
                        border:`1px solid ${
                          touched.vendor && errors.vendor ? "#ef4444"
                          : values.vendor ? C.vendorBorder : C.border
                        }`,
                      }}>
                        <Typography sx={{ fontSize:12, fontWeight:600 }}>
                          Vendor
                          <span style={{ color: C.required, marginLeft: 2, fontWeight: 700 }}>*</span>
                        </Typography>
                        <Switch
                          checked={values.vendor}
                          disabled={!values.channel_id || !values.wallet_id || !values.vendor_trx_date}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFieldValue("vendor", checked);
                            setFieldTouched("vendor", true);
                            if (checked && values.own_db) {
                              setFieldValue("status", "matched");
                            } else {
                              setFieldValue("status", "mismatch");
                            }
                          }}
                          size="small"
                        />
                      </Box>
                      {touched.vendor && errors.vendor && (
                        <Typography sx={{ fontSize:10.5, color:"#ef4444", mt:0.5 }}>
                          {errors.vendor}
                        </Typography>
                      )}
                    </Box>

                  </Stack>
                </Card>

                {/* ══ Billing System ══ */}
                <Card>
                  <SectionLabel>Billing System</SectionLabel>
                  <Stack spacing={1.5}>

                    {/* Billing System dropdown — required, triggers auto-fill */}
                    <TextField
                      select
                      fullWidth
                      label={<RequiredLabel label="Billing System" />}
                      name="billing_system_id"
                      value={values.billing_system_id || ""}
                      onChange={async (e) => {
                        const selectedId = e.target.value;
                        setFieldValue("billing_system_id", selectedId);
                        setFieldTouched("billing_system_id", true);

                        if (!selectedId) return;

                        const trxId = values.trxId || values.transaction_id;
                        if (!trxId) return;

                        try {
                          setBillingLoading(true);
                          const res = await api.post(
                            "https://webapp.race.net.bd/api/billing/payments",
                            {
                              billing_system_id: selectedId,
                              trx_id: trxId,
                            }
                          );

                          const data = res.data?.data?.[0];
                          if (data) {
                            if (data.customer_id) setFieldValue("userId", data.customer_id);
                            if (data.entity)      setFieldValue("entity", data.entity);
                            if (data.trx_date) {
                              setFieldValue("billing_trx_date", data.trx_date.slice(0, 10));
                            }
                          }
                        } catch (err) {
                          console.error("Billing lookup failed:", err);
                        } finally {
                          setBillingLoading(false);
                        }
                      }}
                      onBlur={() => setFieldTouched("billing_system_id", true)}
                      size="small"
                      disabled={billingLoading}
                      {...fp("billing_system_id", errors, touched)}
                      sx={fieldSx}
                    >
                      {billingLoading
                        ? <MenuItem disabled>Loading...</MenuItem>
                        : billingSystems.length === 0
                          ? <MenuItem disabled>No options</MenuItem>
                          : billingSystems.map(b => (
                              <MenuItem key={b.id} value={b.id}>{b.label}</MenuItem>
                            ))
                      }
                    </TextField>

                    {/* Billing System Date — required */}
                    <Box onClick={openDatePicker} sx={{ cursor:"pointer" }}>
                      <TextField
                        fullWidth
                        label={<RequiredLabel label="Billing System Date" />}
                        name="billing_trx_date"
                        type="date"
                        value={values.billing_trx_date || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        {...fp("billing_trx_date", errors, touched)}
                        sx={dateSx}
                      />
                    </Box>

                    {/* Billing System switch — required */}
                    <Box>
                      <Box sx={{
                        display:"flex", justifyContent:"space-between",
                        alignItems:"center",
                        px:1.5, py:0.8, borderRadius:"8px",
                        bgcolor: values.own_db ? C.successBg : C.bg,
                        border:`1px solid ${
                          touched.own_db && errors.own_db ? "#ef4444"
                          : values.own_db ? C.successBorder : C.border
                        }`,
                      }}>
                        <Typography sx={{ fontSize:12, fontWeight:600 }}>
                          Billing System
                          <span style={{ color: C.required, marginLeft: 2, fontWeight: 700 }}>*</span>
                        </Typography>
                        <Switch
                          checked={values.own_db}
                          disabled={!values.billing_trx_date}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFieldValue("own_db", checked);
                            setFieldTouched("own_db", true);
                            if (!checked) setFieldValue("billing_system_id", "");
                            if (checked && values.vendor) {
                              setFieldValue("status", "matched");
                            } else {
                              setFieldValue("status", "mismatch");
                            }
                          }}
                          size="small"
                        />
                      </Box>
                      {touched.own_db && errors.own_db && (
                        <Typography sx={{ fontSize:10.5, color:"#ef4444", mt:0.5 }}>
                          {errors.own_db}
                        </Typography>
                      )}
                    </Box>

                  </Stack>
                </Card>

                {/* ══ Status ══ */}
                <Card>
                  <SectionLabel>Status</SectionLabel>
                  <Stack spacing={1.5}>
                    <TextField
                      select
                      fullWidth
                      label={<RequiredLabel label="Status" />}
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="small"
                      disabled={!values.vendor || !values.own_db}
                      {...fp("status", errors, touched)}
                      sx={fieldSx}
                    >
                      <MenuItem value="matched">Matched</MenuItem>
                      <MenuItem value="mismatch">Mismatch</MenuItem>
                    </TextField>
                  </Stack>
                </Card>

              </Stack>
            </DialogContent>

            {/* ── footer ── */}
            <DialogActions sx={{
              p:"12px 18px",
              bgcolor:C.surface,
              borderTop:`1px solid ${C.border}`,
              gap:1,
            }}>
              <Button
                onClick={onClose}
                sx={{
                  color:C.muted, fontWeight:600, fontSize:13,
                  textTransform:"none", borderRadius:"8px",
                  border:`1px solid ${C.border}`,
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={isSubmitting || !isValid || !dirty}
                sx={{
                  bgcolor:C.accent, color:"#fff",
                  fontWeight:700, fontSize:13,
                  textTransform:"none", borderRadius:"8px", px:3,
                }}
              >
                {isSubmitting ? "Saving..." : "Update Transaction"}
              </Button>
            </DialogActions>

          </Form>
        )}
      </Formik>

    </Dialog>
  );
};

export default TransactionEditModal;