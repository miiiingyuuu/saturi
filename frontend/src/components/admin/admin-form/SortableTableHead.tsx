import React from 'react';
import { TableCell, TableRow, TableSortLabel } from '@mui/material';

interface SortableTableHeadProps<T> {
  order: 'asc' | 'desc';
  orderBy: keyof T;
  onRequestSort: (property: keyof T) => void;
  headCells: { id: keyof T; label: string }[];
}

export default function SortableTableHead<T>({
                                       order,
                                       orderBy,
                                       onRequestSort,
                                       headCells
                                     }: SortableTableHeadProps<T>) {
  const createSortHandler = (property: keyof T) => () => {
    onRequestSort(property);
  };

  return (
    <TableRow>
      {headCells.map((headCell) => (
        <TableCell key={headCell.id as string}>
          <TableSortLabel
            active={orderBy === headCell.id}
            direction={orderBy === headCell.id ? order : 'asc'}
            onClick={createSortHandler(headCell.id)}
          >
            {headCell.label}
          </TableSortLabel>
        </TableCell>
      ))}
    </TableRow>
  );
}
