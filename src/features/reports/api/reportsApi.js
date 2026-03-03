// src/api/reportsApi.js
import api from '../../../api/axios';


export const fetchReconciliationSummary = (startDate, endDate) => {
  return api.post("/reconciliation-summary", {
    start_date: startDate,
    end_date: endDate,
  });
};

export const fetchComparisonDetails = (batchId, processNo, params = {}) => {
  return api.get("/comparisons", {
    params: {
      batch_id: batchId,
      process_no: processNo,
      ...params,
    },
  });
};