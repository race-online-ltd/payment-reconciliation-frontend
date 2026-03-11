// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Dialog, DialogTitle, DialogContent, IconButton, Typography,
//   Box, Chip, Stack, Button, Menu, TextField,
// } from "@mui/material";
// import { Close as CloseIcon, Check as CheckIcon, Close as CrossIcon, Edit as EditIcon } from "@mui/icons-material";
// import { Formik, Form } from "formik";
// import BaseTable from "../../../components/shared/BaseTable";
// import SelectDropdownSingle from "../../../components/shared/SelectDropdownSingle";
// import { fetchComparisonDetails } from "../api/reportsApi";
// import axios from "axios";
// import api from "../../../api/axios";

// const columns = [
//   { id: "date", label: "Vendor trx Date", sortable: true },
//   { id: "trxId", label: "Transaction ID", sortable: true },
//   { id: "senderWallet", label: "Sender Number", sortable: true },
//   { id: "userId", label: "Customer ID", sortable: true },
//   { id: "entity", label: "Entity", sortable: true },
//   { id: "amount", label: "Amount", sortable: true },
//   { id: "channel", label: "Channel", sortable: true },
//   { id: "wallet", label: "Wallet", sortable: true },
//   { id: "status", label: "Status" },
//   { id: "ownDb", label: "Own DB" },
//   { id: "vendor", label: "Vendor" },
//   { id: "actions", label: "Actions" },
// ];

// const EMPTY_FILTERS = {
//   channel_id: "",
//   wallet_id: "",
//   status: "",
// };

// export default function TransactionReport({
//   batchId, processNo, open = false, onClose = () => {}, asPage = false,
// }) {
//   const [transactions, setTransactions] = useState([]);
//   const [filterAnchor, setFilterAnchor] = useState(null);
//   const filterOpen = Boolean(filterAnchor);
//   const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);
//   const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
//   const [editingRowId, setEditingRowId] = useState(null);
//   const [editedRow, setEditedRow] = useState({});
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(50);
//   const [totalRows, setTotalRows] = useState(0);
//   const [channels, setChannels] = useState([]);
//   const [wallets, setWallets] = useState([]);

//   // fetch channels for filter dropdown
//   useEffect(() => {
//     api.get("/payment-channels").then((res) => {
//       const data = res.data.data ?? [];
//       setChannels(data.map((c) => ({ id: c.id, label: c.channel_name })));
//     });
//   }, []);

//   // fetch wallets when channel changes in draft filters
//   useEffect(() => {
//     if (!draftFilters.channel_id) {
//       setWallets([]);
//       return;
//     }
//     api.get("/wallets", { params: { channel_id: draftFilters.channel_id } }).then((res) => {
//       const data = res.data.data ?? [];
//       setWallets(data.map((w) => ({ id: w.id, label: w.wallet_number })));
//     });
//   }, [draftFilters.channel_id]);

//   // fetch comparisons
//   useEffect(() => {
//     if (!batchId || !processNo) return;

//     fetchComparisonDetails(batchId, processNo, page + 1, rowsPerPage, appliedFilters)
//       .then((res) => {
//         const paginated = res.data.data;
//         const raw = paginated.data ?? [];
//         setTotalRows(paginated.total);
//         setTransactions(
//           raw.map((row) => ({
//             id: row.id,
//             trxId: row.trx_id,
//             senderWallet: row.sender_no ?? "-",
//             userId: row.customer_id ?? "-",
//             entity: row.entity ?? "-",
//             date: row.trx_date ? new Date(row.trx_date).toISOString().split("T")[0] : "-",
//             amount: row.amount,
//             channel: row.channel?.channel_name ?? "-",
//             wallet: row.wallet?.wallet_number ?? "-",
//             status: row.status,
//             ownDb: row.is_billing_system,
//             vendor: row.is_vendor,
//           }))
//         );
//       })
//       .catch((err) => console.error("Failed to fetch comparisons", err));
//   }, [batchId, processNo, page, rowsPerPage, appliedFilters]);

//   const handleOpenFilter = (e) => {
//     setDraftFilters(appliedFilters);
//     setFilterAnchor(e.currentTarget);
//   };
//   const handleCloseFilter = () => setFilterAnchor(null);

//   const handleApplyFilters = (values) => {
//     setAppliedFilters(values);
//     setPage(0);
//     handleCloseFilter();
//   };

//   const handleResetFilters = (resetForm) => {
//     resetForm({ values: EMPTY_FILTERS });
//     setDraftFilters(EMPTY_FILTERS);
//     setAppliedFilters(EMPTY_FILTERS);
//     setPage(0);
//     handleCloseFilter();
//   };

//   const handleSaveRow = async (rowId) => {
//     try {
//       await axios.put(`/api/transactions/${rowId}`, editedRow);
//       setTransactions((prev) => prev.map((r) => (r.id === rowId ? { ...r, ...editedRow } : r)));
//       setEditingRowId(null);
//       setEditedRow({});
//     } catch (err) {
//       console.error("Failed to update transaction", err);
//     }
//   };

//   const formattedRows = useMemo(
//     () =>
//       transactions.map((row) => {
//         const isMatched = row.status === "matched";
//         const isEditing = row.id === editingRowId;

//         return {
//           ...row,
//           senderWallet: isEditing ? (
//             <TextField value={editedRow.senderWallet ?? row.senderWallet} size="small"
//               onChange={(e) => setEditedRow({ ...editedRow, senderWallet: e.target.value })} />
//           ) : row.senderWallet,
//           userId: isEditing ? (
//             <TextField value={editedRow.userId ?? row.userId} size="small"
//               onChange={(e) => setEditedRow({ ...editedRow, userId: e.target.value })} />
//           ) : row.userId,
//           entity: isEditing ? (
//             <TextField value={editedRow.entity ?? row.entity} size="small"
//               onChange={(e) => setEditedRow({ ...editedRow, entity: e.target.value })} />
//           ) : row.entity,
//           amount: isEditing ? (
//             <TextField value={editedRow.amount ?? row.amount} size="small" type="number"
//               onChange={(e) => setEditedRow({ ...editedRow, amount: e.target.value })} />
//           ) : row.amount,
//           date: isEditing ? (
//             <TextField type="date" size="small" value={editedRow.date ?? row.date}
//               onChange={(e) => setEditedRow({ ...editedRow, date: e.target.value })} />
//           ) : row.date,
//           channel: row.channel,
//           wallet: row.wallet,
//           status: (
//             <Chip label={row.status} size="small" sx={{
//               bgcolor: isMatched ? "#C6F6D5" : "#FED7D7",
//               color: isMatched ? "#2F855A" : "#C53030",
//               fontWeight: 700, borderRadius: 1.5,
//             }} />
//           ),
//           ownDb: row.ownDb ? <CheckIcon fontSize="small" color="success" /> : <CrossIcon fontSize="small" color="error" />,
//           vendor: row.vendor ? <CheckIcon fontSize="small" color="success" /> : <CrossIcon fontSize="small" color="error" />,
//           actions: isEditing ? (
//             <Stack direction="row" spacing={1}>
//               <Button size="small" variant="contained" onClick={() => handleSaveRow(row.id)}>Save</Button>
//               <Button size="small" variant="outlined" onClick={() => { setEditingRowId(null); setEditedRow({}); }}>Cancel</Button>
//             </Stack>
//           ) : (
//             <IconButton size="small" onClick={() => { setEditingRowId(row.id); setEditedRow(row); }}>
//               <EditIcon fontSize="small" />
//             </IconButton>
//           ),
//         };
//       }),
//     [transactions, editingRowId, editedRow]
//   );

//   const content = (
//     <Box sx={{ p: asPage ? 3 : 0, flexGrow: 1 }}>
//       {asPage && (
//         <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Comparison Details</Typography>
//       )}
//       <Formik initialValues={draftFilters} enableReinitialize onSubmit={handleApplyFilters}>
//         {({ values, setFieldValue, handleSubmit, resetForm }) => (
//           <Form>
//             <Menu
//               anchorEl={filterAnchor} open={filterOpen} onClose={handleCloseFilter}
//               anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//               transformOrigin={{ vertical: "top", horizontal: "right" }}
//               PaperProps={{ sx: { p: 2, width: 300, borderRadius: 2 } }}
//             >
//               <Stack spacing={2}>
//                 <SelectDropdownSingle
//                   name="channel_id"
//                   placeholder="Select Channel"
//                   fetchOptions={async () => channels}
//                   sx={{ width: "100%" }}
//                   value={values.channel_id}
//                   onChange={(val) => {
//                     setFieldValue("channel_id", val);
//                     setFieldValue("wallet_id", "");
//                     setDraftFilters((prev) => ({ ...prev, channel_id: val, wallet_id: "" }));
//                   }}
//                 />
//                 <SelectDropdownSingle
//                   key={values.channel_id}
//                   name="wallet_id"
//                   placeholder="Select Wallet"
//                   fetchOptions={async () => wallets}
//                   sx={{ width: "100%" }}
//                   disabled={!values.channel_id}
//                   value={values.wallet_id}
//                 />
//                 <SelectDropdownSingle
//                   name="status"
//                   placeholder="Select Status"
//                   fetchOptions={async () => [
//                     { id: "", label: "All Status" },
//                     { id: "matched", label: "Matched" },
//                     { id: "mismatch", label: "Mismatch" },
//                   ]}
//                   sx={{ width: "100%" }}
//                   value={values.status}
//                 />
//                 <Stack direction="row" spacing={1}>
//                   <Button variant="outlined" size="small" fullWidth
//                     onClick={() => handleResetFilters(resetForm)}>
//                     Reset
//                   </Button>
//                   <Button variant="contained" size="small" fullWidth onClick={handleSubmit}>
//                     Apply
//                   </Button>
//                 </Stack>
//               </Stack>
//             </Menu>

//             <Box sx={{ flexGrow: 1, px: 2 }}>
//               <BaseTable
//                 title=""
//                 columns={columns}
//                 rows={formattedRows}
//                 selectable={false}
//                 hasAction={false}
//                 onFilter={handleOpenFilter}
//                 totalRows={totalRows}
//                 page={page}
//                 rowsPerPage={rowsPerPage}
//                 onPageChange={(e, newPage) => setPage(newPage)}
//                 onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
//                 sx={{ "& th, & td": { px: 1, py: 0.5, whiteSpace: "nowrap" } }}
//               />
//             </Box>
//           </Form>
//         )}
//       </Formik>
//     </Box>
//   );

//   if (asPage) return content;

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth PaperProps={{ sx: { borderRadius: 3, height: "90vh" } }}>
//       <DialogTitle sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <Typography component="span" variant="h6" sx={{ fontWeight: 700 }}>Comparison Details</Typography>
//         <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
//       </DialogTitle>
//       <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>{content}</DialogContent>
//     </Dialog>
//   );
// }



// // src/features/reports/components/TransactionReportModal.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   IconButton,
//   Typography,
//   Box,
//   Chip,
//   Stack,
//   Button,
//   Menu,
//   TextField,
//   InputAdornment,
// } from "@mui/material";

// import {
//   Close as CloseIcon,
//   Check as CheckIcon,
//   Close as CrossIcon,
//   Edit as EditIcon,
//   Search as SearchIcon,
// } from "@mui/icons-material";

// import { Formik, Form } from "formik";
// import BaseTable from "../../../components/shared/BaseTable";
// import TransactionEditModal from "./TransactionEditModal";
// import SelectDropdownSingle from "../../../components/shared/SelectDropdownSingle";

// import { fetchComparisonDetails } from "../api/reportsApi";
// import axios from "axios";
// import api from "../../../api/axios";

// const columns = [
//   { id: "vendor_trx_date", label: "PGW Trx Date", sortable: true },
//   { id: "billing_trx_date", label: "Billing Trx Date", sortable: true },
//   { id: "trxId", label: "Transaction ID", sortable: true },
//   { id: "senderWallet", label: "Sender Number", sortable: true },
//   { id: "userId", label: "Customer ID", sortable: true },
//   { id: "entity", label: "Entity", sortable: true },
//   { id: "amount", label: "Amount", sortable: true },
//   { id: "channel", label: "Channel", sortable: true },
//   { id: "wallet", label: "Wallet", sortable: true },
//   { id: "status", label: "Status" },
//   { id: "ownDb", label: "Billing System" },
//   { id: "vendor", label: "Vendor" },
//   { id: "actions", label: "Actions" },
// ];

// const EMPTY_FILTERS = {
//   channel_id: "",
//   wallet_id: "",
//   status: "",
// };

// export default function TransactionReportModal({
//   batchId,
//   processNo,
//   open = false,
//   onClose = () => {},
//   asPage = false,
// }) {
//   const [transactions, setTransactions] = useState([]);
//   const [filterAnchor, setFilterAnchor] = useState(null);
//   const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);
//   const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(50);
//   const [totalRows, setTotalRows] = useState(0);

//   const [channels, setChannels] = useState([]);
//   const [wallets, setWallets] = useState([]);

//   const [editModal, setEditModal] = useState({ open: false, data: null });
//   // for Search 
//   const [searchTerm, setSearchTerm] = useState("");

//   const filterOpen = Boolean(filterAnchor);

//   // fetch channels
//   useEffect(() => {
//     api.get("/payment-channels").then((res) => {
//       const data = res.data.data ?? [];
//       setChannels(data.map((c) => ({ id: c.id, label: c.channel_name })));
//     });
//   }, []);

//   // fetch wallets
//   useEffect(() => {
//     if (!draftFilters.channel_id) {
//       setWallets([]);
//       return;
//     }

//     api
//       .get("/wallets", { params: { channel_id: draftFilters.channel_id } })
//       .then((res) => {
//         const data = res.data.data ?? [];
//         setWallets(data.map((w) => ({ id: w.id, label: w.wallet_number })));
//       });
//   }, [draftFilters.channel_id]);

//   // fetch transactions
//   useEffect(() => {
//     if (!batchId || !processNo) return;

//     fetchComparisonDetails(
//       batchId,
//       processNo,
//       page + 1,
//       rowsPerPage,
//       appliedFilters
//     )
//       .then((res) => {
//         const paginated = res.data.data;
//         const raw = paginated.data ?? [];

//         setTotalRows(paginated.total);

//         setTransactions(
//           raw.map((row) => ({
//             id: row.id,
//             trxId: row.trx_id,
//             senderWallet: row.sender_no ?? "-",
//             userId: row.customer_id ?? "-",
//             entity: row.entity ?? "-",
//             vendor_trx_date: row.vendor_trx_date 
//               ? new Date(row.vendor_trx_date).toISOString().split("T")[0]
//               : "-",
//             billing_trx_date: row.billing_trx_date
//               ? new Date(row.billing_trx_date).toISOString().split("T")[0]
//               : "-",
//             amount: row.amount,
//             channel: row.channel?.channel_name ?? "-",
//             wallet: row.wallet?.wallet_number ?? "-",
//             status: row.status,
//             ownDb: row.is_billing_system,
//             vendor: row.is_vendor,
//             channel_id: row.channel_id,
//             wallet_id: row.wallet_id,
//           }))
//         );
//       })
//       .catch((err) => console.error("Failed to fetch comparisons", err));
//   }, [batchId, processNo, page, rowsPerPage, appliedFilters]);

//   const formattedRows = useMemo(
//     () =>
//       transactions.map((row) => {
//         const isMatched = row.status === "matched";

//         return {
//           ...row,
//           status: (
//             <Chip
//               label={row.status}
//               size="small"
//               sx={{
//                 bgcolor: isMatched ? "#C6F6D5" : "#FED7D7",
//                 color: isMatched ? "#2F855A" : "#C53030",
//                 fontWeight: 700,
//                 borderRadius: 1.5,
//               }}
//             />
//           ),
//           ownDb: row.ownDb ? (
//             <CheckIcon fontSize="small" color="success" />
//           ) : (
//             <CrossIcon fontSize="small" color="error" />
//           ),
//           vendor: row.vendor ? (
//             <CheckIcon fontSize="small" color="success" />
//           ) : (
//             <CrossIcon fontSize="small" color="error" />
//           ),
//           actions: (
//           <IconButton
//             size="small"
//             onClick={() => {
//               const rawRow = transactions.find((t) => t.id === row.id);
//               setEditModal({ open: true, data: rawRow });
//             }}
//           >
//             <EditIcon fontSize="small" />
//           </IconButton>
//         ),
//         };
//       }),
//     [transactions]
//   );

//    const handleUpdate = async (values) => {
//   try {
//     const payload = {
//       sender_no:        values.senderWallet,
//       customer_id:      values.userId,
//       entity:           values.entity,
//       amount:           values.amount,
//       vendor_trx_date:  values.vendor   ? values.vendor_trx_date  : null, // ← null if not in vendor DB
//       billing_trx_date: values.own_db   ? values.billing_trx_date : null, // ← null if not in billing DB
//       status:           values.status,
//       own_db:           values.own_db,
//       is_vendor:        values.vendor,
//       channel_id:       values.channel_id,
//       wallet_id:        values.wallet_id,
//     };

//     await api.put(`/comparisons/${values.id}`, payload);

//     setTransactions((prev) =>
//       prev.map((r) =>
//         r.id === values.id
//           ? {
//               ...r,
//               senderWallet:    values.senderWallet,
//               userId:          values.userId,
//               entity:          values.entity,
//               amount:          values.amount,
//               vendor_trx_date:            values.vendor_trx_date,   // ← update local state
//               billing_trx_date: values.billing_trx_date,
//               status:          values.status,
//               ownDb:           values.own_db,
//               vendor:          values.vendor,
//             }
//           : r
//       )
//     );

//     setEditModal({ open: false, data: null });
//   } catch (err) {
//     console.error("Update failed", err);
//   }
// };

//   const handleOpenFilter = (e) => {
//     setDraftFilters(appliedFilters);
//     setFilterAnchor(e.currentTarget);
//   };

//   const handleCloseFilter = () => setFilterAnchor(null);

//   const handleApplyFilters = (values) => {
//     setAppliedFilters(values);
//     setPage(0);
//     handleCloseFilter();
//   };

//   const handleResetFilters = (resetForm) => {
//     resetForm({ values: EMPTY_FILTERS });
//     setDraftFilters(EMPTY_FILTERS);
//     setAppliedFilters(EMPTY_FILTERS);
//     setPage(0);
//     handleCloseFilter();
//   };

//   useEffect(() => {
//   const timer = setTimeout(() => {
//     // আগের ফিল্টারগুলোর সাথে সার্চ টার্ম যোগ করা হচ্ছে
//     setAppliedFilters((prev) => ({ ...prev, search: searchTerm }));
//     setPage(0); // নতুন সার্চ করলে পেজিনেশন ০ থেকে শুরু হবে
//   }, 500);

//   return () => clearTimeout(timer); // ইউজার আবার টাইপ করলে আগের টাইমার ডিলিট হয়ে যাবে
// }, [searchTerm]);

//   const content = (
//     <Box sx={{ p: asPage ? 3 : 0 }}>
//       {asPage && (
//         <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
//           Comparison Details
//         </Typography>
//       )}

//       <Formik
//         initialValues={draftFilters}
//         enableReinitialize
//         onSubmit={handleApplyFilters}
//       >
//         {({ values, setFieldValue, handleSubmit, resetForm }) => (
//           <Form>
//             {/* Search baf start */}
//             <Stack 
//               direction="row" 
//               spacing={2} 
//               justifyContent="flex-end" 
//               sx={{ mb: 2, px: 2 }}
//             >
//               <TextField
//                 size="small"
//                 placeholder="Search Trx ID, Phone..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 // এন্টার দিলেও যেন সার্চ ট্রিগার হয়
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                     e.preventDefault();
//                     setAppliedFilters((prev) => ({ ...prev, search: searchTerm }));
//                     setPage(0);
//                   }
//                 }}
//                 sx={{ width: 350 }} // বাটনের জন্য উইডথ একটু বাড়ানো হয়েছে
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon fontSize="small" />
//                     </InputAdornment>
//                   ),
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <Button
//                         variant="contained"
//                         size="small"
//                         onClick={() => {
//                           setAppliedFilters((prev) => ({ ...prev, search: searchTerm }));
//                           setPage(0);
//                         }}
//                         sx={{ 
//                           minWidth: '60px', 
//                           height: '30px',
//                           fontSize: '12px',
//                           borderRadius: '4px',
//                           textTransform: 'none'
//                         }}
//                       >
//                         Search
//                       </Button>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Stack>
//             {/* Search baf End */}
//             <Menu
//               anchorEl={filterAnchor}
//               open={filterOpen}
//               onClose={handleCloseFilter}
//               PaperProps={{ sx: { p: 2, width: 300 } }}
//             >
//               <Stack spacing={2}>
//                 <SelectDropdownSingle
//                   name="channel_id"
//                   placeholder="Select Channel"
//                   fetchOptions={async () => channels}
//                   value={values.channel_id}
//                   onChange={(val) => {
//                     setFieldValue("channel_id", val);
//                     setFieldValue("wallet_id", "");
//                     setDraftFilters((prev) => ({
//                       ...prev,
//                       channel_id: val,
//                       wallet_id: "",
//                     }));
//                   }}
//                 />

//                 <SelectDropdownSingle
//                   name="wallet_id"
//                   placeholder="Select Wallet"
//                   fetchOptions={async () => wallets}
//                   value={values.wallet_id}
//                   disabled={!values.channel_id}
//                 />

//                 <SelectDropdownSingle
//                   name="status"
//                   placeholder="Select Status"
//                   fetchOptions={async () => [
//                     { id: "", label: "All Status" },
//                     { id: "matched", label: "Matched" },
//                     { id: "mismatch", label: "Mismatch" },
//                   ]}
//                   value={values.status}
//                 />

//                 <Stack direction="row" spacing={1}>
//                   <Button
//                     variant="outlined"
//                     size="small"
//                     fullWidth
//                     onClick={() => handleResetFilters(resetForm)}
//                   >
//                     Reset
//                   </Button>

//                   <Button
//                     variant="contained"
//                     size="small"
//                     fullWidth
//                     onClick={handleSubmit}
//                   >
//                     Apply
//                   </Button>
//                 </Stack>
//               </Stack>
//             </Menu>

//             <BaseTable
//               columns={columns}
//               rows={formattedRows}
//               selectable={false}
//               hasAction={false}
//               onFilter={handleOpenFilter}
//               totalRows={totalRows}
//               page={page}
//               rowsPerPage={rowsPerPage}
//               onPageChange={(e, newPage) => setPage(newPage)}
//               onRowsPerPageChange={(e) => {
//                 setRowsPerPage(parseInt(e.target.value, 10));
//                 setPage(0);
//               }}
//             />
//           </Form>
//         )}
//       </Formik>

//       <TransactionEditModal
//         open={editModal.open}
//         initialData={editModal.data}
//         onClose={() => setEditModal({ open: false, data: null })}
//         onSave={handleUpdate}
//       />
//     </Box>
//   );

//   return asPage ? (
//     content
//   ) : (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="xl"
//       fullWidth
//       PaperProps={{ sx: { borderRadius: 3, height: "90vh" } }}
//     >
//       <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
//         <Typography variant="h6" sx={{ fontWeight: 700 }}>
//           Comparison Details
//         </Typography>

//         <IconButton onClick={onClose}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent sx={{ p: 0 }}>{content}</DialogContent>
//     </Dialog>
//   );
// }


// src/features/reports/components/TransactionReportModal.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Chip,
  Stack,
  Button,
  Menu,
  TextField,
} from "@mui/material";

import {
  Close as CloseIcon,
  Check as CheckIcon,
  Close as CrossIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import { Formik, Form } from "formik";
import BaseTable from "../../../components/shared/BaseTable";
import TransactionEditModal from "./TransactionEditModal";
import SelectDropdownSingle from "../../../components/shared/SelectDropdownSingle";

import { fetchComparisonDetails } from "../api/reportsApi";
import api from "../../../api/axios";

const columns = [
  { id: "vendor_trx_date",  label: "PGW Trx Date",    sortable: true },
  { id: "billing_trx_date", label: "Billing Trx Date", sortable: true },
  { id: "trxId",            label: "Transaction ID",   sortable: true },
  { id: "senderWallet",     label: "Sender Number",    sortable: true },
  { id: "userId",           label: "Customer ID",      sortable: true },
  { id: "entity",           label: "Entity",           sortable: true },
  { id: "amount",           label: "Amount",           sortable: true },
  { id: "channel",          label: "Channel",          sortable: true },
  { id: "wallet",           label: "Wallet",           sortable: true },
  { id: "status",           label: "Status" },
  { id: "ownDb",            label: "Billing System" },
  { id: "vendor",           label: "Vendor" },
  { id: "actions",          label: "Actions" },
];

const EMPTY_FILTERS = {
  channel_id: "",
  wallet_id:  "",
  status:     "",
  search:     "",
};

export default function TransactionReportModal({
  batchId,
  processNo,
  open    = false,
  onClose = () => {},
  asPage  = false,
}) {
  const [transactions,   setTransactions]   = useState([]);
  const [filterAnchor,   setFilterAnchor]   = useState(null);
  const [draftFilters,   setDraftFilters]   = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);

  const [page,        setPage]        = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalRows,   setTotalRows]   = useState(0);

  const [channels, setChannels] = useState([]);
  const [wallets,  setWallets]  = useState([]);

  const [editModal,  setEditModal]  = useState({ open: false, data: null });
  const [searchTerm, setSearchTerm] = useState("");

  const filterOpen = Boolean(filterAnchor);

  // ─── fetch channels ───────────────────────────────────────────────
  useEffect(() => {
    api.get("/payment-channels").then((res) => {
      const data = res.data.data ?? [];
      setChannels(data.map((c) => ({ id: c.id, label: c.channel_name })));
    });
  }, []);

  // ─── fetch wallets (depends on selected channel in draft) ─────────
  useEffect(() => {
    if (!draftFilters.channel_id) {
      setWallets([]);
      return;
    }
    api
      .get("/wallets", { params: { channel_id: draftFilters.channel_id } })
      .then((res) => {
        const data = res.data.data ?? [];
        setWallets(data.map((w) => ({ id: w.id, label: w.wallet_number })));
      });
  }, [draftFilters.channel_id]);

  // ─── fetch transactions ───────────────────────────────────────────
  // useEffect(() => {
  //   if (!batchId || !processNo) return;

  //   fetchComparisonDetails(batchId, processNo, page + 1, rowsPerPage, appliedFilters)
  //     .then((res) => {
  //       const paginated = res.data.data;
  //       const raw       = paginated.data ?? [];

  //       setTotalRows(paginated.total);

  //       setTransactions(
  //         raw.map((row) => ({
  //           id:               row.id,
  //           trxId:            row.trx_id,
  //           senderWallet:     row.sender_no   ?? "-",
  //           userId:           row.customer_id ?? "-",
  //           entity:           row.entity      ?? "-",
  //           vendor_trx_date:  row.vendor_trx_date
  //             ? new Date(row.vendor_trx_date).toISOString().split("T")[0]
  //             : "-",
  //           billing_trx_date: row.billing_trx_date
  //             ? new Date(row.billing_trx_date).toISOString().split("T")[0]
  //             : "-",
  //           amount:     row.amount,
  //           channel:    row.channel?.channel_name ?? "-",
  //           wallet:     row.wallet?.wallet_number ?? "-",
  //           status:     row.status,
  //           ownDb:      row.is_billing_system,
  //           vendor:     row.is_vendor,
  //           channel_id: row.channel_id,
  //           wallet_id:  row.wallet_id,
  //         }))
  //       );
  //     })
  //     .catch((err) => console.error("Failed to fetch comparisons", err));
  // }, [batchId, processNo, page, rowsPerPage, appliedFilters]);
  // ─── fetch transactions ───────────────────────────────────────────
useEffect(() => {
  if (!batchId || !processNo) return;

  console.log("🔍 Fetching with filters:", appliedFilters); // ← temp debug

  fetchComparisonDetails(batchId, processNo, page + 1, rowsPerPage, appliedFilters)
    .then((res) => {
      const paginated = res.data.data;
      const raw       = paginated.data ?? [];

      setTotalRows(paginated.total);

      setTransactions(
        raw.map((row) => ({
          id:               row.id,
          trxId:            row.trx_id,
          senderWallet:     row.sender_no   ?? "-",
          userId:           row.customer_id ?? "-",
          entity:           row.entity      ?? "-",
          vendor_trx_date:  row.vendor_trx_date
            ? new Date(row.vendor_trx_date).toISOString().split("T")[0]
            : "-",
          billing_trx_date: row.billing_trx_date
            ? new Date(row.billing_trx_date).toISOString().split("T")[0]
            : "-",
          amount:     row.amount,
          channel:    row.channel?.channel_name ?? "-",
          wallet:     row.wallet?.wallet_number ?? "-",
          status:     row.status,
          ownDb:      row.is_billing_system,
          vendor:     row.is_vendor,
          channel_id: row.channel_id,
          wallet_id:  row.wallet_id,
        }))
      );
    })
    .catch((err) => console.error("Failed to fetch comparisons", err));
}, [batchId, processNo, page, rowsPerPage, appliedFilters]);

  // ─── formatted rows for BaseTable ────────────────────────────────
  const formattedRows = useMemo(
    () =>
      transactions.map((row) => {
        const isMatched = row.status === "matched";
        return {
          ...row,
          status: (
            <Chip
              label={row.status}
              size="small"
              sx={{
                bgcolor:    isMatched ? "#C6F6D5" : "#FED7D7",
                color:      isMatched ? "#2F855A" : "#C53030",
                fontWeight: 700,
                borderRadius: 1.5,
              }}
            />
          ),
          ownDb: row.ownDb
            ? <CheckIcon fontSize="small" color="success" />
            : <CrossIcon fontSize="small" color="error"   />,
          vendor: row.vendor
            ? <CheckIcon fontSize="small" color="success" />
            : <CrossIcon fontSize="small" color="error"   />,
          actions: (
            <IconButton
              size="small"
              onClick={() => {
                const rawRow = transactions.find((t) => t.id === row.id);
                setEditModal({ open: true, data: rawRow });
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          ),
        };
      }),
    [transactions]
  );

  // ─── search: fires only on button click or Enter ──────────────────
  const handleSearch = () => {
    setAppliedFilters((prev) => ({ ...prev, search: searchTerm }));
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setAppliedFilters((prev) => ({ ...prev, search: "" }));
    setPage(0);
  };

  // ─── update ───────────────────────────────────────────────────────
  const handleUpdate = async (values) => {
    try {
      const payload = {
        sender_no:        values.senderWallet,
        customer_id:      values.userId,
        entity:           values.entity,
        amount:           values.amount,
        vendor_trx_date:  values.vendor ? values.vendor_trx_date  : null,
        billing_trx_date: values.own_db ? values.billing_trx_date : null,
        status:           values.status,
        own_db:           values.own_db,
        is_vendor:        values.vendor,
        channel_id:       values.channel_id,
        wallet_id:        values.wallet_id,
      };

      await api.put(`/comparisons/${values.id}`, payload);

      setTransactions((prev) =>
        prev.map((r) =>
          r.id === values.id
            ? {
                ...r,
                senderWallet:     values.senderWallet,
                userId:           values.userId,
                entity:           values.entity,
                amount:           values.amount,
                vendor_trx_date:  values.vendor_trx_date,
                billing_trx_date: values.billing_trx_date,
                status:           values.status,
                ownDb:            values.own_db,
                vendor:           values.vendor,
              }
            : r
        )
      );

      setEditModal({ open: false, data: null });
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // ─── filter helpers ───────────────────────────────────────────────
  const handleOpenFilter = (e) => {
    setDraftFilters(appliedFilters);
    setFilterAnchor(e.currentTarget);
  };

  const handleCloseFilter = () => setFilterAnchor(null);

  const handleApplyFilters = (values) => {
    // preserve current search term when applying dropdown filters
    setAppliedFilters((prev) => ({ ...prev, ...values }));
    setPage(0);
    handleCloseFilter();
  };

  const handleResetFilters = (resetForm) => {
    // preserve current search term when resetting dropdown filters
    const reset = { ...EMPTY_FILTERS, search: appliedFilters.search };
    resetForm({ values: reset });
    setDraftFilters(reset);
    setAppliedFilters(reset);
    setPage(0);
    handleCloseFilter();
  };

  // ─── content ──────────────────────────────────────────────────────
  const content = (
    <Box sx={{ p: asPage ? 3 : 0 }}>
      {asPage && (
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Comparison Details
        </Typography>
      )}

      <Formik
        initialValues={draftFilters}
        enableReinitialize
        onSubmit={handleApplyFilters}
      >
        {({ values, setFieldValue, handleSubmit, resetForm }) => (
          <Form>
            <Menu
              anchorEl={filterAnchor}
              open={filterOpen}
              onClose={handleCloseFilter}
              PaperProps={{ sx: { p: 2, width: 300 } }}
            >
              <Stack spacing={2}>
                <SelectDropdownSingle
                  name="channel_id"
                  placeholder="Select Channel"
                  fetchOptions={async () => channels}
                  value={values.channel_id}
                  onChange={(val) => {
                    setFieldValue("channel_id", val);
                    setFieldValue("wallet_id", "");
                    setDraftFilters((prev) => ({
                      ...prev,
                      channel_id: val,
                      wallet_id:  "",
                    }));
                  }}
                />

                <SelectDropdownSingle
                  name="wallet_id"
                  placeholder="Select Wallet"
                  fetchOptions={async () => wallets}
                  value={values.wallet_id}
                  disabled={!values.channel_id}
                />

                <SelectDropdownSingle
                  name="status"
                  placeholder="Select Status"
                  fetchOptions={async () => [
                    { id: "",         label: "All Status" },
                    { id: "matched",  label: "Matched"    },
                    { id: "mismatch", label: "Mismatch"   },
                  ]}
                  value={values.status}
                />

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => handleResetFilters(resetForm)}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    onClick={handleSubmit}
                  >
                    Apply
                  </Button>
                </Stack>
              </Stack>
            </Menu>

            {/* ── Data table ── */}
            <BaseTable
              columns={columns}
              rows={formattedRows}
              selectable={false}
              hasAction={false}
              onFilter={handleOpenFilter}
              totalRows={totalRows}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              toolbarActions={   // ← ADD THIS PROP
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1.5px solid",
                    borderColor: "divider",
                    borderRadius: "8px",
                    overflow: "hidden",
                    bgcolor: "background.paper",
                    width: 340,
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    "&:focus-within": {
                      borderColor: "primary.main",
                      boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.12)",
                    },
                  }}
                >
                  <SearchIcon fontSize="small" sx={{ ml: 1.5, color: "text.disabled", flexShrink: 0 }} />
                  <TextField
                    size="small"
                    placeholder="Search Hear..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); handleSearch(); }
                    }}
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    sx={{ flex: 1, px: 1, "& input": { py: "7px", fontSize: "0.85rem" } }}
                  />
                  {searchTerm && (
                    <IconButton size="small" onClick={handleClearSearch} sx={{ mr: 0.5, color: "text.disabled" }}>
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  )}
                  <Button
                    variant="contained"
                    disableElevation
                    onClick={handleSearch}
                    sx={{
                      borderRadius: 0, px: 2.5, py: "7px", fontSize: "0.8rem",
                      fontWeight: 600, letterSpacing: "0.03em", textTransform: "none",
                      minWidth: 72, alignSelf: "stretch",
                      bgcolor: "rgb(152, 193, 86)", "&:hover": { bgcolor: "rgb(122, 159, 63)" },
                    }}
                  >
                    Search
                  </Button>
                </Box>
              }
            />
            {/* <BaseTable
              columns={columns}
              rows={formattedRows}
              selectable={false}
              hasAction={false}
              onFilter={handleOpenFilter}
              totalRows={totalRows}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            /> */}
          </Form>
        )}
      </Formik>

      <TransactionEditModal
        open={editModal.open}
        initialData={editModal.data}
        onClose={() => setEditModal({ open: false, data: null })}
        onSave={handleUpdate}
      />
    </Box>
  );

  return asPage ? (
    content
  ) : (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, height: "90vh" } }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Comparison Details
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>{content}</DialogContent>
    </Dialog>
  );
}