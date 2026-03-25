// // src/features/upload/components/OwnDatabaseUpload.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   Card, CardContent, Typography, Stack, Box, IconButton,
//   Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper, Alert,
// } from '@mui/material';
// import * as XLSX from "xlsx";
// import DeleteIcon from '@mui/icons-material/DeleteOutline';
// import SelectDropdownSingle from '../../../components/shared/SelectDropdownSingle';
// import UploadButton from '../../../components/shared/UploadButton';
// import { fetchBillingSystem } from '../api/uploadApi';
// import {
//   buildExpectedSlug,
//   buildExpectedFileName,
//   validateFileName,
// } from "../../../services/validateFileName";

// export default function OwnDatabaseUpload({ values, onUpload, onDelete, appliedRange }) {
//   const [billingOptions, setBillingOptions] = useState([]);
//   const [filesList, setFilesList] = useState([]);
//   const [fileError, setFileError]           = useState(null);

//   // Load billing systems on mount
//   useEffect(() => {
//     fetchBillingSystem().then(setBillingOptions).catch(console.error);
//   }, []);

//   const handleFilesChange = (files) => {
//     const billingLabel = billingOptions.find((b) => b.id === values.billingSystem)?.label || "";

//     const slug = buildExpectedSlug(billingLabel);
    
//     const invalidFiles = files.filter(
//       (f) => !validateFileName(f, slug, appliedRange?.startDate, appliedRange?.endDate)
//     );

//     if (invalidFiles.length > 0) {
//       const expected = buildExpectedFileName(slug, appliedRange?.startDate, appliedRange?.endDate);
//       setFileError(
//         `Invalid filename(s): ${invalidFiles.map((f) => f.name).join(", ")}.\n` +
//         `Expected format: ${expected}.xlsx / .csv`
//       );
//       return;
//     }

//     setFileError(null);

//     files.forEach((file) => {
//       const tempFile = {
//         id: Date.now() + Math.random(),
//         name: file.name,
//         file,
//         billingSystem: billingLabel,
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

//         setFilesList((prev) =>
//           prev.map((f) => (f.id === tempFile.id ? { ...f, transactions: transactionCount } : f))
//         );
//       };

//       setFilesList((prev) => [...prev, tempFile]);
//       onUpload(file, { billingSystemId: values.billingSystem }, tempFile.id);

//       if (/\.csv$/i.test(file.name)) reader.readAsText(file);
//       else reader.readAsArrayBuffer(file);
//     });
//   };

//   const handleDelete = (id) => {
//     setFilesList((prev) => prev.filter((f) => f.id !== id));
//     onDelete(id);
//   };


//     const getExpectedHint = () => {
//     if (!appliedRange?.startDate || !appliedRange?.endDate) return null;
//     const billingLabel = billingOptions.find((b) => b.id === values.billingSystem)?.label || "";
//     if (!billingLabel) return null;
//     const slug     = buildExpectedSlug(billingLabel);
//     const expected = buildExpectedFileName(slug, appliedRange.startDate, appliedRange.endDate);
//     return `${expected}.xlsx  /  ${expected}.csv`;
//       };

//       const hint = getExpectedHint();


//       return (
//         <Card variant="outlined" sx={{ mb: 4, borderRadius: 3 }}>
//           <CardContent sx={{ py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
//             <Typography
//               variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}
//             >
//           Billing System
//         </Typography>

//         <Stack
//           direction={{ xs: 'column', sm: 'row' }}
//           spacing={2}
//           alignItems={{ xs: 'stretch', sm: 'center' }}
//           mb={{ xs: 3, sm: 4 }}
//         >
//           <Box sx={{ flex: 1 }}>
//             <SelectDropdownSingle
//               required
//               name="billingSystem"
//               placeholder="Select Billing System"
//               fetchOptions={async () => billingOptions}
//               height={42}
//             />
//           </Box>

//           <Box sx={{ flexShrink: 0 }}>
//             <UploadButton
//               label="Upload Files"
//               multiple
//               onUpload={handleFilesChange}
//               color="#217346"
//               hoverColor="#185C37"
//               minWidth={160}
//               // ADDED VALIDATION HERE: Button is disabled if no billing system selected
//               disabled={!values.billingSystem}
//             />
//           </Box>
//         </Stack>

//         {/* Expected filename hint */}
//         {hint && (
//           <Typography variant="caption" sx={{ color: "#64748b", mt: 0.5, mb: 1.5, display: "block" }}>
//             Expected filename: <strong>{hint}</strong>
//           </Typography>
//         )}

//         {/* Error alert */}
//         {fileError && (
//           <Alert
//             severity="error"
//             onClose={() => setFileError(null)}
//             sx={{ mt: 1, mb: 1.5, fontSize: 13 }}
//           >
//             {fileError}
//           </Alert>
//         )}


//         {filesList.length > 0 && (
//           <TableContainer
//             component={Paper}
//             variant="outlined"
//             sx={{ borderRadius: 2, overflowX: 'auto' }}
//           >
//             <Table sx={{ minWidth: { xs: '100%', sm: 650 } }} size="small">
//               <TableHead sx={{ backgroundColor: '#f8fafc' }}>
//                 <TableRow>
//                   <TableCell sx={{ fontWeight: 700 }}>File Name</TableCell>
//                   <TableCell sx={{ fontWeight: 700 }}>Billing System</TableCell>
//                   <TableCell sx={{ fontWeight: 700 }}>Transactions</TableCell>
//                   <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filesList.map((f) => (
//                   <TableRow key={f.id} hover>
//                     <TableCell sx={{ wordBreak: 'break-word' }}>{f.name}</TableCell>
//                     <TableCell sx={{ wordBreak: 'break-word' }}>{f.billingSystem}</TableCell>
//                     <TableCell>{f.transactions}</TableCell>
//                     <TableCell align="right">
//                       <IconButton size="small" color="error" onClick={() => handleDelete(f.id)}>
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



// src/features/upload/components/OwnDatabaseUpload.jsx
import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Stack, Box, IconButton,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper,
} from '@mui/material';
import * as XLSX from "xlsx";
import { format } from "date-fns"; // Recommended for date formatting
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import SelectDropdownSingle from '../../../components/shared/SelectDropdownSingle';
import UploadButton from '../../../components/shared/UploadButton';
import { fetchBillingSystem } from '../api/uploadApi';

export default function OwnDatabaseUpload({ values, onUpload, onDelete, appliedRange }) {
  const [billingOptions, setBillingOptions] = useState([]);
  const [filesList, setFilesList] = useState([]);

  // Load billing systems on mount
  useEffect(() => {
    fetchBillingSystem().then(setBillingOptions).catch(console.error);
  }, []);

  // Helper to generate the auto-rename string
  const generateAutoName = (originalName, billingLabel) => {
    const extension = originalName.split('.').pop();
    const timeStr = format(new Date(), "HHmmss");
    
    let datePart = "";

    // Check if a full range is selected
    if (appliedRange?.startDate && appliedRange?.endDate) {
      const start = format(new Date(appliedRange.startDate), "dd-MM-yyyy");
      const end = format(new Date(appliedRange.endDate), "dd-MM-yyyy");
      
      // If start and end are the same day, just show one date, otherwise show the range
      datePart = start === end ? start : `${start}_to_${end}`;
    } else {
      // Fallback to startDate or current date if no range is provided
      const fallbackDate = appliedRange?.startDate || new Date();
      datePart = format(new Date(fallbackDate), "dd-MM-yyyy");
    }

    // Final Format: BillingSystemName_dd-mm-yyyy_to_dd-mm-yyyy_time.extension
    return `${billingLabel.replace(/\s+/g, '')}_${datePart}_${timeStr}.${extension}`;
  };
  
  const handleFilesChange = (files) => {
    const billingLabel = billingOptions.find((b) => b.id === values.billingSystem)?.label || "BillingSystem";

    files.forEach((file) => {
      // 1. Generate the new name according to your requirement
      const newName = generateAutoName(file.name, billingLabel);
      
      // 2. Create a new File object with the new name but same content
      const renamedFile = new File([file], newName, { type: file.type });

      const tempFile = {
        id: Date.now() + Math.random(),
        name: renamedFile.name,
        file: renamedFile,
        billingSystem: billingLabel,
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

        setFilesList((prev) =>
          prev.map((f) => (f.id === tempFile.id ? { ...f, transactions: transactionCount } : f))
        );
      };

      setFilesList((prev) => [...prev, tempFile]);
      
      // 3. Pass the renamed file to the parent/API
      onUpload(renamedFile, { billingSystemId: values.billingSystem }, tempFile.id);

      if (/\.csv$/i.test(renamedFile.name)) reader.readAsText(renamedFile);
      else reader.readAsArrayBuffer(renamedFile);
    });
  };

  const handleDelete = (id) => {
    setFilesList((prev) => prev.filter((f) => f.id !== id));
    onDelete(id);
  };

  return (
    <Card variant="outlined" sx={{ mb: 4, borderRadius: 3 }}>
      <CardContent sx={{ py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Billing System
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          mb={{ xs: 3, sm: 4 }}
        >
          <Box sx={{ flex: 1 }}>
            <SelectDropdownSingle
              required
              name="billingSystem"
              placeholder="Select Billing System"
              fetchOptions={async () => billingOptions}
              height={42}
            />
          </Box>

          <Box sx={{ flexShrink: 0 }}>
            <UploadButton
              label="Upload Files"
              multiple
              onUpload={handleFilesChange}
              color="#217346"
              hoverColor="#185C37"
              minWidth={160}
              disabled={!values.billingSystem}
            />
          </Box>
        </Stack>

        {filesList.length > 0 && (
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ borderRadius: 2, overflowX: 'auto' }}
          >
            <Table sx={{ minWidth: { xs: '100%', sm: 650 } }} size="small">
              <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>File Name (Auto-renamed)</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Billing System</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Transactions</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filesList.map((f) => (
                  <TableRow key={f.id} hover>
                    <TableCell sx={{ wordBreak: 'break-word', fontWeight: 500 }}>{f.name}</TableCell>
                    <TableCell sx={{ wordBreak: 'break-word' }}>{f.billingSystem}</TableCell>
                    <TableCell>{f.transactions}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="error" onClick={() => handleDelete(f.id)}>
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