
import { useEffect, useRef } from 'react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: Array<{
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder?: string;
    className?: string;
  }>;
  loading?: boolean;
}

export function AdminSearchAndFilter({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  loading = false
}: SearchAndFilterProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keep focus on search input after loading completes
  useEffect(() => {
    if (!loading && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [loading]);

  return (
    <div className="card p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <input
            ref={searchInputRef}
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input w-full"
            autoComplete="off"
          />
        </div>

        {/* Filter Selects */}
        {filters.map((filter, index) => (
          <div key={index} className={`sm:w-48 ${filter.className || ''}`}>
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="input w-full"
            >
              <option value="all">{filter.placeholder || "All"}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
