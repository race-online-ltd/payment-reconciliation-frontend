// src/features/reports/components/FilterMenu.jsx
import React from "react";
import { Menu, Stack, Button } from "@mui/material";
import { Formik, Form } from "formik";
import SelectDropdownSingle from "../../../components/shared/SelectDropdownSingle";

const FilterMenu = ({ anchorEl, open, onClose, initialFilters, onApply }) => {
  return (
    <Formik initialValues={initialFilters} enableReinitialize onSubmit={onApply}>
      {({ values, handleSubmit, resetForm }) => (
        <Form>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
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
                  { id: "Nagad Paybill", label: "Nagad Paybill" },
                ]}
                value={values.channelFilter}
              />
              <SelectDropdownSingle
                name="statusFilter"
                placeholder="Select Status"
                fetchOptions={async () => [
                  { id: "All Status", label: "All Status" },
                  { id: "matched", label: "Matched" },
                  { id: "mismatch", label: "Mismatch" },
                ]}
                value={values.statusFilter}
              />
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" size="small" fullWidth onClick={() => { resetForm(); onApply(initialFilters); }}>
                  Reset
                </Button>
                <Button variant="contained" size="small" fullWidth onClick={handleSubmit}>
                  Apply
                </Button>
              </Stack>
            </Stack>
          </Menu>
        </Form>
      )}
    </Formik>
  );
};

export default FilterMenu;