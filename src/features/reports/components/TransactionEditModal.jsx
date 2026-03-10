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
};

const fieldSx={
  "& .MuiOutlinedInput-root":{
    bgcolor:C.surface,
    borderRadius:"8px",
    fontSize:13,
    "& input":{padding:"8.5px 12px"},
    "& fieldset":{borderColor:C.border},
    "&:hover fieldset":{borderColor:"#94a3b8"},
    "&.Mui-focused fieldset":{borderColor:C.borderFocus,borderWidth:1.5}
  },
  "& .MuiInputLabel-root":{
    fontSize:12,
    transform:"translate(14px, 9px) scale(1)"
  },
  "& .MuiInputLabel-shrink":{
    transform:"translate(14px, -8px) scale(0.75)",
    bgcolor:C.surface,
    px:0.5
  }
};

const SectionLabel=({children})=>(
  <Typography sx={{
    fontSize:10.5,fontWeight:700,letterSpacing:"0.09em",
    textTransform:"uppercase",color:C.muted,mb:1.5
  }}>
    {children}
  </Typography>
);

const Card=({children})=>(
  <Box sx={{
    bgcolor:C.surface,
    border:`1px solid ${C.border}`,
    borderRadius:"12px",
    p:{xs:"14px",sm:"16px"}
  }}>
    {children}
  </Box>
);

const WalletFetcher=({channelId,onWalletsFetched})=>{
  useEffect(()=>{
    if(!channelId){
      onWalletsFetched([]);
      return;
    }

    api.get("/wallets").then(res=>{
      const data=res.data.data??[];

      const filtered=data
      .filter(w=>
        w.payment_channel?.id===channelId ||
        w.payment_channel_id===channelId
      )
      .map(w=>({id:w.id,label:w.wallet_number}));

      onWalletsFetched(filtered);
    });

  },[channelId]);

  return null;
};

const TransactionEditModal=({open,onClose,initialData,onSave})=>{

  const theme=useTheme();
  const fullScreen=useMediaQuery(theme.breakpoints.down("sm"));

  const [channels,setChannels]=useState([]);
  const [wallets,setWallets]=useState([]);
  const [loadingWallets,setLoadingWallets]=useState(false);

  useEffect(()=>{
    if(!open) return;

    api.get("/payment-channels").then(res=>{
      const data=res.data.data??[];
      setChannels(data.map(c=>({id:c.id,label:c.channel_name})));
    });

  },[open]);

  if(!initialData) return null;

  return(

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
      borderRadius:fullScreen?0:"16px",
      border:fullScreen?"none":`1px solid ${C.border}`,
      display:"flex",
      flexDirection:"column",
      maxHeight:fullScreen?"100%":"calc(100% - 64px)"
    }
  }}
  >

  <DialogTitle sx={{
    p:"14px 18px",
    borderBottom:`1px solid ${C.border}`,
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    bgcolor:C.surface
  }}>

  <Stack direction="row" spacing={1.5} alignItems="center">

  <Box sx={{
    width:34,
    height:34,
    borderRadius:"8px",
    bgcolor:"#f0fdf4",
    border:`1px solid ${C.successBorder}`,
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  }}>
  <ReceiptIcon sx={{fontSize:17,color:C.success}}/>
  </Box>

  <Box>
  <Typography sx={{fontSize:14,fontWeight:700,color:C.text}}>
  Update Transaction
  </Typography>
  <Typography sx={{fontSize:11,color:C.muted}}>
  System Reconciliation Tool
  </Typography>
  </Box>

  </Stack>

  <IconButton onClick={onClose} size="small" sx={{border:`1px solid ${C.border}`}}>
  <CloseIcon sx={{fontSize:15}}/>
  </IconButton>

  </DialogTitle>

  <Formik
    initialValues={{
    ...initialData,
    status: initialData.status || "mismatch",
    own_db: !!initialData.own_db || !!initialData.ownDb,
    vendor: !!initialData.vendor,
    channel_id: initialData.channel_id || "",
    wallet_id: initialData.wallet_id || "",
    vendor_trx_date: initialData.vendor_trx_date || "",      // ← map from row field
    billing_trx_date: initialData.billing_trx_date || "", // ← already correct
  }}
  enableReinitialize
  onSubmit={onSave}
  >

{({values,handleChange,setFieldValue,handleSubmit,isSubmitting})=>{

/* BD number validation */
const isValidBDNumber=(num)=>{
return /^01[3-9]\d{8}$/.test(num||"");
};

/* overall form validation */
const isFormValid=
values.senderWallet &&
isValidBDNumber(values.senderWallet) &&
values.userId &&
values.entity &&
values.amount &&
values.channel_id &&
values.wallet_id &&
values.vendor_trx_date &&  
values.billing_trx_date &&
values.vendor &&
values.own_db &&
values.status;

return(

<Form style={{display:"flex",flexDirection:"column",height:"100%"}}>

<WalletFetcher
channelId={values.channel_id}
onWalletsFetched={(list)=>{
setWallets(list);
setLoadingWallets(false);
}}
/>

<DialogContent sx={{p:"20px",flexGrow:1,overflowY:"auto"}}>

<Stack spacing={2}>

<Card>

<SectionLabel>Transaction Details</SectionLabel>

<Stack spacing={1.5}>

<TextField
fullWidth
label="Transaction ID"
value={values.trxId||values.transaction_id||"N/A"}
size="small"
disabled
InputProps={{
endAdornment:<LockIcon sx={{fontSize:14,color:C.disabledText}}/>
}}
sx={fieldSx}
/>

<TextField
fullWidth
label="Sender No."
name="senderWallet"
value={values.senderWallet||""}
onChange={(e)=>{
const value=e.target.value.replace(/\D/g,"").slice(0,11);
setFieldValue("senderWallet",value);
}}
size="small"
error={values.senderWallet && !isValidBDNumber(values.senderWallet)}
helperText={
values.senderWallet && !isValidBDNumber(values.senderWallet)
? "Enter a valid 11 digit Bangladeshi number"
: ""
}
sx={fieldSx}
/>

<TextField
fullWidth
label="User ID"
name="userId"
value={values.userId||""}
onChange={handleChange}
size="small"
sx={fieldSx}
/>

<TextField
fullWidth
label="Entity"
name="entity"
value={values.entity||""}
onChange={handleChange}
size="small"
sx={fieldSx}
/>

<TextField
fullWidth
label="Amount"
name="amount"
type="number"
value={values.amount||""}
onChange={handleChange}
size="small"
sx={fieldSx}
/>

</Stack>
</Card>

<Card>

<SectionLabel>Database Verification</SectionLabel>

<Stack spacing={1.5}>

<TextField
select
fullWidth
label="Channel"
name="channel_id"
value={values.channel_id||""}
onChange={(e)=>{
setFieldValue("channel_id",e.target.value);
setFieldValue("wallet_id","");
setLoadingWallets(true);
}}
size="small"
sx={fieldSx}
>

{channels.map(c=>(
<MenuItem key={c.id} value={c.id}>
{c.label}
</MenuItem>
))}

</TextField>

<TextField
select
fullWidth
label="Wallet"
name="wallet_id"
value={values.wallet_id||""}
onChange={(e)=>setFieldValue("wallet_id",e.target.value)}
size="small"
disabled={!values.channel_id || loadingWallets}
sx={fieldSx}
>

{loadingWallets
? <MenuItem disabled>Loading...</MenuItem>
: wallets.map(w=>(
<MenuItem key={w.id} value={w.id}>
{w.label}
</MenuItem>
))
}

</TextField>

<TextField
fullWidth
label="Vendor Date"
name="vendor_trx_date" 
type="date"
value={values.vendor_trx_date || ""}
onChange={handleChange}
size="small"
InputLabelProps={{shrink:true}}
sx={fieldSx}
/>

<Box sx={{
display:"flex",
justifyContent:"space-between",
px:1.5,
py:0.8,
borderRadius:"8px",
bgcolor:values.vendor?C.vendorBg:C.bg,
border:`1px solid ${values.vendor?C.vendorBorder:C.border}`
}}>

<Typography sx={{fontSize:12,fontWeight:600}}>
Vendor
</Typography>

<Switch
checked={values.vendor}
disabled={!values.channel_id || !values.wallet_id || !values.vendor_trx_date}
onChange={(e)=>setFieldValue("vendor",e.target.checked)}
size="small"
/>

</Box>

<TextField
fullWidth
label="Billing System Date"
name="billing_trx_date" 
type="date"
value={values.billing_trx_date || ""}
onChange={handleChange}
size="small"
InputLabelProps={{shrink:true}}
sx={fieldSx}
/>

<Box sx={{
display:"flex",
justifyContent:"space-between",
px:1.5,
py:0.8,
borderRadius:"8px",
bgcolor:values.own_db?C.successBg:C.bg,
border:`1px solid ${values.own_db?C.successBorder:C.border}`
}}>

<Typography sx={{fontSize:12,fontWeight:600}}>
Billing System
</Typography>

<Switch
checked={values.own_db}
disabled={!values.billing_trx_date}
onChange={(e)=>setFieldValue("own_db",e.target.checked)}
size="small"
/>

</Box>

<TextField
select
fullWidth
label="Status"
name="status"
value={values.status}
onChange={handleChange}
size="small"
disabled={!values.vendor || !values.own_db}
sx={fieldSx}
>
<MenuItem value="matched">Matched</MenuItem>
<MenuItem value="mismatch">Mismatch</MenuItem>
</TextField>

</Stack>

</Card>

</Stack>

</DialogContent>

<DialogActions sx={{
p:"12px 18px",
bgcolor:C.surface,
borderTop:`1px solid ${C.border}`,
gap:1
}}>

<Button
onClick={onClose}
sx={{
color:C.muted,
fontWeight:600,
fontSize:13,
textTransform:"none",
borderRadius:"8px",
border:`1px solid ${C.border}`
}}
>
Cancel
</Button>

<Button
onClick={handleSubmit}
variant="contained"
disabled={isSubmitting || !isFormValid}
sx={{
bgcolor:C.accent,
color:"#fff",
fontWeight:700,
fontSize:13,
textTransform:"none",
borderRadius:"8px",
px:3
}}
>
Update Transaction
</Button>

</DialogActions>

</Form>
);

}}

</Formik>

</Dialog>

);

};

export default TransactionEditModal;
