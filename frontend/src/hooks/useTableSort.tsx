import { useState } from 'react';

type Order = 'asc' | 'desc';

export default function useTableSort<T>(initialRows: T[], initialOrderBy: keyof T) {
  const [rows, setRows] = useState<T[]>(initialRows);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof T>(initialOrderBy);

  function stableSort<T>(
    array: T[],
    comparator: (a: T, b: T) => number,
  ): T[] {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }


  function descendingComparator<Key extends keyof T>(
    a: T,
    b: T,
    orderBy: Key,
  ): number {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator<Key extends keyof T>(
    order: Order,
    orderBy: Key,
  ): (a: T, b: T) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function onRequestSort(property: keyof T) {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    const sortedRows = stableSort(rows, getComparator(order, property));
    setRows(sortedRows);
  };

  return { rows, order, orderBy, onRequestSort };
}
