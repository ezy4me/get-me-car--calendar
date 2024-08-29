import React from "react";
import { Booking } from "../types";
import { statusColors } from "../utils/colorUtils";

const getBookingStyle = (booking: Booking, index: number): any => {
  const colors = statusColors[booking.status] || statusColors["rent"];
  const shadeIndex = index % colors.length;
  const selectedColor = colors[shadeIndex];

  return {
    background: selectedColor,
    color: "#000",
  };
};

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
    ? `${new Date(booking.start)
        .toLocaleDateString("ru-RU")
        .substring(0, 5)} - ${new Date(booking.end)
        .toLocaleDateString("ru-RU")
        .substring(0, 5)}`
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
