import React, { useState } from "react";
import CalendarOptions from "./components/CalendarOptions";
import TransportCalendar from "./components/TransportCalendar";

// Определение типов
interface Rent {
  id: number;
  start_date: string;
  end_date: string;
  country: string;
  city: string;
  client_name: string;
  email: string;
  tel: string;
  tel_2: string;
  socials: { Telegram: boolean; Whatsapp: boolean; Viber: boolean }[];
  payment_koeff: number;
  payable: number;
  currency: string;
  services: number[];
}

interface Vehicle {
  id: number;
  name: string;
  type: string;
  class: string;
  brand: string;
  model: string;
  engine_type: string;
  edit_url: string;
  rents: Rent[];
}

const vehicles: Vehicle[] = [
  {
    id: 12345678,
    name: "Kia Optima",
    type: "car",
    class: "premium",
    brand: "kia",
    model: "optima",
    engine_type: "diesel",
    edit_url: "getmecar.ru/edit_cars?id=12345678",
    rents: [
      {
        id: 1,
        start_date: "2024-09-01T20:44:56",
        end_date: "2024-09-09T20:44:56",
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
        start_date: "2024-09-14T20:44:56",
        end_date: "2024-09-18T20:44:56",
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
      {
        id: 3,
        start_date: "2024-09-20T20:44:56",
        end_date: "2024-09-22T20:44:56",
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
    type: "truck",
    class: "premium",
    brand: "Land Rover",
    model: "Discovery",
    engine_type: "diesel",
    edit_url: "getmecar.ru/edit_cars?id=12345678",
    rents: [
      {
        id: 67,
        start_date: "2024-09-01T20:44:56",
        end_date: "2024-09-05T20:44:56",
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
        start_date: "2024-09-05T20:44:56",
        end_date: "2024-09-11T20:44:56",
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
        id: 90,
        start_date: "2024-09-15T20:44:56",
        end_date: "2024-10-20T20:44:56",
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

function getMinMaxDates(vehicles: Vehicle[]): { minDate: Date; maxDate: Date } {
  const rentDates = vehicles.flatMap((v) =>
    v.rents.map((r) => {
      return {
        start: new Date(r.start_date).getTime(),
        end: new Date(r.end_date).getTime(),
      };
    })
  );

  const minDate = new Date(Math.min(...rentDates.map((r) => r.start)));
  const maxDate = new Date(Math.max(...rentDates.map((r) => r.end)));

  return { minDate, maxDate };
}

function App() {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const { minDate, maxDate } = getMinMaxDates(vehicles);

  const [sortBy, setSortBy] = useState<string>("");
  const [filterBy, setFilterBy] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: minDate || startOfMonth,
    endDate: maxDate || endOfMonth,
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

  const filteredVehicles = vehicles.map((vehicle) => {
    const filteredRents = vehicle.rents.filter((rent) => {
      const itemStartDate = new Date(rent.start_date);
      const itemEndDate = new Date(rent.end_date);
      const { startDate, endDate } = dateRange;

      return (
        (itemStartDate >= startDate && itemStartDate <= endDate) ||
        (itemEndDate >= startDate && itemEndDate <= endDate)
      );
    });

    return { ...vehicle, rents: filteredRents };
  });

  return (
    <div className="calendar-wrapper">
      <CalendarOptions
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onDateRangeChange={handleDateRangeChange}
        defaultDateRange={{
          startDate: minDate || startOfMonth,
          endDate: maxDate || endOfMonth,
        }}
      />
      <TransportCalendar vehicals={filteredVehicles} />
    </div>
  );
}

export default App;
