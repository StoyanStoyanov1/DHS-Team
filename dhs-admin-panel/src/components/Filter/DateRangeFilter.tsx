'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, ArrowRight, ArrowLeft, ArrowLeftRight, ChevronDown } from 'lucide-react';

interface DateRangeFilterProps {
  value: { start?: Date | null; end?: Date | null } | null;
  onChange: (value: { start?: Date | null; end?: Date | null } | null) => void;
  className?: string;
  placeholder?: string;
  defaultOpen?: boolean; 
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
  
  const [showMonthDropdown, setShowMonthDropdown] = useState<boolean>(false);
  const [showYearDropdown, setShowYearDropdown] = useState<boolean>(false);
  
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [selectingStartDate, setSelectingStartDate] = useState<boolean>(true);
  
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
  
  // Month names for dropdown
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Generate available years (10 years before and after current)
  const getAvailableYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };
  
  // Month and year selection functions
  const handleMonthChange = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
    setShowMonthDropdown(false);
  };
  
  const handleYearChange = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setShowYearDropdown(false);
  };
  
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
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isMonthDropdown = target.closest('.month-dropdown');
      const isYearDropdown = target.closest('.year-dropdown');
      
      if (!isMonthDropdown) {
        setShowMonthDropdown(false);
      }
      
      if (!isYearDropdown) {
        setShowYearDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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
  
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getMonthDays = (year: number, month: number) => {
    const days = [];
    const daysInMonth = getDaysInMonth(year, month);
    
    const firstDay = new Date(year, month, 1).getDay();
    const firstDayAdjusted = firstDay === 0 ? 6 : firstDay - 1;
    
    for (let i = 0; i < firstDayAdjusted; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  const isSingleDateSelected = (date: Date | null) => {
    if (!date || !draftState.singleDate) return false;
    
    return date.getDate() === draftState.singleDate.getDate() &&
           date.getMonth() === draftState.singleDate.getMonth() &&
           date.getFullYear() === draftState.singleDate.getFullYear();
  };
  
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
  
  const isDateInRange = (date: Date | null) => {
    if (!date || !draftState.start || !draftState.end) return false;
    return date > draftState.start && date < draftState.end;
  };
  
  const isToday = (date: Date | null) => {
    if (!date) return false;
    
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
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
      setDraftState({
        ...draftState,
        singleDate: date
      });
    }
  };
  
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
    
    if (draftState.mode === 'range') {
      setRangeStart(draftState.start);
      setRangeEnd(draftState.end);
    } else {
      setSelectedDate(draftState.singleDate);
    }
    setFilterMode(draftState.mode);
  };
  
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
        <span className="flex items-center gap-1.5 text-gray-500">
          <Calendar size={16} className="text-gray-400" />
          <span>{placeholder}</span>
        </span>
      );
    }
    
    // After date filter
    if (value.start && !value.end) {
      return (
        <div className="flex items-center">
          <span className="text-blue-600 flex items-center font-medium">
            <ArrowRight size={16} className="mr-1.5 text-blue-500" />
            After {formatDate(value.start)}
          </span>
        </div>
      );
    }
    
    // Before date filter
    if (!value.start && value.end) {
      return (
        <div className="flex items-center">
          <span className="text-blue-600 flex items-center font-medium">
            <ArrowLeft size={16} className="mr-1.5 text-blue-500" />
            Before {formatDate(value.end)}
          </span>
        </div>
      );
    }
    
    // Date range
    return (
      <div className="flex items-center">
        <span className="text-blue-600 flex items-center font-medium">
          <ArrowLeftRight size={16} className="mr-1.5 text-blue-500" />
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
      <div 
        className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm cursor-pointer transition-all duration-200 shadow-sm
          ${showCalendar ? 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-300 dark:ring-blue-500/30' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow'}
          ${value?.start || value?.end ? 'border-blue-200 dark:border-blue-700 bg-blue-50/40 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'}`}
        onClick={() => setShowCalendar(!showCalendar)}
      >
        {displayValue()}
        
        <div className="flex items-center gap-1">
          {(value?.start || value?.end) && (
            <button 
              className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              onClick={(e) => { e.stopPropagation(); clearFilter(); }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      
      {showCalendar && (
        <div className="absolute z-10 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 right-0 w-80 daterange-animation">
          {/* Filter mode selector */}
          <div className="mb-4 flex justify-center border-b border-gray-100 dark:border-gray-700 pb-3">
            <div className="inline-flex rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 p-1.5" role="group">
              <button
                type="button"
                onClick={() => switchFilterMode('range')}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-l-lg flex items-center transition-all
                  ${draftState.mode === 'range' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              >
                <ArrowLeftRight size={15} className="mr-1.5" />
                Range
              </button>
              <button
                type="button"
                onClick={() => switchFilterMode('before')}
                className={`px-3.5 py-1.5 text-sm font-medium flex items-center transition-all
                  ${draftState.mode === 'before' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              >
                <ArrowLeft size={15} className="mr-1.5" />
                Before
              </button>
              <button
                type="button"
                onClick={() => switchFilterMode('after')}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-r-lg flex items-center transition-all
                  ${draftState.mode === 'after' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              >
                <ArrowRight size={15} className="mr-1.5" />
                After
              </button>
            </div>
          </div>
          
          {/* Calendar header with month/year selectors */}
          <div className="mb-3 flex items-center justify-between">
            <button 
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              onClick={(e) => { e.stopPropagation(); goToPrevMonth(); }}
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center space-x-2">
              {/* Month selector dropdown */}
              <div className="relative month-dropdown">
                <button
                  className="flex items-center justify-between px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-medium min-w-[120px] transition-colors dark:text-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMonthDropdown(!showMonthDropdown);
                    setShowYearDropdown(false);
                  }}
                >
                  <span>{monthNames[currentMonth.getMonth()]}</span>
                  <ChevronDown size={14} className="ml-1 text-gray-500 dark:text-gray-400" />
                </button>
                
                {showMonthDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-52 overflow-y-auto w-full">
                    {monthNames.map((month, index) => (
                      <div
                        key={month}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors
                          ${index === currentMonth.getMonth() ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' : 'dark:text-gray-300'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMonthChange(index);
                        }}
                      >
                        {month}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Year selector dropdown */}
              <div className="relative year-dropdown">
                <button
                  className="flex items-center justify-between px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-medium min-w-[80px] transition-colors dark:text-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowYearDropdown(!showYearDropdown);
                    setShowMonthDropdown(false);
                  }}
                >
                  <span>{currentMonth.getFullYear()}</span>
                  <ChevronDown size={14} className="ml-1 text-gray-500 dark:text-gray-400" />
                </button>
                
                {showYearDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-52 overflow-y-auto w-full">
                    {getAvailableYears().map((year) => (
                      <div
                        key={year}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors
                          ${year === currentMonth.getFullYear() ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' : 'dark:text-gray-300'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleYearChange(year);
                        }}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <button 
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              onClick={(e) => { e.stopPropagation(); goToNextMonth(); }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {/* Weekday headers */}
            {weekDays.map((day, i) => (
              <div key={i} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1.5">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {getMonthDays(currentMonth.getFullYear(), currentMonth.getMonth()).map((day, i) => (
              <button
                key={i}
                className={`
                  rounded-full w-8 h-8 flex items-center justify-center text-sm transition-all duration-150
                  ${!day ? 'invisible' : 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:text-gray-300'}
                  ${isToday(day) && !isRangeDateSelected(day) && !isDateInRange(day) && !isSingleDateSelected(day) 
                    ? 'border border-blue-300 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-medium' : ''}
                  ${draftState.mode === 'range'
                    ? isRangeDateSelected(day) 
                      ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 font-medium' 
                      : isDateInRange(day)
                        ? 'bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                        : ''
                    : isSingleDateSelected(day) 
                      ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 font-medium'
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
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            {draftState.mode === 'range' ? (
              <div className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-3 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                {!draftState.start && !draftState.end 
                  ? 'Select start date'
                  : !draftState.end 
                    ? `Start: ${formatDate(draftState.start)}. Now select end date` 
                    : `Range: ${formatDate(draftState.start)} — ${formatDate(draftState.end)}`}
              </div>
            ) : (
              <div className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-3 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                {draftState.singleDate 
                  ? `${draftState.mode === 'before' ? 'Before' : 'After'} date: ${formatDate(draftState.singleDate)}`
                  : 'Select a date'}
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex justify-between">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
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
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  canApplyFilter()
                    ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
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
      <style jsx>{`
        .calendar-only .absolute {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          top: 0;
          right: 0;
          z-index: 1000;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }
        .calendar-only .absolute > div:first-child {
          display: none;
        }
        .calendar-only > div:first-child {
          display: none !important;
        }
        .calendar-only h3,
        .calendar-only .border-b,
        .calendar-only .flex.items-center.justify-between.rounded-lg {
          display: none !important;
        }
        .calendar-only-wrapper .flex.items-center.justify-between {
          display: none !important;
        }
        .last-login-field {
          display: none !important;
        }

        .daterange-animation {
          animation: fadeIn 0.2s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
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