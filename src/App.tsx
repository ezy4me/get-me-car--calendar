import { useState } from "react";
import CalendarOptions from "./components/CalendarOptions";
import TransportCalendar from "./components/TransportCalendar";
// Данные бронирований
const data = [
  {
    id: "12345_rent_54321",
    title: "Бронирование ID: 54321",
    start: "2024-08-01T09:00:00",
    end: "2024-08-07T18:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=54321",
    editable: false,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "rent",
    transportName: "Ford Fiesta",
  },
  {
    id: "12345_rent_54321",
    title: "Бронирование ID: 54321",
    start: "2024-08-07T09:00:00",
    end: "2024-08-16T18:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=54321",
    editable: false,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "rent",
    transportName: "Ford Fiesta",
  },
  {
    id: "12345_rent_54321",
    title: "Бронирование ID: 54321",
    start: "2024-08-18T09:00:00",
    end: "2024-08-24T18:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=54321",
    editable: false,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "rent",
    transportName: "Ford Fiesta",
  },
  {
    id: "12345_rent_54321",
    title: "Бронирование ID: 54321",
    start: "2024-08-24T09:00:00",
    end: "2024-08-28T18:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=54321",
    editable: false,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "rent",
    transportName: "Ford Fiesta",
  },

  {
    id: "12345_rent_54321",
    title: "Бронирование ID: 54321",
    start: "2024-08-30T09:00:00",
    end: "2024-09-02T18:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=54321",
    editable: false,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "rent",
    transportName: "Ford Fiesta",
  },
  {
    id: "12345_rent_54321",
    title: "Бронирование ID: 54321",
    start: "2024-09-02T09:00:00",
    end: "2024-09-06T18:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=54321",
    editable: false,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "rent",
    transportName: "Ford Fiesta",
  },

  {
    id: "12345_rent_54321",
    title: "Бронирование ID: 54321",
    start: "2024-09-10T09:00:00",
    end: "2024-09-12T18:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=54321",
    editable: false,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "rent",
    transportName: "Ford Fiesta",
  },

  {
    id: "12345_rent_54321",
    title: "Бронирование ID: 54321",
    start: "2024-09-16T09:00:00",
    end: "2024-09-19T18:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=54321",
    editable: false,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "rent",
    transportName: "Ford Fiesta",
  },

  {
    id: "98765_rent_67890",
    title: "Бронирование ID: 67890",
    start: "2024-08-15T10:00:00",
    end: "2024-08-21T10:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=67890",
    editable: false,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "rent",
    transportName: "Chevrolet Malibu",
  },
  {
    id: "56789_repair_34567",
    title: "На ремонте ID: 34567",
    start: "2024-08-10T07:00:00",
    end: "2024-08-15T19:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=34567",
    editable: true,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "repair",
    transportName: "Kia Optima",
  },
  {
    id: "67891_rent_45678",
    title: "Бронирование ID: 45678",
    start: "2024-08-16T09:00:00",
    end: "2024-08-22T09:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=45678",
    editable: false,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "rent",
    transportName: "Mercedes-Benz C-Class",
  },
  {
    id: "98766_rent_65432",
    title: "Бронирование ID: 65432",
    start: "2024-08-23T12:00:00",
    end: "2024-08-30T12:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=65432",
    editable: false,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "reserved",
    transportName: "Hyundai Sonata",
  },
  {
    id: "12346_repair_87654",
    title: "На ремонте ID: 87654",
    start: "2024-08-05T09:00:00",
    end: "2024-08-10T18:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=87654",
    editable: true,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "repair",
    transportName: "Mazda 6",
  },
  {
    id: "23456_rent_76543",
    title: "Бронирование ID: 76543",
    start: "2024-08-02T08:00:00",
    end: "2024-08-09T08:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=76543",
    editable: true,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "reserved",
    transportName: "Volkswagen Passat",
  },
  {
    id: "34567_repair_54322",
    title: "На ремонте ID: 54322",
    start: "2024-08-12T07:00:00",
    end: "2024-08-18T19:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=54322",
    editable: false,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "repair",
    transportName: "BMW 3 Series",
  },
  {
    id: "45678_rent_67891",
    title: "Бронирование ID: 67891",
    start: "2024-08-20T14:00:00",
    end: "2024-08-26T14:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=67891",
    editable: false,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "rent",
    transportName: "Porsche Cayenne",
  },
  {
    id: "56780_rent_98712",
    title: "Бронирование ID: 98712",
    start: "2024-08-03T12:00:00",
    end: "2024-08-09T12:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=98712",
    editable: true,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "rent",
    transportName: "Land Rover Discovery",
  },
  {
    id: "67892_repair_54323",
    title: "На ремонте ID: 54323",
    start: "2024-08-25T08:00:00",
    end: "2024-08-31T18:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=54323",
    editable: true,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "repair",
    transportName: "Chrysler 300",
  },
  {
    id: "78901_rent_43210",
    title: "Бронирование ID: 43210",
    start: "2024-08-04T08:00:00",
    end: "2024-08-11T08:00:00",
    url: "https://dev2.getmecar.ru/reserv/?reservation_id=43210",
    editable: false,
    backgroundColor: "#E8F3FE",
    borderColor: "#E8F3FE",
    textColor: "#429CF3",
    status: "rent",
    transportName: "Subaru Legacy",
  },
];

function App() {
  // Calculate the start and end of the current month
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [sortBy, setSortBy] = useState<string>("");
  const [filterBy, setFilterBy] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: startOfMonth,
    endDate: endOfMonth,
  });

  const handleSortChange = (sortBy: string) => {
    setSortBy(sortBy);
    // Логика сортировки, если нужно
  };

  const handleFilterChange = (filterBy: string) => {
    setFilterBy(filterBy);
    // Логика фильтрации, если нужно
  };

  const handleSearchChange = (searchValue: string) => {
    setSearchValue(searchValue);
    // Логика фильтрации по поисковому запросу, если нужно
  };

  const handleDateRangeChange = (range: { startDate: Date; endDate: Date }) => {
    setDateRange(range);
  };

  const filteredData = data.filter((item) => {
    const itemStartDate = new Date(item.start);
    const itemEndDate = new Date(item.end);
    const { startDate, endDate } = dateRange;

    return (
      (itemStartDate >= startDate && itemStartDate <= endDate) ||
      (itemEndDate >= startDate && itemEndDate <= endDate)
    );
  });

  return (
    <div className="calendar-wrapper">
      <CalendarOptions
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onDateRangeChange={handleDateRangeChange}
        defaultDateRange={{ startDate: startOfMonth, endDate: endOfMonth }}
      />
      <TransportCalendar bookings={filteredData} />
    </div>
  );
}

export default App;
