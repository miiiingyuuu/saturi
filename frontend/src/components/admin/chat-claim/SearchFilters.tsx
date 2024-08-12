import React from 'react';
import { Box, TextField, Button } from '@mui/material';

interface SearchFiltersProps {
  filters: {
    gameLogId: string;
    email: string;
    roomId: string;
    quizId: string;
  };
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFilterChange, onSearch }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <TextField
        name="gameLogId"
        label="Game Log ID"
        value={filters.gameLogId}
        onChange={onFilterChange}
      />
      <TextField
        name="userId"
        label="User ID"
        value={filters.email}
        onChange={onFilterChange}
      />
      <TextField
        name="roomId"
        label="Room ID"
        value={filters.roomId}
        onChange={onFilterChange}
      />
      <TextField
        name="quizId"
        label="Quiz ID"
        value={filters.quizId}
        onChange={onFilterChange}
      />
      <Button variant="contained" onClick={onSearch}>검색</Button>
    </Box>
  );
};

export default SearchFilters;