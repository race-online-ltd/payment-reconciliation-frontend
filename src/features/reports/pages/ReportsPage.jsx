import ReportsSummaryTable from "../components/ReportsSummaryTable";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import ReprocessModal from "../../../components/reports/ReprocessModal";
import { fetchReconciliationSummary } from "../api/reportsApi";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function transformSummary(apiData) {
  return apiData.map((item) => ({
    id: `${item.batch_id}_${item.process_no}`,
    start_date: item.start_date,   // from batches table
    end_date: item.end_date,       // from batches table
    transactions: item.transactions,
    matched: item.matched,
    mismatched: {
      bkashPGW: item.mismatch.bkash_pgw,
      bkashPaybill: item.mismatch.bkash_paybill,
      nagadPGW: item.mismatch.nagad_pgw,
      nagadPaybill: item.mismatch.nagad_paybill,
      ownDB: item.mismatch.own_db,
      total: item.mismatch.total,
    },
    batch_id: item.batch_id,
    process_no: item.process_no,
  }));
}

export default function ReportsPage() {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start_date: '2024-01-01',  // sensible default
    end_date: dayjs().format('YYYY-MM-DD'),
  });

  useEffect(() => {
    setLoading(true);
    fetchReconciliationSummary(dateRange.start_date, dateRange.end_date)
      .then((res) => setReportData(transformSummary(res.data.data)))
      .catch((err) => console.error("Failed to fetch summary", err))
      .finally(() => setLoading(false));
  }, [dateRange]);  // re-fetches when filter changes

  return (
    <Box sx={{ maxWidth: "100%", mx: "auto", py: 4, px: { xs: 2, sm: 3 } }}>
      <ReportsSummaryTable
        data={reportData}
        loading={loading}
        onDateRangeChange={setDateRange}  // ← table calls this on Apply
        onView={(row) => navigate(`/reports/${row.batch_id}/${row.process_no}`)}
      />
    </Box>
  );
}