import React, { useState, useRef, useEffect } from "react";
import BookingCell from "./BookingCell";
import RentalModal from "./RentalModal";
import {
  generateDateRange,
  getMinMaxDates,
  calculateColSpan,
} from "../utils/dateUtils";
import { ReactMouseSelect, TFinishSelectionCallback } from "react-mouse-select";
import { IoAddCircle  } from "react-icons/io5";
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

interface TransportCalendarProps {
  bookings: Booking[];
}

const TransportCalendar: React.FC<TransportCalendarProps> = ({ bookings }) => {
  const { minDate, maxDate } = getMinMaxDates(bookings);
  const minDateStr = minDate.toISOString().split("T")[0];
  const maxDateStr = maxDate.toISOString().split("T")[0];
  const dates: string[] = generateDateRange(minDateStr, maxDateStr);

  const groupedBookings = bookings.reduce<Record<string, Booking[]>>(
    (acc, booking) => {
      if (!acc[booking.transportName]) {
        acc[booking.transportName] = [];
      }
      acc[booking.transportName].push(booking);
      return acc;
    },
    {}
  );

  const [selectedRange, setSelectedRange] = useState<string[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [initialRow, setInitialRow] = useState<number | null>(null);
  const [highlightedHeaders, setHighlightedHeaders] = useState<number[]>([]);
  const [highlightedRows, setHighlightedRows] = useState<number[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

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
      selectedRows.length > 0 ? Math.min(...selectedRows) : null;

    if (smallestRowId !== null) {
      setInitialRow(smallestRowId);
      const transportName = bookingMatrix[smallestRowId]?.transportName;
      const bookingsInRow = groupedBookings[transportName || ""] || [];

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
      parseInt(item.getAttribute("data-id") || "")
    );

    setHighlightedHeaders(selectedHeaders);

    // Set highlightedRows to only include the smallest row ID
    setHighlightedRows(smallestRowId !== null ? [smallestRowId] : []);
  };

  const createBookingMatrix = () => {
    const matrix: { transportName: string; cells: JSX.Element[] }[] = [];

    Object.keys(groupedBookings).forEach((transportName) => {
      const row: JSX.Element[] = [];
      const relevantBookings = groupedBookings[transportName];
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
                key={`empty-${transportName}-${colIndex}`}
                className="cell"
                data-id={colIndex.toString()}
                data-row={matrix.length}
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
            key={`cell-${transportName}-${startCol}`}
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
              key={`empty-${transportName}-${colIndex}`}
              className="cell"
              data-id={colIndex.toString()}
              data-row={matrix.length}
            />
          );
        }
        colIndex++;
      }

      matrix.push({ transportName, cells: row });
    });

    return matrix;
  };

  const bookingMatrix = createBookingMatrix();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const selectedItems = containerRef.current?.querySelectorAll(".selected");
      const selectedHeaders = new Set<number>();
      const selectedRows = new Set<number>();

      selectedItems?.forEach((item) => {
        const index = parseInt(item.getAttribute("data-id") || "0");
        selectedHeaders.add(index);
        selectedRows.add(parseInt(item.getAttribute("data-row") || "0"));
      });

      // Ensure only the smallest row is highlighted
      const smallestRowId =
        selectedRows.size > 0 ? Math.min(...selectedRows) : null;

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
                    highlightedRows.includes(rowIndex)
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
                  <IoAddCircle  size={32}/>
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
