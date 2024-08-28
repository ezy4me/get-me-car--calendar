import React, { useState } from "react";
import Select, { StylesConfig } from "react-select";
import { IoOptions, IoSearch, IoCalendar } from "react-icons/io5";
import { DateRangePicker, StaticRange } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ru } from "date-fns/locale";

interface SortOption {
  value: string;
  label: string;
}

interface CalendarOptionsProps {
  onSortChange: (sortBy: string) => void;
  onFilterChange: (filterBy: string) => void;
  onSearchChange: (searchTerm: string) => void;
  onDateRangeChange: (range: { startDate: Date; endDate: Date }) => void;
  defaultDateRange: { startDate: Date; endDate: Date };
}

const customStaticRanges: StaticRange[] = [
  {
    label: "Сегодня",
    range: () => ({
      startDate: new Date(),
      endDate: new Date(),
    }),
    isSelected: (range) =>
      isSameDay(range.startDate, new Date()) &&
      isSameDay(range.endDate, new Date()),
  },
  {
    label: "Вчера",
    range: () => {
      const today = new Date();
      const yesterday = new Date(today.setDate(today.getDate() - 1));
      return {
        startDate: yesterday,
        endDate: yesterday,
      };
    },
    isSelected: (range) => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return (
        isSameDay(range.startDate, yesterday) &&
        isSameDay(range.endDate, yesterday)
      );
    },
  },
  {
    label: "Эта неделя",
    range: () => {
      const today = new Date();
      const firstDay = today.getDate() - today.getDay();
      const lastDay = firstDay + 6;
      const start = new Date(today.setDate(firstDay));
      const end = new Date(today.setDate(lastDay));
      return {
        startDate: start,
        endDate: end,
      };
    },
    isSelected: (range) => {
      const today = new Date();
      const firstDay = today.getDate() - today.getDay();
      const lastDay = firstDay + 6;
      const start = new Date(today.setDate(firstDay));
      const end = new Date(today.setDate(lastDay));
      return isSameDay(range.startDate, start) && isSameDay(range.endDate, end);
    },
  },
  {
    label: "Прошлая неделя",
    range: () => {
      const today = new Date();
      const firstDay = today.getDate() - today.getDay() - 7;
      const lastDay = firstDay + 6;
      const start = new Date(today.setDate(firstDay));
      const end = new Date(today.setDate(lastDay));
      return {
        startDate: start,
        endDate: end,
      };
    },
    isSelected: (range) => {
      const today = new Date();
      const firstDay = today.getDate() - today.getDay() - 7;
      const lastDay = firstDay + 6;
      const start = new Date(today.setDate(firstDay));
      const end = new Date(today.setDate(lastDay));
      return isSameDay(range.startDate, start) && isSameDay(range.endDate, end);
    },
  },
  {
    label: "Этот месяц",
    range: () => {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return {
        startDate: start,
        endDate: end,
      };
    },
    isSelected: (range) => {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return isSameDay(range.startDate, start) && isSameDay(range.endDate, end);
    },
  },
  {
    label: "Прошлый месяц",
    range: () => {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      return {
        startDate: start,
        endDate: end,
      };
    },
    isSelected: (range) => {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      return isSameDay(range.startDate, start) && isSameDay(range.endDate, end);
    },
  },
];

const isSameDay = (date1?: Date, date2?: Date) => {
  if (!date1 || !date2) return false;
  return date1.toDateString() === date2.toDateString();
};

const CalendarOptions: React.FC<CalendarOptionsProps> = ({
  onSortChange,
  onFilterChange,
  onSearchChange,
  onDateRangeChange,
  defaultDateRange,
}) => {
  const [selectedClassSort, setSelectedClassSort] = useState<SortOption | null>(
    null
  );
  const [selectedTypeSort, setSelectedTypeSort] = useState<SortOption | null>(
    null
  );
  const [selectedIdSort, setSelectedIdSort] = useState<SortOption | null>(null);
  const [selectedNearestBookingSort, setSelectedNearestBookingSort] =
    useState<SortOption | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<SortOption | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [dateRange, setDateRange] = useState({
    startDate: startOfMonth,
    endDate: endOfMonth,
    key: "selection",
  });

  const sortOptions: SortOption[] = [
    { value: "class", label: "Класс транспорта" },
    { value: "type", label: "Тип транспорта" },
    { value: "id", label: "Идентификатор транспортного средства" },
    { value: "nearestBooking", label: "Ближайшее бронирование" },
  ];

  const filterOptions: SortOption[] = [
    { value: "all", label: "Все" },
    { value: "available", label: "Свободные" },
    { value: "booked", label: "Занятые" },
  ];

  const handleSortChange =
    (type: string) => (selectedOption: SortOption | null) => {
      switch (type) {
        case "class":
          setSelectedClassSort(selectedOption);
          break;
        case "type":
          setSelectedTypeSort(selectedOption);
          break;
        case "id":
          setSelectedIdSort(selectedOption);
          break;
        case "nearestBooking":
          setSelectedNearestBookingSort(selectedOption);
          break;
      }
      onSortChange(selectedOption?.value || "");
    };

  const handleFilterChange = (selectedOption: SortOption | null) => {
    setSelectedFilter(selectedOption);
    onFilterChange(selectedOption?.value || "");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleDateRangeChange = (ranges: any) => {
    setDateRange(ranges.selection);
    onDateRangeChange(ranges.selection);
  };

  const customStyles: StylesConfig<SortOption, false> = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderRadius: 8,
      borderColor: state.isFocused ? "#429cf3" : "#ddd",
      boxShadow: state.isFocused ? "0 0 0 1px #429cf3" : "none",
      "&:hover": {
        borderColor: "#429cf3",
      },
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      borderRadius: 8,
    }),
    menuList: (baseStyles) => ({
      ...baseStyles,
      padding: 4,
    }),
    option: (baseStyles) => ({
      ...baseStyles,
      borderRadius: 8,
    }),
  };

  return (
    <div className="container">
      <div className="calendar-options">
        <div className="calendar-options-item">
          <div
            className="calendar-icon"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
            <IoCalendar size={24} className="calendar-icon" />
            {isCalendarOpen && (
              <div className="calendar-dropdown">
                <DateRangePicker
                  locale={ru}
                  ranges={[dateRange]}
                  inputRanges={[]}
                  staticRanges={customStaticRanges}
                  onChange={handleDateRangeChange}
                  moveRangeOnFirstSelection={false}
                  className="date-range-picker"
                />
              </div>
            )}

            <div className="dateRange-container">
              <p className="dateRange">
                {dateRange.startDate.toLocaleDateString("ru-RU")}
              </p>
              <p className="dateRange">
                {dateRange.endDate.toLocaleDateString("ru-RU")}
              </p>
            </div>
          </div>

          <div className="icon-dropdown">
            <IoOptions
              size={26}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="options-icon"
            />
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-menu-list">
                  <Select
                    styles={customStyles}
                    value={selectedFilter}
                    onChange={handleFilterChange}
                    options={filterOptions}
                    placeholder="Статус ТС"
                    isClearable
                  />
                  <Select
                    styles={customStyles}
                    value={selectedClassSort}
                    onChange={handleSortChange("class")}
                    options={sortOptions.filter(
                      (option) => option.value === "class"
                    )}
                    placeholder="Класс ТС"
                    isClearable
                  />
                  <Select
                    styles={customStyles}
                    value={selectedTypeSort}
                    onChange={handleSortChange("type")}
                    options={sortOptions.filter(
                      (option) => option.value === "type"
                    )}
                    placeholder="Тип ТС"
                    isClearable
                  />
                  <Select
                    styles={customStyles}
                    value={selectedIdSort}
                    onChange={handleSortChange("id")}
                    options={sortOptions.filter(
                      (option) => option.value === "id"
                    )}
                    placeholder="ID ТС"
                    isClearable
                  />
                  <Select
                    styles={customStyles}
                    value={selectedNearestBookingSort}
                    onChange={handleSortChange("nearestBooking")}
                    options={sortOptions.filter(
                      (option) => option.value === "nearestBooking"
                    )}
                    placeholder="Бронирование"
                    isClearable
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="search-bar">
          <IoSearch className="search-icon" />
          <input
            type="text"
            placeholder="Поиск транспорта"
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarOptions;
