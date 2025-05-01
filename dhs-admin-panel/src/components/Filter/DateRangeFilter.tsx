'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, ArrowRight, ArrowLeft, ArrowLeftRight } from 'lucide-react';

interface DateRangeFilterProps {
  value: { start?: Date | null; end?: Date | null } | null;
  onChange: (value: { start?: Date | null; end?: Date | null } | null) => void;
  className?: string;
  placeholder?: string;
  defaultOpen?: boolean; // New prop to control if calendar is open by default
}

type FilterMode = 'range' | 'before' | 'after';

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'Select date...',
  defaultOpen = false
}) => {
  const [showCalendar, setShowCalendar] = useState<boolean>(defaultOpen);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>('range');
  
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [selectingStartDate, setSelectingStartDate] = useState<boolean>(true);
  
  // Draft state for working values before applying the filter
  const [draftState, setDraftState] = useState<{
    mode: FilterMode,
    singleDate: Date | null,
    start: Date | null,
    end: Date | null
  }>({
    mode: 'range',
    singleDate: null,
    start: null,
    end: null
  });
  
  // Initialize from props
  useEffect(() => {
    if (value) {
      if (value.start && !value.end) {
        setFilterMode('after');
        setSelectedDate(value.start);
        setDraftState({
          mode: 'after',
          singleDate: value.start,
          start: null,
          end: null
        });
      } else if (value.end && !value.start) {
        setFilterMode('before');
        setSelectedDate(value.end);
        setDraftState({
          mode: 'before',
          singleDate: value.end,
          start: null,
          end: null
        });
      } else if (value.start && value.end) {
        setFilterMode('range');
        setRangeStart(value.start);
        setRangeEnd(value.end);
        setDraftState({
          mode: 'range',
          singleDate: null,
          start: value.start,
          end: value.end
        });
      } else {
        resetAllSelections();
      }
    } else {
      resetAllSelections();
    }
  }, [value]);
  
  const resetAllSelections = () => {
    setSelectedDate(null);
    setRangeStart(null);
    setRangeEnd(null);
    setSelectingStartDate(true);
    setDraftState({
      mode: 'range',
      singleDate: null,
      start: null,
      end: null
    });
  };
  
  // Format date for display
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  // Generate dates for calendar
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getMonthDays = (year: number, month: number) => {
    const days = [];
    const daysInMonth = getDaysInMonth(year, month);
    
    // Get first day of month
    const firstDay = new Date(year, month, 1).getDay();
    // Adjust because in JS Sunday is 0, but we want Monday to be 0
    const firstDayAdjusted = firstDay === 0 ? 6 : firstDay - 1;
    
    // Add empty cells for days before month start
    for (let i = 0; i < firstDayAdjusted; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  // Check if a date is selected for single date mode
  const isSingleDateSelected = (date: Date | null) => {
    if (!date || !draftState.singleDate) return false;
    
    return date.getDate() === draftState.singleDate.getDate() &&
           date.getMonth() === draftState.singleDate.getMonth() &&
           date.getFullYear() === draftState.singleDate.getFullYear();
  };
  
  // Check if a date is selected as start or end in range mode
  const isRangeDateSelected = (date: Date | null) => {
    if (!date) return false;
    
    const isStart = draftState.start && 
      date.getDate() === draftState.start.getDate() &&
      date.getMonth() === draftState.start.getMonth() &&
      date.getFullYear() === draftState.start.getFullYear();
      
    const isEnd = draftState.end && 
      date.getDate() === draftState.end.getDate() &&
      date.getMonth() === draftState.end.getMonth() &&
      date.getFullYear() === draftState.end.getFullYear();
    
    return isStart || isEnd;
  };
  
  // Check if a date is in range between start and end
  const isDateInRange = (date: Date | null) => {
    if (!date || !draftState.start || !draftState.end) return false;
    return date > draftState.start && date < draftState.end;
  };
  
  // Navigate to previous month
  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Handle date click based on selected mode
  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    
    if (draftState.mode === 'range') {
      if (selectingStartDate) {
        setDraftState({
          ...draftState,
          start: date,
          end: null
        });
        setSelectingStartDate(false);
      } else {
        // Ensure end date isn't before start date
        if (draftState.start && date < draftState.start) {
          setDraftState({
            ...draftState,
            start: date,
            end: draftState.start
          });
        } else {
          setDraftState({
            ...draftState,
            end: date
          });
        }
      }
    } else {
      // For before/after modes
      setDraftState({
        ...draftState,
        singleDate: date
      });
    }
  };
  
  // Apply the filter based on the selected mode
  const applyFilter = () => {
    let filterValue: { start?: Date | null; end?: Date | null } | null = null;
    
    if (draftState.mode === 'before' && draftState.singleDate) {
      filterValue = { start: null, end: draftState.singleDate };
    } 
    else if (draftState.mode === 'after' && draftState.singleDate) {
      filterValue = { start: draftState.singleDate, end: null };
    }
    else if (draftState.mode === 'range' && draftState.start && draftState.end) {
      filterValue = { start: draftState.start, end: draftState.end };
    }
    
    onChange(filterValue);
    setShowCalendar(false);
    
    // Synchronize component's state with the applied filter
    if (draftState.mode === 'range') {
      setRangeStart(draftState.start);
      setRangeEnd(draftState.end);
    } else {
      setSelectedDate(draftState.singleDate);
    }
    setFilterMode(draftState.mode);
  };
  
  // Clear the filter
  const clearFilter = () => {
    resetAllSelections();
    onChange(null);
    setShowCalendar(false);
  };
  
  // Switch filter mode
  const switchFilterMode = (mode: FilterMode) => {
    setDraftState({
      ...draftState,
      mode: mode,
      singleDate: null,
      start: null,
      end: null
    });
    setSelectingStartDate(true);
  };
  
  // Weekday labels
  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  
  // Display the current filter value
  const displayValue = () => {
    if (!value || (!value.start && !value.end)) {
      return (
        <span className="flex items-center gap-1.5 text-gray-400">
          <Calendar size={14} />
          <span>All time</span>
        </span>
      );
    }
    
    // After date filter
    if (value.start && !value.end) {
      return (
        <div className="flex items-center">
          <span className="text-indigo-700 flex items-center">
            <ArrowRight size={14} className="mr-1.5 text-indigo-500" />
            After {formatDate(value.start)}
          </span>
        </div>
      );
    }
    
    // Before date filter
    if (!value.start && value.end) {
      return (
        <div className="flex items-center">
          <span className="text-indigo-700 flex items-center">
            <ArrowLeft size={14} className="mr-1.5 text-indigo-500" />
            Before {formatDate(value.end)}
          </span>
        </div>
      );
    }
    
    // Date range
    return (
      <div className="flex items-center">
        <span className="text-indigo-700 flex items-center">
          <ArrowLeftRight size={14} className="mr-1.5 text-indigo-500" />
          {formatDate(value.start)} — {formatDate(value.end)}
        </span>
      </div>
    );
  };
  
  // Helper to check if filter can be applied
  const canApplyFilter = () => {
    if (draftState.mode === 'before' || draftState.mode === 'after') {
      return !!draftState.singleDate;
    }
    return !!draftState.start && !!draftState.end;
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Main button - may be hidden if calendar should always show */}
      <div 
        className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm cursor-pointer transition-all duration-200
          ${showCalendar ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-300 hover:border-gray-400'}
          ${value?.start || value?.end ? 'border-indigo-200 bg-indigo-50/30' : ''}`}
        onClick={() => setShowCalendar(!showCalendar)}
      >
        {displayValue()}
        
        <div className="flex items-center gap-1">
          {(value?.start || value?.end) && (
            <button 
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              onClick={(e) => { e.stopPropagation(); clearFilter(); }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      
      {/* Calendar - shown either conditionally (showCalendar) or always */}
      {showCalendar && (
        <div className="absolute z-10 mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-3 min-w-[320px] right-0">
          {/* Filter mode selector */}
          <div className="mb-3 flex justify-center border-b border-gray-100 pb-3">
            <div className="inline-flex rounded-md shadow-sm bg-gray-100 p-1" role="group">
              <button
                type="button"
                onClick={() => switchFilterMode('range')}
                className={`px-3 py-1.5 text-sm font-medium rounded-l-md flex items-center
                  ${draftState.mode === 'range' 
                    ? 'bg-white text-indigo-700 shadow' 
                    : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <ArrowLeftRight size={14} className="mr-1.5" />
                Range
              </button>
              <button
                type="button"
                onClick={() => switchFilterMode('before')}
                className={`px-3 py-1.5 text-sm font-medium flex items-center
                  ${draftState.mode === 'before' 
                    ? 'bg-white text-indigo-700 shadow' 
                    : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <ArrowLeft size={14} className="mr-1.5" />
                Before
              </button>
              <button
                type="button"
                onClick={() => switchFilterMode('after')}
                className={`px-3 py-1.5 text-sm font-medium rounded-r-md flex items-center
                  ${draftState.mode === 'after' 
                    ? 'bg-white text-indigo-700 shadow' 
                    : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <ArrowRight size={14} className="mr-1.5" />
                After
              </button>
            </div>
          </div>
          
          {/* Calendar header */}
          <div className="mb-3 flex items-center justify-between">
            <button 
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              onClick={(e) => { e.stopPropagation(); goToPrevMonth(); }}
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="font-medium">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            
            <button 
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              onClick={(e) => { e.stopPropagation(); goToNextMonth(); }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {/* Weekday headers */}
            {weekDays.map((day, i) => (
              <div key={i} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {getMonthDays(currentMonth.getFullYear(), currentMonth.getMonth()).map((day, i) => (
              <button
                key={i}
                className={`
                  rounded-full w-7 h-7 flex items-center justify-center text-sm transition-all duration-150
                  ${!day ? 'invisible' : 'cursor-pointer hover:bg-indigo-50'}
                  ${draftState.mode === 'range'
                    ? isRangeDateSelected(day) 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : isDateInRange(day)
                        ? 'bg-indigo-100 hover:bg-indigo-200'
                        : ''
                    : isSingleDateSelected(day) 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : ''
                  }
                `}
                onClick={(e) => { e.stopPropagation(); handleDateClick(day); }}
                disabled={!day}
              >
                {day?.getDate()}
              </button>
            ))}
          </div>
          
          {/* Selection status */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            {draftState.mode === 'range' ? (
              <div className="text-xs font-medium text-gray-600 mb-2">
                {!draftState.start && !draftState.end 
                  ? 'Select start date'
                  : !draftState.end 
                    ? `Start: ${formatDate(draftState.start)}. Now select end date` 
                    : `Range: ${formatDate(draftState.start)} — ${formatDate(draftState.end)}`}
              </div>
            ) : (
              <div className="text-xs font-medium text-gray-600 mb-2">
                {draftState.singleDate 
                  ? `${draftState.mode === 'before' ? 'Before' : 'After'} date: ${formatDate(draftState.singleDate)}`
                  : 'Select a date'}
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex justify-between">
              <button
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                onClick={(e) => { 
                  e.stopPropagation();
                  setShowCalendar(false);
                  // Revert draft state to current applied filter
                  if (value) {
                    if (value.start && !value.end) {
                      setDraftState({
                        mode: 'after',
                        singleDate: value.start,
                        start: null,
                        end: null
                      });
                    } else if (value.end && !value.start) {
                      setDraftState({
                        mode: 'before',
                        singleDate: value.end,
                        start: null,
                        end: null
                      });
                    } else if (value.start && value.end) {
                      setDraftState({
                        mode: 'range',
                        singleDate: null,
                        start: value.start,
                        end: value.end
                      });
                    }
                  } else {
                    resetAllSelections();
                  }
                }}
              >
                Cancel
              </button>
              
              <button
                disabled={!canApplyFilter()}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  canApplyFilter()
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                onClick={(e) => { e.stopPropagation(); applyFilter(); }}
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// DirectCalendarFilter component that shows only the calendar
export const DirectCalendarFilter: React.FC<DateRangeFilterProps> = (props) => {
  return (
    <div className="calendar-filter-container">
      <style jsx global>{`
        .calendar-only .absolute {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
          position: absolute;
          top: 0;
          right: 0;
          z-index: 1000;
        }
        .calendar-only .absolute > div:first-child {
          display: none; /* Hide the filter mode selector */
        }
        .calendar-only > div:first-child {
          display: none !important; /* Completely hide the main button with LAST LOGIN text */
        }
        /* Hide any header or date display */
        .calendar-only h3,
        .calendar-only .border-b,
        .calendar-only .flex.items-center.justify-between.rounded-md {
          display: none !important;
        }
        /* Hide the Last Login field completely */
        .calendar-only-wrapper .flex.items-center.justify-between {
          display: none !important;
        }
        /* Hide any parent elements that might display the Last Login text */
        .last-login-field {
          display: none !important;
        }
      `}</style>
      <DateRangeFilter 
        {...props} 
        defaultOpen={true}
        className="calendar-only"
      />
    </div>
  );
};

export default DateRangeFilter;