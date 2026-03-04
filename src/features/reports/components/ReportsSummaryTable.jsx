import React, { useState } from "react";
import { IconButton, Stack, Typography, Menu } from "@mui/material";
import { VisibilityOutlined as ViewIcon, CachedOutlined as RefreshIcon } from "@mui/icons-material";
import dayjs from "dayjs";
import ReprocessReport from "./ReprocessReportDialog";
import BaseTable from "../../../components/shared/BaseTable";
import DateRangePickerPopover from "../../../components/shared/DateRangePickerPopover";

export default function ReportsSummaryTable({ data, loading, onDateRangeChange, onView }) {

  // --- Filter menu anchor ---
  const [filterAnchor, setFilterAnchor] = useState(null);
  const filterOpen = Boolean(filterAnchor);

  // --- Pending date range (inside the popover, not yet applied) ---
  const [pendingRange, setPendingRange] = useState({ startDate: null, endDate: null });

  // --- Reprocess modal ---
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleApply = () => {
    setFilterAnchor(null);
    // Tell the parent to re-fetch with the new range
    onDateRangeChange({
      start_date: pendingRange.startDate,
      end_date: pendingRange.endDate,
    });
  };

  const handleReset = () => {
    setPendingRange({ startDate: null, endDate: null });
    // Reset to default wide range
    onDateRangeChange({
      start_date: "2024-01-01",
      end_date: dayjs().format("YYYY-MM-DD"),
    });
  };

  // --- Build table rows directly from server-filtered data ---
  const rows = data.map((row) => ({
    id: row.id,
    date: (
      <Typography sx={{ fontWeight: 600 }}>
        {dayjs(row.start_date).format("DD-MM-YYYY")} → {dayjs(row.end_date).format("DD-MM-YYYY")}
      </Typography>
    ),
    transactions: (
      <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>
        {row.transactions}
      </Typography>
    ),
    matched: (
      <Typography sx={{ fontWeight: 600, color: "#10b981" }}>
        {row.matched}
      </Typography>
    ),
    bkashPGW:     row.mismatched.bkashPGW,
    bkashPaybill: row.mismatched.bkashPaybill,
    nagadPGW:     row.mismatched.nagadPGW,
    nagadPaybill: row.mismatched.nagadPaybill,
    ownDB: (
      <Typography sx={{ fontWeight: 700 }}>{row.mismatched.ownDB}</Typography>
    ),
    total: (
      <Typography sx={{ fontWeight: 600, color: "#ef4444" }}>
        {row.mismatched.total}
      </Typography>
    ),
    actions: (
      <Stack direction="row" justifyContent="center" spacing={1}>
        <IconButton size="small" onClick={() => onView?.(row)}>
          <ViewIcon fontSize="small" sx={{ color: "#64748b" }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRow(row);
            setWorkflowOpen(true);
          }}
        >
          <RefreshIcon fontSize="small" sx={{ color: "#64748b" }} />
        </IconButton>
      </Stack>
    ),
  }));

  const columns = [
    { id: "date",         label: "Date",         sortable: true },
    { id: "transactions", label: "Transactions",  sortable: true },
    { id: "matched",      label: "Matched",       sortable: true },
    {
      id:      "mismatched_group",
      label:   "Mismatched",
      align:   "center",
      colSpan: 6,
      children: [
        { id: "bkashPGW",     label: "bKash PGW"     },
        { id: "bkashPaybill", label: "bKash Paybill" },
        { id: "nagadPGW",     label: "Nagad PGW"     },
        { id: "nagadPaybill", label: "Nagad Paybill" },
        { id: "ownDB",        label: "Own DB"        },
        { id: "total",        label: "Total"         },
      ],
    },
  ];

  return (
    <>
      {/* Date Range Filter Menu */}
      <Menu
        anchorEl={filterAnchor}
        open={filterOpen}
        onClose={() => setFilterAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0px 8px 24px rgba(0,0,0,0.10)",
            p: 0,
          },
        }}
      >
        <DateRangePickerPopover
          value={pendingRange}
          onChange={setPendingRange}
          onApply={handleApply}
          onReset={handleReset}
        />
      </Menu>

      <BaseTable
        title="Reports"
        columns={columns}
        rows={rows}
        loading={loading}
        hasAction={true}
        selectable={false}
        showExport={false}
        onFilter={(e) => setFilterAnchor(e.currentTarget)}
      />

      {workflowOpen && (
        <ReprocessReport
          open={workflowOpen}
          onClose={() => {
            setWorkflowOpen(false);
            setSelectedRow(null);
          }}
          reportStartDate={selectedRow?.start_date}
          reportEndDate={selectedRow?.end_date}
          reportId={selectedRow?.batch_id}
          processNo={selectedRow?.process_no}
        />
      )}
    </>
  );
}