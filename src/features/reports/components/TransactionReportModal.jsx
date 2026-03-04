// src/features/reports/components/TransactionReportModal.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Chip, Stack } from "@mui/material";
import { Close as CloseIcon, Edit as EditIcon, Check as CheckIcon, Close as CrossIcon } from "@mui/icons-material";
import BaseTable from "../../../components/shared/BaseTable";
import TransactionEditModal from "./TransactionEditModal";
import FilterMenu from "./FilterMenu";
import { TRANSACTION_COLUMNS } from "../context/columns";
import { fetchComparisonDetails } from "../api/reportsApi";
import axios from "axios";

const EMPTY_FILTERS = { channelFilter: "", walletFilter: "", statusFilter: "All Status" };

export default function TransactionReportModal({ batchId, processNo, open = false, onClose = () => {}, asPage = false }) {
  const [transactions, setTransactions] = useState([]);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [editModal, setEditModal] = useState({ open: false, data: null });

  useEffect(() => {
    if (!batchId || !processNo) return;

    fetchComparisonDetails(batchId, processNo)
      .then((res) => {
        const raw = res.data.data?.data ?? res.data.data ?? [];
        setTransactions(
          raw.map((row) => ({
            id: row.id,
            trxId: row.trx_id,
            senderWallet: row.sender_no ?? "-",
            userId: row.customer_id ?? "-",
            entity: row.entity ?? "-",
            date: row.trx_date ? new Date(row.trx_date).toISOString().split("T")[0] : "-",
            billing_date: row.billing_trx_date ? new Date(row.billing_trx_date).toISOString().split("T")[0] : "-",
            amount: row.amount,
            channel: row.channel?.name ?? "-",
            wallet: row.wallet?.wallet_no ?? "-",
            status: row.status,
            ownDb: row.is_billing_system,
            vendor: row.is_vendor,
          }))
        );
      })
      .catch((err) => console.error("Failed to fetch comparisons", err));
  }, [batchId, processNo]);

  const formattedRows = useMemo(() => 
    transactions.map((row) => {
      const isMatched = row.status === "matched";
      return {
        ...row,
        status: (
          <Chip
            label={row.status}
            size="small"
            sx={{
              bgcolor: isMatched ? "#C6F6D5" : "#FED7D7",
              color: isMatched ? "#2F855A" : "#C53030",
              fontWeight: 700,
              borderRadius: 1.5,
            }}
          />
        ),
        ownDb: row.ownDb ? <CheckIcon fontSize="small" color="success" /> : <CrossIcon fontSize="small" color="error" />,
        vendor: row.vendor ? <CheckIcon fontSize="small" color="success" /> : <CrossIcon fontSize="small" color="error" />,
        actions: (
          <IconButton size="small" onClick={() => setEditModal({ open: true, data: row })}>
            <EditIcon fontSize="small" color="primary" />
          </IconButton>
        ),
      };
    }), [transactions]
  );

  const filteredRows = useMemo(() => 
    formattedRows.filter((row) => {
      const channelMatch = appliedFilters.channelFilter ? row.channel === appliedFilters.channelFilter : true;
      const statusMatch = appliedFilters.statusFilter !== "All Status" 
        ? row.status.props.label === appliedFilters.statusFilter 
        : true;
      return channelMatch && statusMatch;
    }), [formattedRows, appliedFilters]
  );

  const handleUpdate = async (values) => {
    try {
      await axios.put(`/api/transactions/${values.id}`, values);
      setTransactions((prev) => prev.map((r) => (r.id === values.id ? { ...r, ...values } : r)));
      setEditModal({ open: false, data: null });
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const content = (
    <Box sx={{ p: asPage ? 3 : 0, flexGrow: 1 }}>
      {asPage && <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Comparison Details</Typography>}
      
      <BaseTable
        columns={TRANSACTION_COLUMNS}
        rows={filteredRows}
        onFilter={(e) => setFilterAnchor(e.currentTarget)}
        sx={{ "& th, & td": { px: 1, py: 0.8, whiteSpace: "nowrap" } }}
      />

      <FilterMenu 
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
        initialFilters={appliedFilters}
        onApply={(v) => { setAppliedFilters(v); setFilterAnchor(null); }}
      />

      <TransactionEditModal 
        open={editModal.open}
        initialData={editModal.data}
        onClose={() => setEditModal({ open: false, data: null })}
        onSave={handleUpdate}
      />
    </Box>
  );

  return asPage ? content : (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth PaperProps={{ sx: { borderRadius: 3, height: "90vh" } }}>
      <DialogTitle sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography component="span" variant="h6" sx={{ fontWeight: 700 }}>Comparison Details</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>{content}</DialogContent>
    </Dialog>
  );
}