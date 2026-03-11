// src/components/shared/ExportCSVButton.jsx
import React from "react";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PropTypes from "prop-types";

// ── Shared util — also used by BaseTable's mobile icon button ──────────────
const getCellValue = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number") return value;

  if (React.isValidElement(value)) {
    // Chip: use label prop
    if (value.props?.label !== undefined) return value.props.label;

    // MUI icons: color="success" → ✓, color="error" → ✗
    const color = value.props?.color;
    if (color === "success") return "✓";
    if (color === "error")   return "✗";

    // Fallback: check type name strings
    const typeStr = [
      value.type?.muiName,
      value.type?.displayName,
      value.type?.name,
      value.type?.render?.displayName,
    ].filter(Boolean).join(" ");
    if (/check/i.test(typeStr))        return "✓";
    if (/close|cross/i.test(typeStr))  return "✗";

    // Generic: recurse into children
    if (value.props?.children) return getCellValue(value.props.children);
    return "";
  }

  if (Array.isArray(value)) return value.map(getCellValue).join(" ");
  return String(value);
};

export function downloadCSV(columns, rows, filename = "export.csv") {
  if (!rows || !rows.length) return;

  // Exclude actions column
  const exportColumns = columns.filter((col) => col.id !== "actions");

  const header = exportColumns.map((col) => `"${col.label}"`).join(",");
  const csvRows = rows.map((row) =>
    exportColumns.map((col) => {
      const raw = getCellValue(row[col.id]);
      return `"${String(raw).replace(/"/g, '""')}"`;
    }).join(",")
  );

  const csvContent = [header, ...csvRows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href  = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ── Component ──────────────────────────────────────────────────────────────
export default function ExportCSVButton({ columns, rows, filename, onClick, color }) {
  const handleExport = () => {
    if (onClick) return onClick();
    downloadCSV(columns, rows, filename || "export.csv");
  };

  return (
    <Button
      variant="contained"
      startIcon={<DownloadIcon />}
      onClick={handleExport}
      sx={{
        backgroundColor: color || "#56a94e",
        color: "#fff",
        "&:hover": { backgroundColor: color ? color : "#4a8a44" },
      }}
    >
      Export CSV
    </Button>
  );
}

ExportCSVButton.propTypes = {
  columns:  PropTypes.array.isRequired,
  rows:     PropTypes.array.isRequired,
  filename: PropTypes.string,
  onClick:  PropTypes.func,
  color:    PropTypes.string,
};