'use client';

import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterSection {
  title: string;
  options: FilterOption[];
  type: 'checkbox' | 'radio';
  key: string;
}

interface FilterSidebarProps {
  sections: FilterSection[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (sectionKey: string, values: string[]) => void;
  className?: string;
}

export function FilterSidebar({
  sections,
  selectedFilters,
  onFilterChange,
  className = ''
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map(s => s.key))
  );

  const toggleSection = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey);
    } else {
      newExpanded.add(sectionKey);
    }
    setExpandedSections(newExpanded);
  };

  const handleOptionChange = (sectionKey: string, optionValue: string, sectionType: 'checkbox' | 'radio') => {
    const currentValues = selectedFilters[sectionKey] || [];

    if (sectionType === 'radio') {
      // Radio: only one selection allowed
      onFilterChange(sectionKey, [optionValue]);
    } else {
      // Checkbox: multiple selections allowed
      if (currentValues.includes(optionValue)) {
        onFilterChange(sectionKey, currentValues.filter(v => v !== optionValue));
      } else {
        onFilterChange(sectionKey, [...currentValues, optionValue]);
      }
    }
  };

  const clearAllFilters = () => {
    sections.forEach(section => {
      onFilterChange(section.key, []);
    });
  };

  const hasActiveFilters = Object.values(selectedFilters).some(values => values.length > 0);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.key);
          const sectionValues = selectedFilters[section.key] || [];

          return (
            <div key={section.key}>
              <button
                onClick={() => toggleSection(section.key)}
                className="flex items-center justify-between w-full text-left mb-3"
              >
                <h4 className="font-medium text-gray-900">{section.title}</h4>
                {isExpanded ? (
                  <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {isExpanded && (
                <div className="space-y-2">
                  {section.options.map((option) => {
                    const isSelected = sectionValues.includes(option.value);

                    return (
                      <label
                        key={option.value}
                        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md -m-2"
                      >
                        <input
                          type={section.type}
                          name={section.key}
                          value={option.value}
                          checked={isSelected}
                          onChange={() => handleOptionChange(section.key, option.value, section.type)}
                          className={`
                            h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300
                            ${section.type === 'radio' ? 'rounded-full' : 'rounded'}
                          `}
                        />
                        <span className="flex-1 text-sm text-gray-700">
                          {option.label}
                        </span>
                        {option.count !== undefined && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {option.count}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
