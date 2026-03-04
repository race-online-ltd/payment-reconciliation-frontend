
import * as React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  Checkbox,
  IconButton,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExportCSVButton from "./ExportCSVButton";
import FilterButton from "./FilterButton";

// --- Sorting Helpers ---
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// --- Table Head ---
function BaseTableHead({
  columns,
  order,
  orderBy,
  numSelected,
  rowCount,
  onSelectAllClick,
  onRequestSort,
  hasAction,
  selectable,
}) {
  const createSortHandler = (property) => (event) => onRequestSort(event, property);

  const secondaryHeaderColumns = columns.flatMap((col) => col.children || []);
  const hasSecondaryHeader = secondaryHeaderColumns.length > 0;

  return (
    <TableHead sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#f8fafc" }}>
      <TableRow>
        {selectable && (
          <TableCell
            padding="checkbox"
            rowSpan={hasSecondaryHeader ? 2 : 1}
            sx={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", textAlign: "center" }}
          >
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
        )}
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align="center"
            colSpan={column.colSpan || 1}
            rowSpan={column.children ? 1 : hasSecondaryHeader ? 2 : 1}
            sortDirection={orderBy === column.id ? order : false}
            sx={{
              backgroundColor: "#f8fafc",
              fontWeight: 700,
              color: "#475569",
              fontSize: "0.875rem",
              border: "1px solid #e2e8f0",
            }}
          >
            {column.sortable ? (
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : "asc"}
                onClick={createSortHandler(column.id)}
                sx={{ justifyContent: "center", width: "100%", "& .MuiTableSortLabel-icon": { ml: 0.5 } }}
              >
                {column.label}
                {orderBy === column.id && (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </Box>
                )}
              </TableSortLabel>
            ) : (
              column.label
            )}
          </TableCell>
        ))}
        {hasAction && (
          <TableCell
            align="center"
            rowSpan={hasSecondaryHeader ? 2 : 1}
            sx={{ backgroundColor: "#f8fafc", fontWeight: 700, color: "#475569", border: "1px solid #e2e8f0" }}
          >
            Actions
          </TableCell>
        )}
      </TableRow>

      {hasSecondaryHeader && (
        <TableRow>
          {secondaryHeaderColumns.map((child) => (
            <TableCell
              key={child.id}
              align="center"
              sx={{
                backgroundColor: "#f8fafc",
                fontWeight: 700,
                color: "#475569",
                fontSize: "0.75rem",
                border: "1px solid #e2e8f0",
              }}
            >
              {child.label}
            </TableCell>
          ))}
        </TableRow>
      )}
    </TableHead>
  );
}

// --- BaseTable Component ---
export default function BaseTable({
  columns,
  rows,
  title,
  selectable = true,
  hasAction = true,
  showExport = true,
  onEditRow,
  onDeleteRow,
  onFilter,
  onExport,
  filterContent = null,
}) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState(columns[0]?.id || "");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // ✅ Always dense
  const dense = true;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(rows.map((r) => r.id));
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    if (!selectable) return;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
    else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1));
    else if (selectedIndex === selected.length - 1) newSelected = newSelected.concat(selected.slice(0, -1));
    else if (selectedIndex > 0)
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    setSelected(newSelected);
  };

  const flatColumns = React.useMemo(() => {
    return columns.flatMap((col) => (col.children ? col.children : col));
  }, [columns]);

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  );

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
          border: "1px solid #e2e8f0",
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2.5, backgroundColor: "#fff" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
            {title}
          </Typography>
          <Stack direction="row" spacing={1.5}>
            {showExport && <ExportCSVButton columns={flatColumns} rows={rows} filename={`${title}.csv`} onClick={onExport} />}
            <FilterButton onClick={onFilter}>{filterContent}</FilterButton>
          </Stack>
        </Stack>

        <Divider />

        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader sx={{ minWidth: 750 }} size="small">
            <BaseTableHead
              columns={columns}
              order={order}
              orderBy={orderBy}
              numSelected={selected.length}
              rowCount={rows.length}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              hasAction={hasAction}
              selectable={selectable}
            />
            <TableBody>
              {visibleRows.map((row) => {
                const isItemSelected = selected.includes(row.id);
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    {selectable && (
                      <TableCell padding="checkbox" sx={{ border: "1px solid #f1f5f9", textAlign: "center" }}>
                        <Checkbox color="primary" checked={isItemSelected} />
                      </TableCell>
                    )}
                    {flatColumns.map((column) => (
                      <TableCell key={column.id} align="center" sx={{ color: "#64748b", fontSize: "0.875rem", border: "1px solid #f1f5f9" }}>
                        {row[column.id]}
                      </TableCell>
                    ))}
                    {hasAction && (
                      <TableCell align="center" sx={{ border: "1px solid #f1f5f9" }}>
                        {row.actions ? row.actions : (
                          <Stack direction="row" spacing={0.5} justifyContent="center">
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEditRow?.(row); }}>
                              <EditIcon sx={{ color: "#94a3b8", fontSize: "1.2rem" }} />
                            </IconButton>
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDeleteRow?.(row); }}>
                              <DeleteIcon sx={{ color: "#ef4444", fontSize: "1.2rem" }} />
                            </IconButton>
                          </Stack>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Paper>
    </Box>
  );
}