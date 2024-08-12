// useTableSort.tsx
import { useState, useMemo } from "react";

export default function useTableSort<T>(data: any[], initialOrderBy: string) {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string|number>(initialOrderBy);

  const sortedData: T[] = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...data].sort((a, b) => {
      if (order === "asc") {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      } else {
        return a[orderBy] < b[orderBy] ? 1 : -1;
      }
    });
  }, [data, order, orderBy]);

  const onRequestSort = (property: string|number) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return { rows: sortedData, order, orderBy, onRequestSort };
}
