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
import { Close as CloseIcon, Check as CheckIcon, Close as CrossIcon, Edit as EditIcon } from "@mui/icons-material";
import { Formik, Form } from "formik";
import BaseTable from "../../../components/shared/BaseTable";
import SelectDropdownSingle from "../../../components/shared/SelectDropdownSingle";
import { fetchComparisonDetails } from "../api/reportsApi";
import axios from "axios";

const columns = [
  { id: "trxId", label: "Transaction ID", sortable: true },
  { id: "senderWallet", label: "Sender Wallet", sortable: true },
  { id: "userId", label: "User ID", sortable: true },
  { id: "entity", label: "Entity", sortable: true },
  { id: "date", label: "Date", sortable: true },
  { id: "amount", label: "Amount", sortable: true },
  { id: "channel", label: "Channel", sortable: true },
  { id: "wallet", label: "Wallet", sortable: true },
  { id: "status", label: "Status" },
  { id: "ownDb", label: "Own DB" },
  { id: "vendor", label: "Vendor" },
  { id: "actions", label: "Actions" },
];

const EMPTY_FILTERS = {
  channelFilter: "",
  walletFilter: "",
  statusFilter: "All Status",
};

export default function TransactionReport({
  batchId,
  processNo,
  open = false,
  onClose = () => {},
  asPage = false,
}) {
  const [transactions, setTransactions] = useState([]);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const filterOpen = Boolean(filterAnchor);
  const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRow, setEditedRow] = useState({});

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
            date: row.trx_date
              ? new Date(row.trx_date).toISOString().split("T")[0] // YYYY-MM-DD for <input type="date">
              : "-",
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

  const handleOpenFilter = (e) => {
    setDraftFilters(appliedFilters);
    setFilterAnchor(e.currentTarget);
  };
  const handleCloseFilter = () => setFilterAnchor(null);
  const handleApplyFilters = (values) => {
    setAppliedFilters(values);
    handleCloseFilter();
  };

  const handleSaveRow = async (rowId) => {
    try {
      await axios.put(`/api/transactions/${rowId}`, editedRow);
      setTransactions((prev) =>
        prev.map((r) => (r.id === rowId ? { ...r, ...editedRow } : r))
      );
      setEditingRowId(null);
      setEditedRow({});
    } catch (err) {
      console.error("Failed to update transaction", err);
    }
  };

  const formattedRows = useMemo(
    () =>
      transactions.map((row) => {
        const isMatched = row.status === "matched";
        const isEditing = row.id === editingRowId;

        return {
          ...row,
          senderWallet: isEditing ? (
            <TextField
              value={editedRow.senderWallet ?? row.senderWallet}
              size="small"
              onChange={(e) => setEditedRow({ ...editedRow, senderWallet: e.target.value })}
            />
          ) : row.senderWallet,
          userId: isEditing ? (
            <TextField
              value={editedRow.userId ?? row.userId}
              size="small"
              onChange={(e) => setEditedRow({ ...editedRow, userId: e.target.value })}
            />
          ) : row.userId,
          entity: isEditing ? (
            <TextField
              value={editedRow.entity ?? row.entity}
              size="small"
              onChange={(e) => setEditedRow({ ...editedRow, entity: e.target.value })}
            />
          ) : row.entity,
          amount: isEditing ? (
            <TextField
              value={editedRow.amount ?? row.amount}
              size="small"
              type="number"
              onChange={(e) => setEditedRow({ ...editedRow, amount: e.target.value })}
            />
          ) : row.amount,
          date: isEditing ? (
            <TextField
              type="date"
              size="small"
              value={editedRow.date ?? row.date}
              onChange={(e) => setEditedRow({ ...editedRow, date: e.target.value })}
            />
          ) : row.date,
          channel: row.channel,
          wallet: row.wallet,
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
          actions: isEditing ? (
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="contained" onClick={() => handleSaveRow(row.id)}>
                Save
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setEditingRowId(null);
                  setEditedRow({});
                }}
              >
                Cancel
              </Button>
            </Stack>
          ) : (
            <IconButton size="small" onClick={() => {
              setEditingRowId(row.id);
              setEditedRow(row);
            }}>
              <EditIcon fontSize="small" />
            </IconButton>
          ),
        };
      }),
    [transactions, editingRowId, editedRow]
  );

  const filteredRows = useMemo(
    () =>
      formattedRows.filter((row) => {
        const channelMatch = appliedFilters.channelFilter ? row.channel === appliedFilters.channelFilter : true;
        const walletMatch = appliedFilters.walletFilter ? row.wallet === appliedFilters.walletFilter : true;
        const statusMatch =
          appliedFilters.statusFilter !== "All Status"
            ? row.status.props.label === appliedFilters.statusFilter
            : true;
        return channelMatch && walletMatch && statusMatch;
      }),
    [formattedRows, appliedFilters]
  );

  const content = (
    <Box sx={{ p: asPage ? 3 : 0, flexGrow: 1 }}>
      {asPage && (
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Comparison Details
        </Typography>
      )}
      <Formik initialValues={draftFilters} enableReinitialize onSubmit={handleApplyFilters}>
        {({ values, handleSubmit, resetForm }) => (
          <Form>
            <Menu
              anchorEl={filterAnchor}
              open={filterOpen}
              onClose={handleCloseFilter}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{ sx: { p: 2, width: 300, borderRadius: 2 } }}
            >
              <Stack spacing={2}>
                <SelectDropdownSingle
                  name="channelFilter"
                  placeholder="Select Channel"
                  fetchOptions={async () => [
                    { id: "bKash Paybill", label: "bKash Paybill" },
                    { id: "bKash Payment Gateway", label: "bKash Payment Gateway" },
                    { id: "Nagad Paybill", label: "Nagad Paybill" },
                    { id: "Nagad Payment Gateway", label: "Nagad Payment Gateway" },
                  ]}
                  sx={{ width: "100%" }}
                  value={values.channelFilter}
                />
                <SelectDropdownSingle
                  key={values.channelFilter}
                  name="walletFilter"
                  placeholder="Select Wallet"
                  fetchOptions={async () => []}
                  sx={{ width: "100%" }}
                  disabled={!values.channelFilter}
                  value={values.walletFilter}
                />
                <SelectDropdownSingle
                  name="statusFilter"
                  placeholder="Select Status"
                  fetchOptions={async () => [
                    { id: "All Status", label: "All Status" },
                    { id: "matched", label: "Matched" },
                    { id: "mismatch", label: "Mismatch" },
                  ]}
                  sx={{ width: "100%" }}
                  value={values.statusFilter}
                />
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => {
                      resetForm({ values: EMPTY_FILTERS });
                      setDraftFilters(EMPTY_FILTERS);
                    }}
                  >
                    Reset
                  </Button>
                  <Button variant="contained" size="small" fullWidth onClick={handleSubmit}>
                    Apply
                  </Button>
                </Stack>
              </Stack>
            </Menu>

            <Box sx={{ flexGrow: 1, px: 2 }}>
              <BaseTable
                title=""
                columns={columns}
                rows={filteredRows}
                selectable={false}
                hasAction={false}
                onFilter={handleOpenFilter}
                sx={{ "& th, & td": { px: 1, py: 0.5, whiteSpace: "nowrap" } }}
              />
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );

  if (asPage) return content;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth PaperProps={{ sx: { borderRadius: 3, height: "90vh" } }}>
      <DialogTitle sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography component="span" variant="h6" sx={{ fontWeight: 700 }}>
          Comparison Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>{content}</DialogContent>
    </Dialog>
  );
}
