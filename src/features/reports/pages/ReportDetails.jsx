// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Typography,
//   Box,
//   Chip,
//   Stack,
//   Button,
//   Menu,
// } from "@mui/material";
// import { Check as CheckIcon, Close as CrossIcon } from "@mui/icons-material";
// import { useParams } from "react-router-dom";
// import { Formik, Form } from "formik";
// import BaseTable from "../../../components/shared/BaseTable";
// import SelectDropdownSingle from "../../../components/shared/SelectDropdownSingle";
// import { fetchComparisonDetails } from "../api/reportsApi";

// const columns = [
//   { id: "trxId", label: "Transaction ID", sortable: true },
//   { id: "senderWallet", label: "Sender Wallet", sortable: true },
//   { id: "userId", label: "User ID", sortable: true },
//   { id: "entity", label: "Entity", sortable: true },
//   { id: "date", label: "Date", sortable: true },
//   { id: "amount", label: "Amount", sortable: true },
//   { id: "channel", label: "Channel", sortable: true },
//   { id: "wallet", label: "Wallet", sortable: true },
//   { id: "status", label: "Status" },
//   { id: "ownDb", label: "Own DB" },
//   { id: "vendor", label: "Vendor" },
// ];

// const EMPTY_FILTERS = {
//   channelFilter: "",
//   walletFilter: "",
//   statusFilter: "All Status",
// };

// export default function ReportDetails() {
//   const { batchId, processNo } = useParams();

//   const [transactions, setTransactions] = useState([]);
//   const [filterAnchor, setFilterAnchor] = useState(null);
//   const filterOpen = Boolean(filterAnchor);
//   const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);
//   const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);

//   useEffect(() => {
//     if (!batchId || !processNo) return;

//     fetchComparisonDetails(batchId, processNo)
//       .then((res) => {
//         const raw = res.data.data?.data ?? res.data.data ?? [];
//         setTransactions(
//           raw.map((row) => ({
//             id: row.id,
//             trxId: row.trx_id,
//             senderWallet: row.sender_no ?? "-",
//             userId: row.customer_id ?? "-",
//             entity: row.entity ?? "-",
//             date: row.trx_date,
//             amount: row.amount,
//             channel: row.channel?.name ?? "-",
//             wallet: row.wallet?.wallet_no ?? "-",
//             status: row.status,
//             ownDb: row.is_billing_system,
//             vendor: row.is_vendor,
//           }))
//         );
//       })
//       .catch((err) => console.error("Failed to fetch comparisons", err));
//   }, [batchId, processNo]);

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
//         };
//       }),
//     [transactions]
//   );

//   const filteredRows = useMemo(
//     () =>
//       formattedRows.filter((row) => {
//         const channelMatch = appliedFilters.channelFilter
//           ? row.channel === appliedFilters.channelFilter
//           : true;

//         const walletMatch = appliedFilters.walletFilter
//           ? row.wallet === appliedFilters.walletFilter
//           : true;

//         const statusMatch =
//           appliedFilters.statusFilter !== "All Status"
//             ? row.status.props.label === appliedFilters.statusFilter
//             : true;

//         return channelMatch && walletMatch && statusMatch;
//       }),
//     [formattedRows, appliedFilters]
//   );

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
//         Comparison Details
//       </Typography>

//       <Formik
//         initialValues={draftFilters}
//         enableReinitialize
//         onSubmit={(values) => setAppliedFilters(values)}
//       >
//         {({ values, handleSubmit }) => (
//           <Form>
            

//             <BaseTable
//               title=""
//               columns={columns}
//               rows={filteredRows}
//               selectable={false}
//               hasAction={false}
//             />
//           </Form>
//         )}
//       </Formik>
//     </Box>
//   );
// }


import React from "react";
import { useParams } from "react-router-dom";
import TransactionReportModal from "../components/TransactionReportModal";

export default function ReportDetails() {
  const { batchId, processNo } = useParams();

  return (
    <TransactionReportModal
      batchId={batchId}
      processNo={processNo}
      asPage={true} // renders full page, with filters and table
    />
  );
}
