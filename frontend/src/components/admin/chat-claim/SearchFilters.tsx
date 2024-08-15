import React from 'react';
import { Box, TextField, Button } from '@mui/material';

interface SearchFiltersProps {
  filters: {
    gameLogId: string;
    userId: string;
    roomId: string;
  };
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFilterChange, onSearch }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems:"center", justifyContent:"right"}}>
      <TextField
        name="gameLogId"
        label="Game Log ID"
        value={filters.gameLogId}
        onChange={onFilterChange}
      />
      <TextField
        name="userId"
        label="User ID"
        value={filters.userId}
        onChange={onFilterChange}
      />
      <TextField
        name="roomId"
        label="Room ID"
        value={filters.roomId}
        onChange={onFilterChange}
      />
      <Button variant="contained" onClick={onSearch}>검색</Button>
    </Box>
  );
};

export default SearchFilters;