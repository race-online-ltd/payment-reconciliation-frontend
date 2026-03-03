// src/components/shared/upload/CompareSection.jsx
import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';

export default function CompareSection({ disabled, onCompare }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: 4,
        px: { xs: 2, sm: 0 }, // responsive horizontal padding on mobile
      }}
    > 
      <Button
        variant="contained"
        disabled={disabled}
        onClick={onCompare}
        sx={{
          px: { xs: 4, sm: 10 }, // responsive horizontal padding
          py: { xs: 1.5, sm: 2 }, // responsive vertical padding
          borderRadius: 2,
          width: { xs: '100%', sm: 'auto' }, // full width on mobile, auto on larger screens
          maxWidth: 400, // optional max width
          textTransform: 'none',
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
        >
          <SyncIcon fontSize="small" />
          Compare Transactions
        </Stack>
      </Button>
    </Box>
  );
}