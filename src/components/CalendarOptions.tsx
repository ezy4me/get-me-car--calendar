import React, { useState } from "react";
import Select, { StylesConfig } from "react-select";
import { IoOptions, IoSearch } from "react-icons/io5";

interface SortOption {
  value: string;
  label: string;
}

interface CalendarOptionsProps {
  onSortChange: (sortBy: string) => void;
  onFilterChange: (filterBy: string) => void;
  onSearchChange: (searchTerm: string) => void;
}

const CalendarOptions: React.FC<CalendarOptionsProps> = ({
  onSortChange,
  onFilterChange,
  onSearchChange,
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
        <div className="search-bar">
          <IoSearch className="search-icon" />
          <input
            type="text"
            placeholder="Поиск транспорта"
            onChange={handleSearchChange}
          />
        </div>
        <div className="icon-dropdown">
          <IoOptions
            size={24}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="options-icon"
          />
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Select
                styles={customStyles}
                value={selectedClassSort}
                onChange={handleSortChange("class")}
                options={sortOptions.filter((option) => option.value === "class")}
                placeholder="Сортировать по классу"
                isClearable
              />
              <Select
                styles={customStyles}
                value={selectedTypeSort}
                onChange={handleSortChange("type")}
                options={sortOptions.filter((option) => option.value === "type")}
                placeholder="Сортировать по типу"
                isClearable
              />
              <Select
                styles={customStyles}
                value={selectedIdSort}
                onChange={handleSortChange("id")}
                options={sortOptions.filter((option) => option.value === "id")}
                placeholder="Сортировать по идентификатору"
                isClearable
              />
              <Select
                styles={customStyles}
                value={selectedNearestBookingSort}
                onChange={handleSortChange("nearestBooking")}
                options={sortOptions.filter(
                  (option) => option.value === "nearestBooking"
                )}
                placeholder="Сортировать по ближайшему бронированию"
                isClearable
              />

              <Select
                styles={customStyles}
                value={selectedFilter}
                onChange={handleFilterChange}
                options={filterOptions}
                placeholder="Фильтровать по"
                isClearable
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarOptions;
