import { useState } from "react";
import CalendarOptions from "./components/CalendarOptions";
import TransportCalendar from "./components/TransportCalendar";

const vehicals = [
  {
    id: 12345678,
    name: "Kia Optima",
    type: "car|passenger|truck|moto|air|water|etc...",
    class: "premium|cabriolete|etc...",
    brand: "kia",
    model: "optima",
    engine_type: "diesel",
    edit_url: "getmecar.ru/edit_cars?id=12345678",
    rents: [
      {
        id: 1,
        start_date: "2024-08-01T20:44:56",
        end_date: "2024-08-09T20:44:56",
        country: "Франция",
        city: "Париж",
        client_name: "Павел Дуров",
        email: "id1@vk.com",
        tel: "+79777777777",
        tel_2: "+713245678",
        socials: [{ Telegram: true, Whatsapp: true, Viber: false }],
        payment_koeff: 1.78,
        payable: 230,
        currency: "€",
        services: [123456, 12345, 11111, 167],
      },
      {
        id: 2,
        start_date: "2024-08-14T20:44:56",
        end_date: "2024-08-18T20:44:56",
        country: "Франция",
        city: "Париж",
        client_name: "Павел Дуров",
        email: "id1@vk.com",
        tel: "+79777777777",
        tel_2: "+713245678",
        socials: [{ Telegram: true, Whatsapp: true, Viber: false }],
        payment_koeff: 1.78,
        payable: 230,
        currency: "euro",
        services: [123456, 12345, 11111, 167],
      },
    ],
  },
  {
    id: 87654321,
    name: "Land Rover Discovery",
    type: "car|passenger|truck|moto|air|water|etc...",
    class: "premium|cabriolete|etc...",
    brand: "Land Rover",
    model: "Discovery",
    engine_type: "diesel",
    edit_url: "getmecar.ru/edit_cars?id=12345678",
    rents: [
      {
        id: 67,
        start_date: "2024-08-01T20:44:56",
        end_date: "2024-08-05T20:44:56",
        country: "Франция",
        city: "Париж",
        client_name: "Павел Дуров",
        email: "id1@vk.com",
        tel: "+79777777777",
        tel_2: "+713245678",
        socials: [{ Telegram: true, Whatsapp: true, Viber: false }],
        payment_koeff: 1.78,
        payable: 230,
        currency: "€",
        services: [123456, 12345, 11111, 167],
      },
      {
        id: 89,
        start_date: "2024-08-05T20:44:56",
        end_date: "2024-08-11T20:44:56",
        country: "Франция",
        city: "Париж",
        client_name: "Павел Дуров",
        email: "id1@vk.com",
        tel: "+79777777777",
        tel_2: "+713245678",
        socials: [{ Telegram: true, Whatsapp: true, Viber: false }],
        payment_koeff: 1.78,
        payable: 230,
        currency: "€",
        services: [123456, 12345, 11111, 167],
      },
    ],
  },
];

function App() {
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
  };

  const handleFilterChange = (filterBy: string) => {
    setFilterBy(filterBy);
  };

  const handleSearchChange = (searchValue: string) => {
    setSearchValue(searchValue);
  };

  const handleDateRangeChange = (range: { startDate: Date; endDate: Date }) => {
    setDateRange(range);
  };

  // Filtering and displaying vehicles within the date range
  const filteredVehicals = vehicals.map((vehical) => {
    const filteredRents = vehical.rents.filter((rent) => {
      const itemStartDate = new Date(rent.start_date);
      const itemEndDate = new Date(rent.end_date);
      const { startDate, endDate } = dateRange;

      return (
        (itemStartDate >= startDate && itemStartDate <= endDate) ||
        (itemEndDate >= startDate && itemEndDate <= endDate)
      );
    });

    return { ...vehical, rents: filteredRents };
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
      <TransportCalendar vehicals={filteredVehicals} />
    </div>
  );
}

export default App;
