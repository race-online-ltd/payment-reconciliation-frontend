// // src/features/upload/components/ServiceUploadSection.jsx
// import React, { useState, useEffect } from "react";
// import { Card, CardContent, Typography, Stack, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Alert } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/DeleteOutline";
// import * as XLSX from "xlsx";

// import SelectDropdownSingle from "../../../components/shared/SelectDropdownSingle";
// import UploadButton from "../../../components/shared/UploadButton";
// import { fetchChannels, fetchWallets } from "../api/uploadApi";
// // Add these imports at the top (after the existing imports)
// import {
//   buildExpectedSlug,
//   buildExpectedFileName,
//   validateFileName,
// } from "../../../services/validateFileName";

// export default function ServiceUploadSection({ values, onUpload, onDelete, appliedRange }) {
//   const [channelOptions, setChannelOptions] = useState([]);
//   const [walletOptions, setWalletOptions] = useState([]);
//   const [tempFiles, setTempFiles] = useState([]);
//   const [fileError, setFileError] = useState(null);

//   // Load channels once on mount
//   useEffect(() => {
//     fetchChannels().then(setChannelOptions).catch(console.error);
//   }, []);

//   // Filter wallets by selected channel
//   useEffect(() => {
//     if (!values.channel) {
//       setWalletOptions([]);
//       return;
//     }
//     fetchWallets()
//       .then((all) => all.filter((w) => w.channelId === values.channel))
//       .then(setWalletOptions)
//       .catch(console.error);
//   }, [values.channel]);

//   const handleFileChange = (files) => {
//     const selectedChannel = channelOptions.find((c) => c.id === values.channel)?.label || "";
//     const selectedWallet  = walletOptions.find((w) => w.id === values.wallet)?.label   || "";


//     // Build slug from both channel + wallet labels combined
//   const slug = buildExpectedSlug(`${selectedChannel} ${selectedWallet}`);

//   const invalidFiles = files.filter(
//     (f) => !validateFileName(f, slug, appliedRange?.startDate, appliedRange?.endDate)
//   );

//   if (invalidFiles.length > 0) {
//    const expected = buildExpectedFileName(slug, appliedRange?.startDate, appliedRange?.endDate);
//     setFileError(
//       `Invalid filename(s): ${invalidFiles.map((f) => f.name).join(", ")}.\n` +
//       `Expected format: ${expected}.xlsx / .csv`
//     );
//     return;
//   }

//   setFileError(null);


//     files.forEach((file) => {
//       const tempFile = {
//         id: Date.now() + Math.random(),
//         name: file.name,
//         file,
//         channel: selectedChannel,
//         wallet: selectedWallet,
//         transactions: 0,
//       };

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const data = e.target.result;
//         let transactionCount = 0;

//         if (/\.csv$/i.test(file.name)) {
//           const lines = data.split(/\r\n|\n/);
//           transactionCount = lines.length > 1 ? lines.length - 1 : 0;
//         } else if (/\.(xls|xlsx)$/i.test(file.name)) {
//           const workbook = XLSX.read(data, { type: "array" });
//           const sheet = workbook.Sheets[workbook.SheetNames[0]];
//           const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//           transactionCount = json.length > 1 ? json.length - 1 : 0;
//         }

//         setTempFiles((prev) =>
//           prev.map((f) => (f.id === tempFile.id ? { ...f, transactions: transactionCount } : f))
//         );
//       };

//       setTempFiles((prev) => [...prev, tempFile]);
//       onUpload(file, { channel: values.channel, wallet: values.wallet }, tempFile.id);

//       if (/\.csv$/i.test(file.name)) reader.readAsText(file);
//       else reader.readAsArrayBuffer(file);
//     });
//   };

//   const handleDeleteTempFile = (id) => {
//     setTempFiles((prev) => prev.filter((f) => f.id !== id));
//     onDelete(id);
//   };


//   const getExpectedHint = () => {
//   if (!appliedRange?.startDate || !appliedRange?.endDate) return null;
//   const selectedChannel = channelOptions.find((c) => c.id === values.channel)?.label || "";
//   const selectedWallet  = walletOptions.find((w) => w.id === values.wallet)?.label   || "";
//   if (!selectedChannel || !selectedWallet) return null;
//   const slug     = buildExpectedSlug(`${selectedChannel} ${selectedWallet}`);
//   const expected = buildExpectedFileName(slug, appliedRange.startDate, appliedRange.endDate);
//   return `${expected}.xlsx  /  ${expected}.csv`;
// };

// const hint = getExpectedHint();

//   return (
//     <Card variant="outlined" sx={{ mb: 3 }}>
//       <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
//           Payment Gateway
//         </Typography>

//         <Stack
//           direction={{ xs: "column", sm: "row" }}
//           spacing={2}
//           alignItems={{ xs: "stretch", sm: "flex-end" }}
//         >
//           <Box sx={{ flex: 1 }}>
//             <SelectDropdownSingle
//               required
//               name="channel"
//               placeholder="Select Channel"
//               fetchOptions={async () => channelOptions}
//               height={42}
//             />
//           </Box>

//           <Box sx={{ flex: 1 }}>
//             <SelectDropdownSingle
//               required
//               name="wallet"
//               placeholder="Select Wallet"
//               fetchOptions={async () => walletOptions}
//               height={42}
//               disabled={!values.channel}
//             />
//           </Box>

//           <Box sx={{ flexShrink: 0 }}>
//             <UploadButton
//               label="Upload Files"
//               multiple
//               onUpload={handleFileChange}
//               color="#217346"
//               hoverColor="#185C37"
//               // ADDED VALIDATION HERE: Button is disabled if channel or wallet is missing
//               disabled={!values.channel || !values.wallet}
//             />
//           </Box>
//         </Stack>

//         {/* Expected filename hint */}
//         {hint && (
//           <Typography variant="caption" sx={{ color: "#64748b", mt: 1.5, display: "block" }}>
//             Expected filename: <strong>{hint}</strong>
//           </Typography>
//         )}

//         {/* Error alert */}
//         {fileError && (
//           <Alert
//             severity="error"
//             onClose={() => setFileError(null)}
//             sx={{ mt: 1.5, fontSize: 13 }}
//           >
//             {fileError}
//           </Alert>
//         )}


//         {tempFiles.length > 0 && (
//           <TableContainer
//             component={Paper}
//             sx={{ mt: 4, border: "1px solid #e2e8f0", boxShadow: "none", overflowX: "auto" }}
//           >
//             <Table size="small">
//               <TableHead sx={{ bgcolor: "#f8fafc" }}>
//                 <TableRow>
//                   <TableCell sx={{ fontWeight: 600 }}>File Name</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Channel</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Wallet</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Transactions</TableCell>
//                   <TableCell align="right" sx={{ fontWeight: 600 }}>Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {tempFiles.map((f) => (
//                   <TableRow key={f.id} hover>
//                     <TableCell sx={{ wordBreak: "break-word" }}>{f.name}</TableCell>
//                     <TableCell sx={{ wordBreak: "break-word" }}>{f.channel}</TableCell>
//                     <TableCell sx={{ wordBreak: "break-word" }}>{f.wallet}</TableCell>
//                     <TableCell>{f.transactions}</TableCell>
//                     <TableCell align="right">
//                       <IconButton color="error" size="small" onClick={() => handleDeleteTempFile(f.id)}>
//                         <DeleteIcon fontSize="small" />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </CardContent>
//     </Card>
//   );
// }



// src/features/upload/components/ServiceUploadSection.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Stack, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import * as XLSX from "xlsx";
import { format } from "date-fns"; // Standard for date formatting

import SelectDropdownSingle from "../../../components/shared/SelectDropdownSingle";
import UploadButton from "../../../components/shared/UploadButton";
import { fetchChannels, fetchWallets } from "../api/uploadApi";

export default function ServiceUploadSection({ values, onUpload, onDelete, appliedRange }) {
  const [channelOptions, setChannelOptions] = useState([]);
  const [walletOptions, setWalletOptions] = useState([]);
  const [tempFiles, setTempFiles] = useState([]);

  useEffect(() => {
    fetchChannels().then(setChannelOptions).catch(console.error);
  }, []);

  useEffect(() => {
    if (!values.channel) {
      setWalletOptions([]);
      return;
    }
    fetchWallets()
      .then((all) => all.filter((w) => w.channelId === values.channel))
      .then(setWalletOptions)
      .catch(console.error);
  }, [values.channel]);

  // Helper to generate the new filename
  const generateAutoName = (originalName, channelLabel, walletLabel) => {
    const extension = originalName.split('.').pop();
    const timeStr = format(new Date(), "HHmmss");
    
    let datePart = "";

    // 1. Check if both dates in the range exist
    if (appliedRange?.startDate && appliedRange?.endDate) {
      const start = format(new Date(appliedRange.startDate), "dd-MM-yyyy");
      const end = format(new Date(appliedRange.endDate), "dd-MM-yyyy");
      
      // 2. Use "start_to_end" format only if dates are different
      datePart = start === end ? start : `${start}_to_${end}`;
    } else {
      // 3. Fallback to start date or today's date
      const fallbackDate = appliedRange?.startDate || new Date();
      datePart = format(new Date(fallbackDate), "dd-MM-yyyy");
    }

    // Final Format: Channel_Wallet_DateRange_Time.extension
    return `${channelLabel.replace(/\s+/g, '')}_${walletLabel.replace(/\s+/g, '')}_${datePart}_${timeStr}.${extension}`;
  };

  const handleFileChange = (files) => {
    const selectedChannel = channelOptions.find((c) => c.id === values.channel)?.label || "Channel";
    const selectedWallet  = walletOptions.find((w) => w.id === values.wallet)?.label   || "Wallet";

    files.forEach((file) => {
      // 1. Generate the new name
      const newName = generateAutoName(file.name, selectedChannel, selectedWallet);
      
      // 2. Create a new File object with the new name
      const renamedFile = new File([file], newName, { type: file.type });

      const tempFile = {
        id: Date.now() + Math.random(),
        name: renamedFile.name,
        file: renamedFile,
        channel: selectedChannel,
        wallet: selectedWallet,
        transactions: 0,
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        let transactionCount = 0;

        if (/\.csv$/i.test(renamedFile.name)) {
          const lines = data.split(/\r\n|\n/);
          transactionCount = lines.length > 1 ? lines.length - 1 : 0;
        } else if (/\.(xls|xlsx)$/i.test(renamedFile.name)) {
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          transactionCount = json.length > 1 ? json.length - 1 : 0;
        }

        setTempFiles((prev) =>
          prev.map((f) => (f.id === tempFile.id ? { ...f, transactions: transactionCount } : f))
        );
      };

      setTempFiles((prev) => [...prev, tempFile]);
      
      // Pass the renamed file to the parent component/API
      onUpload(renamedFile, { channel: values.channel, wallet: values.wallet }, tempFile.id);

      if (/\.csv$/i.test(renamedFile.name)) reader.readAsText(renamedFile);
      else reader.readAsArrayBuffer(renamedFile);
    });
  };

  const handleDeleteTempFile = (id) => {
    setTempFiles((prev) => prev.filter((f) => f.id !== id));
    onDelete(id);
  };

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Payment Gateway
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "flex-end" }}
        >
          <Box sx={{ flex: 1 }}>
            <SelectDropdownSingle
              required
              name="channel"
              placeholder="Select Channel"
              fetchOptions={async () => channelOptions}
              height={42}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <SelectDropdownSingle
              required
              name="wallet"
              placeholder="Select Wallet"
              fetchOptions={async () => walletOptions}
              height={42}
              disabled={!values.channel}
            />
          </Box>

          <Box sx={{ flexShrink: 0 }}>
            <UploadButton
              label="Upload Files"
              multiple
              onUpload={handleFileChange}
              color="#217346"
              hoverColor="#185C37"
              disabled={!values.channel || !values.wallet}
            />
          </Box>
        </Stack>

        {tempFiles.length > 0 && (
          <TableContainer
            component={Paper}
            sx={{ mt: 4, border: "1px solid #e2e8f0", boxShadow: "none", overflowX: "auto" }}
          >
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>File Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Channel</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Wallet</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Transactions</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tempFiles.map((f) => (
                  <TableRow key={f.id} hover>
                    <TableCell sx={{ wordBreak: "break-word", color: "#1e293b", fontWeight: 500 }}>
                      {f.name}
                    </TableCell>
                    <TableCell>{f.channel}</TableCell>
                    <TableCell>{f.wallet}</TableCell>
                    <TableCell>{f.transactions}</TableCell>
                    <TableCell align="right">
                      <IconButton color="error" size="small" onClick={() => handleDeleteTempFile(f.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}