import React from "react";

const statusColors: Record<string, string[]> = {
  rent: ["#e3f2fd", "#bbdefb", "#64b5f6"],
  reserved: ["#b7efc5", "#92e6a7", "#6ede8a"],
  repair: ["#fff4df", "#ffeeb8", "#ffdf88"],
};

const getBookingStyle = (booking: Booking, index: number): any => {
  const colors = statusColors[booking.status] || statusColors["rent"];
  const shadeIndex = index % colors.length;
  const selectedColor = colors[shadeIndex];

  return {
    background: selectedColor,
    color: "#000",
  };
};

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
  status: any;
  transportName: string;
}

interface BookingCellProps {
  booking: Booking | null;
  colSpan: number;
  index: number;
  isStart?: boolean;
  isEnd?: boolean;
  isContinuous?: boolean;
  onClick: () => void;
}

const BookingCell: React.FC<BookingCellProps> = ({
  booking,
  colSpan,
  index,
  isStart,
  isEnd,
  isContinuous,
  onClick,
}) => {
  const style = booking ? getBookingStyle(booking, index) : {};

  const rentRange = booking
    ? `${new Date(booking.start).toLocaleDateString("ru-RU")} - ${new Date(
        booking.end
      ).toLocaleDateString("ru-RU")}`
    : "";

  return (
    <td
      onClick={onClick}
      className="booking-cell"
      style={style}
      colSpan={colSpan}>
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
