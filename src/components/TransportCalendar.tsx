import React, { useState, useRef, useEffect } from "react";
import BookingCell from "./BookingCell";
import RentalModal from "./RentalModal";
import {
  generateDateRange,
  getMinMaxDates,
  calculateColSpan,
} from "../utils/dateUtils";
import { ReactMouseSelect, TFinishSelectionCallback } from "react-mouse-select";
import { IoAddCircle } from "react-icons/io5";
import { Booking } from "../types";

interface TransportCalendarProps {
  bookings: Booking[];
}

const TransportCalendar: React.FC<TransportCalendarProps> = ({ bookings }) => {
  const [selectedRange, setSelectedRange] = useState<string[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [initialRow, setInitialRow] = useState<number | null>(null);
  const [highlightedHeaders, setHighlightedHeaders] = useState<number[]>([]);
  const [highlightedRows, setHighlightedRows] = useState<number[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const selectedItems = containerRef.current?.querySelectorAll(".selected");
      const selectedHeaders = new Set<number>();
      const selectedRows = new Set<number>();

      selectedItems?.forEach((item) => {
        const index = parseInt(item.getAttribute("data-id") || "");
        const rowId = parseInt(item.getAttribute("data-row") || "");
        selectedHeaders.add(index);
        selectedRows.add(rowId);
      });

      const smallestRowId =
        selectedRows.size > 0 ? Array.from(selectedRows)[0] : null;

      setHighlightedHeaders(Array.from(selectedHeaders));
      setHighlightedRows(smallestRowId !== null ? [smallestRowId] : []);
    });

    const observeTarget = containerRef.current;
    if (observeTarget) {
      observer.observe(observeTarget, {
        attributes: true,
        subtree: true,
        attributeFilter: ["class"],
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!bookings || bookings.length === 0) {
    return (
      <div className="calendar-container container no-data-placeholder">
        <p>Данных о бронированиях нет</p>
        <button
          className="btn"
          onClick={() => alert("Редирект на форму добавления транспорта")}>
          Добавить транспорт
        </button>
      </div>
    );
  }

  const extractNumericId = (id: string) => parseInt(id.replace(/\D/g, ""), 10);

  const { minDate, maxDate } = getMinMaxDates(bookings);
  const minDateStr = minDate.toISOString().split("T")[0];
  const maxDateStr = maxDate.toISOString().split("T")[0];
  const dates: string[] = generateDateRange(minDateStr, maxDateStr);

  const groupedBookings = bookings.reduce<Record<number, Booking[]>>(
    (acc, booking) => {
      const numericId = extractNumericId(booking.id);
      if (!acc[numericId]) {
        acc[numericId] = [];
      }
      acc[numericId].push(booking);
      return acc;
    },
    {}
  );

  const handleFinishSelection: TFinishSelectionCallback = (items, e) => {
    const selectedDates = items.map(
      (item) => dates[parseInt(item.getAttribute("data-id") || "")]
    );
    setSelectedRange(selectedDates);

    const selectedRows = Array.from(
      new Set(
        items.map((item) => parseInt(item.getAttribute("data-row") || ""))
      )
    );

    const smallestRowId =
      selectedRows.length > 0 ? Array.from(selectedRows)[0] : null;

    if (smallestRowId !== null) {
      setInitialRow(smallestRowId);

      const bookingsInRow = groupedBookings[smallestRowId] || [];
      if (bookingsInRow.length > 0) {
        const newBooking = {
          ...bookingsInRow[0],
          start: selectedDates[0] + "T09:00:00",
          end: selectedDates[selectedDates.length - 1] + "T18:00:00",
        };

        setSelectedBooking(newBooking);
      }
    }

    const selectedHeaders = items.map((item) =>
      parseInt(item.getAttribute("data-id") || "0", 10)
    );

    setHighlightedHeaders(selectedHeaders);
  };

  const createBookingMatrix = () => {
    const matrix: {
      transportName: string;
      transportId: string;
      cells: JSX.Element[];
    }[] = [];

    Object.keys(groupedBookings).forEach((numericId) => {
      const row: JSX.Element[] = [];
      const relevantBookings = groupedBookings[parseInt(numericId, 10)];
      const occupiedColumns = new Array(dates.length).fill(0);

      let colIndex = 0;

      relevantBookings.forEach((booking, index) => {
        const startDate = booking.start.split("T")[0];
        const endDate = booking.end.split("T")[0];
        const colSpan = calculateColSpan(startDate, endDate, dates);
        const startCol = dates.indexOf(startDate);

        while (colIndex < startCol) {
          if (occupiedColumns[colIndex] === 0) {
            row[colIndex] = (
              <td
                key={`empty-${numericId}-${colIndex}`}
                className="cell"
                data-id={colIndex.toString()}
                data-row={numericId}
              />
            );
            colIndex++;
          }
        }

        let adjustedColSpan = colSpan;
        for (let i = startCol; i < startCol + colSpan; i++) {
          if (i < dates.length && occupiedColumns[i] > 0) {
            adjustedColSpan--;
          }
        }

        row[startCol] = (
          <BookingCell
            key={`cell-${numericId}-${startCol}`}
            booking={booking}
            colSpan={adjustedColSpan}
            index={index}
            isContinuous={
              index > 0 &&
              relevantBookings[index - 1].end.split("T")[0] === startDate
            }
            onClick={() => setSelectedBooking(booking)}
          />
        );

        for (let i = startCol; i < startCol + colSpan; i++) {
          if (i < dates.length) {
            occupiedColumns[i]++;
          }
        }

        colIndex = startCol + colSpan;
      });

      while (colIndex < dates.length) {
        if (occupiedColumns[colIndex] === 0) {
          row[colIndex] = (
            <td
              key={`empty-${numericId}-${colIndex}`}
              className="cell"
              data-id={colIndex.toString()}
              data-row={numericId}
            />
          );
        }
        colIndex++;
      }

      matrix.push({
        transportName: relevantBookings[0].transportName,
        transportId: numericId,
        cells: row,
      });
    });

    return matrix;
  };

  const bookingMatrix = createBookingMatrix();

  return (
    <>
      <main className="calendar-container container" ref={containerRef}>
        <table className="transport-calendar">
          <thead>
            <tr>
              <th>Транспорт</th>
              {dates.map((date, index) => (
                <th
                  key={index}
                  className={
                    highlightedHeaders.includes(index)
                      ? "highlighted-header"
                      : ""
                  }>
                  {new Date(date).toLocaleDateString("ru-RU").substring(0, 5)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookingMatrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td
                  className={
                    highlightedRows.includes(parseInt(row.transportId))
                      ? "highlighted-transport"
                      : ""
                  }>
                  {row.transportName || ""}
                </td>
                {row.cells}
              </tr>
            ))}
            <tr>
              <td className="cell">
                <button
                  className="btn cell-btn"
                  onClick={() => alert("Редирект на форму")}>
                  Добавить машину
                </button>
                <button
                  className="btn cell-btn-icon"
                  onClick={() => alert("Редирект на форму")}>
                  <IoAddCircle size={32} />
                </button>
              </td>
              {Array(dates.length)
                .fill(null)
                .map((_, index) => (
                  <td key={`empty-${index}`} className="cell" />
                ))}
            </tr>
          </tbody>
        </table>
      </main>
      <ReactMouseSelect
        containerRef={containerRef}
        itemClassName="cell"
        selectedItemClassName="selected"
        frameClassName="mouse-select__frame"
        openFrameClassName="open"
        finishSelectionCallback={handleFinishSelection}
        sensitivity={5}
      />
      {selectedBooking && (
        <RentalModal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          booking={selectedBooking}
        />
      )}
    </>
  );
};

export default TransportCalendar;
