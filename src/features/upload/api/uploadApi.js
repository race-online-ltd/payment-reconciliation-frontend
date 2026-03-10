// import api from "../../../api/axios";
// import { format } from "date-fns"; // ✅ missing import added

// export const fetchChannels = async () => {
//   const res = await api.get("/payment-channels");
//   return res.data.data.map((c) => ({ id: c.id, label: c.channel_name }));
// };

// export const fetchWallets = async () => {
//   const res = await api.get("/wallets");
//   return res.data.data.map((w) => ({
//     id: w.id,
//     label: w.wallet_number,
//     channelId: w.payment_channel.id,
//   }));
// };

// export const fetchBillingSystem = async () => {
//   const res = await api.get("/billing-systems");
//   return res.data.data.map((b) => ({ id: b.id, label: b.billing_name }));
// };

// export const submitReconciliation = async (serviceFiles, ownFiles, dateRange) => {
//   const formData = new FormData();

//   if (dateRange.startDate)
//     formData.append("start_date", format(dateRange.startDate, "yyyy-MM-dd"));
//   if (dateRange.endDate)
//     formData.append("end_date", format(dateRange.endDate, "yyyy-MM-dd"));

//   serviceFiles.forEach((f, i) => {
//     formData.append(`service_files[${i}]`, f.file);         // Laravel reads as $request->file('service_files')
//     formData.append(`service_channel_id[${i}]`, f.channelId);
//     formData.append(`service_wallet_id[${i}]`, f.walletId);
//   });

//   ownFiles.forEach((f, i) => {
//     formData.append(`billing_files[${i}]`, f.file);         // Laravel reads as $request->file('billing_files')
//     formData.append(`billing_system_id[${i}]`, f.billingSystemId);
//   });

//   const res = await api.post("/reconcile", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

//   return res.data;
// };

import api from "../../../api/axios";
import { format } from "date-fns";

export const fetchChannels = async () => {
  const res = await api.get("/payment-channels");
  return res.data.data.map((c) => ({ id: c.id, label: c.channel_name }));
};

export const fetchWallets = async () => {
  const res = await api.get("/wallets");
  return res.data.data.map((w) => ({
    id: w.id,
    label: w.wallet_number,
    channelId: w.payment_channel.id,
  }));
};

export const fetchBillingSystem = async () => {
  const res = await api.get("/billing-systems");
  return res.data.data.map((b) => ({ id: b.id, label: b.billing_name }));
};

export const submitReconciliation = async (serviceFiles, ownFiles, dateRange) => {
  const formData = new FormData();

  if (dateRange.startDate)
    formData.append("start_date", format(dateRange.startDate, "yyyy-MM-dd"));
  if (dateRange.endDate)
    formData.append("end_date", format(dateRange.endDate, "yyyy-MM-dd"));

  serviceFiles.forEach((f, i) => {
    formData.append(`service_files[${i}]`, f.file);
    formData.append(`service_channel_id[${i}]`, f.channelId);
    formData.append(`service_wallet_id[${i}]`, f.walletId);
  });

  ownFiles.forEach((f, i) => {
    formData.append(`billing_files[${i}]`, f.file);
    formData.append(`billing_system_id[${i}]`, f.billingSystemId);
  });

  const res = await api.post("/reconcile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// Add this function to src/features/upload/api/uploadApi.js
// alongside your existing submitReconciliation function

export async function submitReprocess(batchId, serviceFiles, ownFiles, appliedRange) {
  const formData = new FormData();

  formData.append("start_date", format(appliedRange.startDate, "yyyy-MM-dd"));
  formData.append("end_date",   format(appliedRange.endDate,   "yyyy-MM-dd"));

  serviceFiles.forEach((f, i) => {
    formData.append(`service_files[${i}]`,      f.file);
    formData.append(`service_channel_id[${i}]`, f.channelId);
    formData.append(`service_wallet_id[${i}]`,  f.walletId);
  });

  ownFiles.forEach((f, i) => {
    formData.append(`billing_files[${i}]`,    f.file);
    formData.append(`billing_system_id[${i}]`, f.billingSystemId);
  });

const response = await api.post(`/reprocess/${batchId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}