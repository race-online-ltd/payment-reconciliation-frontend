import ReportsSummaryTable from "../components/ReportsSummaryTable";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import TransactionReportModal from "../components/TransactionReportModal";
import ReprocessModal from "../../../components/reports/ReprocessModal";
import { fetchReconciliationSummary } from "../api/reportsApi";

function transformSummary(apiData) {
  return apiData.map((item) => ({
    id: `${item.batch_id}_${item.process_no}`,
    date: item.date,
    transactions: item.transactions,
    matched: item.matched,
    mismatched: {
      bkashPGW:     item.mismatch.bkash_pgw,
      bkashPaybill: item.mismatch.bkash_paybill,
      nagadPGW:     item.mismatch.nagad_pgw,
      nagadPaybill: item.mismatch.nagad_paybill,
      ownDB:        item.mismatch.own_db,
      total:        item.mismatch.total,
    },
    batch_id:   item.batch_id,
    process_no: item.process_no,
  }));
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState([]);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reprocessModalOpen, setReprocessModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null); 
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString().split("T")[0];
    const lastDay = today.toISOString().split("T")[0];

    fetchReconciliationSummary(firstDay, lastDay)
      .then((res) => {
        console.log("API response:", res.data);
        setReportData(transformSummary(res.data.data));
      })
      .catch((err) => {
        console.error("Failed to fetch summary", err);
      });
  }, []);

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', py: 4, px: { xs: 2, sm: 3 } }}>
      <ReportsSummaryTable
        data={reportData}
        onView={(row) => {
          setSelectedReport(row);
          setReportModalOpen(true);
        }}
      />

      <TransactionReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        batchId={selectedReport?.batch_id}
        processNo={selectedReport?.process_no}
      />

      <ReprocessModal
        open={reprocessModalOpen}
        onClose={() => setReprocessModalOpen(false)}
      />
    </Box>
  );
}