'use client';

import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

interface TagsAutocompleteProps {
  value: string[];
  onChange: (tags: string[]) => void;
  availableTags: string[];
  placeholder?: string;
  className?: string;
}

export function TagsAutocomplete({
  value,
  onChange,
  availableTags,
  placeholder = "Add a tag",
  className = ''
}: TagsAutocompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter available tags based on input and exclude already selected tags
  const filteredTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(inputValue.toLowerCase()) &&
    !value.includes(tag)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(newValue.length > 0);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredTags.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredTags.length) {
          addTag(filteredTags[selectedIndex]);
        } else if (inputValue.trim()) {
          addTag(inputValue.trim());
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const addTag = (tag: string) => {
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInputValue('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleSuggestionClick = (tag: string) => {
    addTag(tag);
  };

  const handleAddButtonClick = () => {
    if (inputValue.trim()) {
      addTag(inputValue.trim());
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  return (
    <div className={`relative ${className}`}>
      {/* Selected Tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-primary-600 hover:text-primary-800"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input and Add Button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredTags.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {filteredTags.map((tag, index) => (
                <div
                  key={tag}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${index === selectedIndex ? 'bg-primary-100 text-primary-800' : ''
                    }`}
                  onClick={() => handleSuggestionClick(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddButtonClick}
          disabled={!inputValue.trim()}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add
        </button>
      </div>

      {/* Help Text */}
      <p className="mt-2 text-sm text-gray-500">
        Type to search existing tags or add new ones. Use arrow keys to navigate suggestions.
      </p>
    </div>
  );
}
