import React from "react";

// Определение массива оттенков для разных статусов с типами
const statusColors: Record<string, string[]> = {
  rent: ["#e3f2fd", "#bbdefb", "#64b5f6"],
  reserved: ["#b7efc5", "#92e6a7", "#6ede8a"],
  repair: ["#fff0f3", "#ffccd5", "#ffb3c1"],
};

// Определение типа для объекта бронирования
interface Booking {
  id: string;
  title: string;
  start: string;
  end: string;
  url: string;
  editable: boolean;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  status: keyof typeof statusColors; // Ключи должны совпадать с ключами statusColors
  transportName: string;
}

// Определение типов для пропсов компонента
interface BookingCellProps {
  booking: Booking | null; // Бронирование может быть null
  colSpan: number;
  index: number;
  isStart?: boolean; // Эти поля необязательные
  isEnd?: boolean;
  isContinuous?: boolean;
}

// Функция для получения цвета фона ячейки по индексу и статусу
const getBookingStyle = (booking: Booking, index: number): any => {
  const colors = statusColors[booking.status] || statusColors["rent"]; // По умолчанию используем синие оттенки
  const shadeIndex = index % colors.length;
  const selectedColor = colors[shadeIndex];

  return {
    background: selectedColor,
    color: "#000",
  };
};

const BookingCell: React.FC<BookingCellProps> = ({
  booking,
  colSpan,
  index,
  isStart,
  isEnd,
  isContinuous,
}) => {
  const style = booking ? getBookingStyle(booking, index) : {};

  const rentRange = booking
    ? `${new Date(booking.start).toLocaleDateString("ru-RU")} - ${new Date(
        booking.end
      ).toLocaleDateString("ru-RU")}`
    : "";

  return (
    <td className="booking-cell" style={style} colSpan={colSpan}>
      {isContinuous && (
        <div
          className="is-continuous"
          style={{ backgroundColor: style.background }}
        />
      )}
      <div className="content">{rentRange}</div>
    </td>
  );
};

export default BookingCell;
