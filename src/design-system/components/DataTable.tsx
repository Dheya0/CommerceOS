import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Checkbox } from './SelectionControls';
import { Skeleton } from './FeedbackStates';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  sortable?: boolean;
  width?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (row: T) => string;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectRow?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  density?: 'comfortable' | 'compact';
  pageSize?: number;
  showPagination?: boolean;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  selectable = false,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  isLoading = false,
  emptyMessage = 'لا توجد بيانات متاحة حالياً',
  emptyAction,
  density = 'comfortable',
  pageSize = 10,
  showPagination = true,
  className = '',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = showPagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const allSelected =
    paginatedData.length > 0 && paginatedData.every(row => selectedIds.includes(keyExtractor(row)));

  const paddingClasses = density === 'compact' ? 'py-2 px-3 text-xs' : 'py-3.5 px-4 text-sm';

  return (
    <div className={`bg-[#101C2C] border border-white/10 rounded-xl overflow-hidden shadow-xs ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-[#0B1626] border-b border-white/10 text-xs font-bold text-[#94A3B8] tracking-wider uppercase">
              {selectable && (
                <th className="w-10 px-4 py-3 text-center">
                  <Checkbox
                    checked={allSelected}
                    onChange={e => onSelectAll?.(e.target.checked)}
                  />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`text-start px-4 py-3 font-semibold ${
                    col.sortable ? 'cursor-pointer select-none hover:text-[#F1F5F9]' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="inline-flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-[#64748B]">
                        {sortKey === col.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-[#D4AF37]" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5 font-sans">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="bg-[#101C2C]">
                  {selectable && (
                    <td className="px-4 py-3">
                      <Skeleton className="w-4 h-4 rounded" />
                    </td>
                  )}
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-4 py-3">
                      <Skeleton className="h-4 w-3/4 rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-12 text-center text-[#64748B]"
                >
                  <p className="text-sm font-medium">{emptyMessage}</p>
                  {emptyAction && <div className="mt-3 flex justify-center">{emptyAction}</div>}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const id = keyExtractor(row);
                const isSelected = selectedIds.includes(id);

                return (
                  <tr
                    key={id}
                    className={`
                      transition-colors duration-100
                      hover:bg-[#142238]
                      ${isSelected ? 'bg-[#142238]/70' : 'bg-[#101C2C]'}
                    `}
                  >
                    {selectable && (
                      <td className="w-10 px-4 py-3 text-center">
                        <Checkbox
                          checked={isSelected}
                          onChange={e => onSelectRow?.(id, e.target.checked)}
                        />
                      </td>
                    )}
                    {columns.map(col => (
                      <td key={col.key} className={`${paddingClasses} text-[#CBD5E1]`}>
                        {col.render ? col.render(row, idx) : (row as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {showPagination && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-white/5 bg-[#0B1626] flex items-center justify-between text-xs text-[#94A3B8]">
          <span>
            صفحة {currentPage} من {totalPages} (إجمالي {sortedData.length})
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-[#CBD5E1] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-[#CBD5E1] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
