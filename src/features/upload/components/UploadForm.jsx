// // src/features/upload/pages/UploadForm.jsx
// import React, { useState, useRef } from "react";
// import {
//   Box, TextField, Paper, Popper, Typography, ClickAwayListener,
// } from "@mui/material";
// import CachedIcon from "@mui/icons-material/Cached";
// import { Formik } from "formik";
// import * as Yup from "yup"; 
// import { format } from "date-fns";
// import DateRangeIcon from '@mui/icons-material/DateRange';

// import ServiceUploadSection from "../components/ServiceUploadSection";
// import OwnDatabaseUpload from "../components/OwnDatabaseUpload";
// import CompareSection from "../components/CompareSection";
// import DateRangePickerPopover from "../../../components/shared/DateRangePickerPopover";
// import { submitReconciliation } from "../api/uploadApi";

// // 1. Validation Schema: Dropdowns are required
// const validationSchema = Yup.object().shape({
//   channel: Yup.string().required("Required"),
//   wallet: Yup.string().required("Required"),
//   billingSystem: Yup.string().required("Required"),
// });

// export default function UploadForm() {
//   const [serviceFiles, setServiceFiles] = useState([]);  
//   const [ownFiles, setOwnFiles] = useState([]);           
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [pendingRange, setPendingRange] = useState({ startDate: null, endDate: null });
//   const [appliedRange, setAppliedRange] = useState({ startDate: null, endDate: null });
//   const [datePickerOpen, setDatePickerOpen] = useState(false);
//   const anchorRef = useRef(null);

//   const handleToggleDatePicker = () => setDatePickerOpen((prev) => !prev);

//   const handleApply = () => {
//     setAppliedRange(pendingRange);
//     setDatePickerOpen(false);
//   };

//   const handleReset = () => {
//     setPendingRange({ startDate: null, endDate: null });
//     setAppliedRange({ startDate: null, endDate: null });
//   };

//   const handleCompare = async () => {
//     try {
//       setIsSubmitting(true);
//       const result = await submitReconciliation(serviceFiles, ownFiles, appliedRange);
//       console.log("Reconciliation result:", result);
//       alert("Files submitted successfully!");
//     } catch (err) {
//       console.error("Reconciliation failed:", err);
//       alert("Something went wrong. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Box sx={{ maxWidth: "100%", mx: "auto", py: 4, px: { xs: 2, sm: 3 } }}>
//       <Formik 
//         initialValues={{ channel: "", wallet: "", billingSystem: "" }} 
//         validationSchema={validationSchema}
//       >
//         {({ values, isValid, dirty }) => {
          
//           // STRICT VALIDATION LOGIC
//           const isDateSelected = !!(appliedRange.startDate && appliedRange.endDate);
//           const hasServiceFiles = serviceFiles.length > 0;
//           const hasOwnFiles = ownFiles.length > 0;

//           // Button activates ONLY if dropdowns are picked, date is set, and files are uploaded
//           const isButtonDisabled = 
//             !isValid || 
//             !dirty || 
//             !isDateSelected || 
//             !hasServiceFiles || 
//             !hasOwnFiles || 
//             isSubmitting;

//           return (
//             <>
//               {/* Header + Date Picker */}
//               <Paper
//                 variant="outlined"
//                 sx={{ p: 2, mb: 2, borderRadius: 3, bgcolor: "#ffffff", border: "1px solid #e2e8f0" }}
//               >
//                 <Box sx={{ mb: 3 }}>
//                   <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
//                     <CachedIcon fontSize="medium" sx={{ mr: 2, color: "#8ac441" }} />
//                     Transaction Reconciler
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Ensure accurate financial reconciliation by comparing provider transactions with your internal records.
//                   </Typography>
//                 </Box>

//                 <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                   <TextField
//                     ref={anchorRef}
//                     required
//                     label="Report Date Range"
//                     value={
//                       appliedRange.startDate && appliedRange.endDate
//                         ? `${format(appliedRange.startDate, "dd-MM-yyyy")} - ${format(appliedRange.endDate, "dd-MM-yyyy")}`
//                         : ""
//                     }
//                     onClick={handleToggleDatePicker}
//                     readOnly
//                     size="small"
//                     InputLabelProps={{
//                       shrink: !!(appliedRange.startDate && appliedRange.endDate),
//                       sx: {
//                         fontSize: "0.8125rem", // 13px
//                         top: "3px",
//                         "&.Mui-focused": { color: "rgb(152, 193, 86)" },
//                         color: (appliedRange.startDate && appliedRange.endDate) ? "rgb(152, 193, 86)" : "#64748b",
//                         "& .MuiFormLabel-asterisk": { color: "red" },
//                       }
//                     }}
//                     InputProps={{
//                       readOnly: true,
//                       endAdornment: (
//                         <Box sx={{ color: "text.secondary", display: "flex", alignItems: "center", ml: 1 }}>
//                           <DateRangeIcon sx={{ fontSize: 18 }} />
//                         </Box>
//                       ),
//                     }}
//                     sx={{
//                       width: 280,
//                       cursor: "pointer",
//                       "& .MuiOutlinedInput-root": {
//                         height: 42,
//                         borderRadius: 2,
//                         backgroundColor: "#ffffff",
//                         fontSize: "0.8125rem",
//                         display: "flex",
//                         alignItems: "center",
//                         paddingLeft: "8px",
//                         "& fieldset": { borderColor: "#e2e8f0" },
//                         "&:hover fieldset": { borderColor: "rgb(152, 193, 86)" },
//                         "&.Mui-focused fieldset": { borderColor: "rgb(152, 193, 86)", borderWidth: 2 },
//                       },
//                       "& .MuiInputBase-input": {
//                         cursor: "pointer",
//                         height: "100%",
//                         padding: "0 4px",
//                         display: "flex",
//                         alignItems: "center",
//                       },
//                     }}
//                   />
//                   <Popper open={datePickerOpen} anchorEl={anchorRef.current} placement="bottom-start" sx={{ zIndex: 1300 }}>
//                     <ClickAwayListener onClickAway={() => setDatePickerOpen(false)}>
//                       <Paper sx={{ p: 1, mt: 1, borderRadius: 2, boxShadow: 3 }}>
//                         <DateRangePickerPopover
//                           value={pendingRange}
//                           onChange={setPendingRange}
//                           onApply={handleApply}
//                           onReset={handleReset}
//                         />
//                       </Paper>
//                     </ClickAwayListener>
//                   </Popper>
//                 </Box>
//               </Paper>

//               <ServiceUploadSection
//                 values={values}
//                 appliedRange={appliedRange}  
//                 onUpload={(file, meta, id) =>
//                   setServiceFiles((prev) => [
//                     ...prev,
//                     { id, file, channelId: meta.channel, walletId: meta.wallet },
//                   ])
//                 }
//                 onDelete={(id) => setServiceFiles((prev) => prev.filter((f) => f.id !== id))}
//               />

//               <OwnDatabaseUpload
//                 values={values}
//                 appliedRange={appliedRange}  
//                 onUpload={(file, meta, id) =>
//                   setOwnFiles((prev) => [
//                     ...prev,
//                     { id, file, billingSystemId: meta.billingSystemId },
//                   ])
//                 }
//                 onDelete={(id) => setOwnFiles((prev) => prev.filter((f) => f.id !== id))}
//               />

//               <CompareSection
//                 disabled={isButtonDisabled}
//                 onCompare={handleCompare}
//               />
//             </>
//           );
//         }}
//       </Formik>
//     </Box>
//   );
// }

// src/features/upload/pages/UploadForm.jsx
import React, { useState, useRef } from "react";
import {
  Box, TextField, Paper, Popper, Typography, ClickAwayListener, Chip,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import LockIcon from "@mui/icons-material/LockOutlined";
import { Formik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { useLocation } from "react-router-dom";

import ServiceUploadSection from "../components/ServiceUploadSection";
import OwnDatabaseUpload from "../components/OwnDatabaseUpload";
import CompareSection from "../components/CompareSection";
import DateRangePickerPopover from "../../../components/shared/DateRangePickerPopover";
import { submitReconciliation, submitReprocess } from "../api/uploadApi";

const validationSchema = Yup.object().shape({
  channel:       Yup.string().required("Required"),
  wallet:        Yup.string().required("Required"),
  billingSystem: Yup.string().required("Required"),
});

export default function UploadForm() {
  const location = useLocation();

  // ── Reprocess mode ────────────────────────────────────────────────────────
  const reprocessState = location.state?.reprocess ? location.state : null;
  const isReprocess    = !!reprocessState;

  // ── File state ────────────────────────────────────────────────────────────
  const [serviceFiles, setServiceFiles] = useState([]);
  const [ownFiles,     setOwnFiles]     = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Date range — locked in reprocess mode ─────────────────────────────────
  const [pendingRange,   setPendingRange]   = useState({ startDate: null, endDate: null });
  const [appliedRange,   setAppliedRange]   = useState(
    isReprocess
      ? { startDate: new Date(reprocessState.startDate), endDate: new Date(reprocessState.endDate) }
      : { startDate: null, endDate: null }
  );
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggleDatePicker = () => {
    if (isReprocess) return;
    setDatePickerOpen((prev) => !prev);
  };

  const handleApply = () => {
    setAppliedRange(pendingRange);
    setDatePickerOpen(false);
  };

  const handleReset = () => {
    setPendingRange({ startDate: null, endDate: null });
    setAppliedRange({ startDate: null, endDate: null });
  };

  const handleCompare = async () => {
    try {
      setIsSubmitting(true);
      if (isReprocess) {
        await submitReprocess(reprocessState.batchId, serviceFiles, ownFiles, appliedRange);
        alert("Reprocess submitted successfully!");
      } else {
        await submitReconciliation(serviceFiles, ownFiles, appliedRange);
        alert("Files submitted successfully!");
      }
    } catch (err) {
      console.error("Failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const dateDisplayValue =
    appliedRange.startDate && appliedRange.endDate
      ? `${format(appliedRange.startDate, "dd-MM-yyyy")} - ${format(appliedRange.endDate, "dd-MM-yyyy")}`
      : "";

  return (
    <Box sx={{ maxWidth: "100%", mx: "auto", py: 4, px: { xs: 2, sm: 3 } }}>
      <Formik
        initialValues={{ channel: "", wallet: "", billingSystem: "" }}
        validationSchema={validationSchema}
      >
        {({ values, isValid, dirty }) => {
          const isDateSelected  = !!(appliedRange.startDate && appliedRange.endDate);
          const hasServiceFiles = serviceFiles.length > 0;
          const hasOwnFiles     = ownFiles.length > 0;

          const isButtonDisabled =
            !isValid        ||
            !dirty          ||
            !isDateSelected ||
            !hasServiceFiles ||
            !hasOwnFiles    ||
            isSubmitting;

          return (
            <>
              <Paper
                variant="outlined"
                sx={{ p: 2, mb: 2, borderRadius: 3, bgcolor: "#ffffff", border: "1px solid #e2e8f0" }}
              >
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5, flexWrap: "wrap" }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      <CachedIcon fontSize="medium" sx={{ mr: 1, color: "#8ac441" }} />
                      {isReprocess ? "Reprocess Transactions" : "Transaction Reconciler"}
                    </Typography>
                    {isReprocess && (
                      <Chip
                        label={`Batch #${reprocessState.batchId} · Run ${(reprocessState.processNo ?? 0) + 1}`}
                        size="small"
                        sx={{
                          bgcolor: "#f1f5e8", color: "rgb(176, 200, 125)",
                          border: "1px solid #f1f5e8", fontWeight: 600, fontSize: 12,
                        }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {isReprocess
                      ? "Upload new files to reprocess this batch. The date range is fixed to the original submission."
                      : "Ensure accurate financial reconciliation by comparing provider transactions with your internal records."}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <TextField
                    ref={anchorRef}
                    required
                    label="Report Date Range"
                    value={dateDisplayValue}
                    onClick={handleToggleDatePicker}
                    size="small"
                   InputLabelProps={{
                      shrink: !!(appliedRange.startDate && appliedRange.endDate),
                      sx: {
                        fontSize: "0.8125rem",
                        top: "3px",
                        color: isReprocess
                          ? "rgb(176, 200, 125)"   // floating label color in reprocess mode
                          : (appliedRange.startDate && appliedRange.endDate)
                            ? "rgb(152, 193, 86)"
                            : "#64748b",
                        "&.Mui-focused": {
                          color: isReprocess ? "rgb(176, 200, 125)" : "rgb(152, 193, 86)",
                        },
                        "& .MuiFormLabel-asterisk": { color: "red" },
                      },
                    }}

                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <Box sx={{ color: "text.secondary", display: "flex", alignItems: "center", ml: 1 }}>
                          {isReprocess
                            ?  <LockIcon sx={{ fontSize: 16, color: "rgb(176, 200, 125)" }} />
                            : <DateRangeIcon sx={{ fontSize: 18 }} />}
                        </Box>
                      ),
                    }}
                      sx={{
                        width: 280,
                        cursor: isReprocess ? "not-allowed" : "pointer",
                        "& .MuiOutlinedInput-root": {
                          height: 42,
                          borderRadius: 2,
                          backgroundColor: isReprocess ? "rgb(241, 245, 232)" : "#ffffff", // updated color
                          fontSize: "0.8125rem",
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "8px",
                          "& fieldset":       { borderColor: isReprocess ? "#d9f0c5" : "#e2e8f0" }, // optional subtle border
                          "&:hover fieldset": { borderColor: isReprocess ? "#d9f0c5" : "rgb(152, 193, 86)" },
                          "&.Mui-focused fieldset": { borderColor: isReprocess ? "#d9f0c5" : "rgb(152, 193, 86)", borderWidth: 2 },
                        },
                        "& .MuiInputBase-input": {
                          cursor:  isReprocess ? "not-allowed" : "pointer",
                          height:  "100%",
                          padding: "0 4px",
                          display: "flex",
                          alignItems: "center",
                        },
                      }}

                  />

                  {!isReprocess && (
                    <Popper
                      open={datePickerOpen}
                      anchorEl={anchorRef.current}
                      placement="bottom-start"
                      sx={{ zIndex: 1300 }}
                    >
                      <ClickAwayListener onClickAway={() => setDatePickerOpen(false)}>
                        <Paper sx={{ p: 1, mt: 1, borderRadius: 2, boxShadow: 3 }}>
                          <DateRangePickerPopover
                            value={pendingRange}
                            onChange={setPendingRange}
                            onApply={handleApply}
                            onReset={handleReset}
                          />
                        </Paper>
                      </ClickAwayListener>
                    </Popper>
                  )}
                </Box>
              </Paper>

              <ServiceUploadSection
                values={values}
                appliedRange={appliedRange}
                onUpload={(file, meta, id) =>
                  setServiceFiles((prev) => [
                    ...prev,
                    { id, file, channelId: meta.channel, walletId: meta.wallet },
                  ])
                }
                onDelete={(id) => setServiceFiles((prev) => prev.filter((f) => f.id !== id))}
              />

              <OwnDatabaseUpload
                values={values}
                appliedRange={appliedRange}
                onUpload={(file, meta, id) =>
                  setOwnFiles((prev) => [
                    ...prev,
                    { id, file, billingSystemId: meta.billingSystemId },
                  ])
                }
                onDelete={(id) => setOwnFiles((prev) => prev.filter((f) => f.id !== id))}
              />

              <CompareSection
                disabled={isButtonDisabled}
                onCompare={handleCompare}
                label={isReprocess ? "Reprocess" : "Compare"}
              />
            </>
          );
        }}
      </Formik>
    </Box>
  );
}