import React from "react";
import { statusColors } from "../utils/colorUtils";

const getrentStyle = (rent: any, index: number): any => {
  const colors = statusColors[rent.status] || statusColors["rent"];
  const shadeIndex = index % colors.length;
  const selectedColor = colors[shadeIndex];

  return {
    background: selectedColor,
    color: "#000",
  };
};

interface rentCellProps {
  rent: any | null;
  colSpan: number;
  index: number;
  isStart?: boolean;
  isEnd?: boolean;
  isContinuous?: boolean;
  onClick: () => void;
}

const rentCell: React.FC<rentCellProps> = ({
  rent,
  colSpan,
  index,
  isStart,
  isEnd,
  isContinuous,
  onClick,
}) => {
  const style = rent ? getrentStyle(rent, index) : {};

  const rentRange = rent
    ? `${new Date(rent.start_date)
        .toLocaleDateString("ru-RU")
        .substring(0, 5)} - ${new Date(rent.end_date)
        .toLocaleDateString("ru-RU")
        .substring(0, 5)}`
    : "";

  return (
    <td onClick={onClick} className="booking-cell" style={style} colSpan={colSpan}>
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

export default rentCell;
