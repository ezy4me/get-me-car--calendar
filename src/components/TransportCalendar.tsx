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
  vehicals: {
    id: number;
    name: string;
    type: string;
    class: string;
    brand: string;
    model: string;
    engine_type: string;
    edit_url: string;
    rents: {
      id: number;
      start_date: string;
      end_date: string;
      country: string;
      city: string;
      client_name: string;
      email: string;
      tel: string;
      tel_2: string;
      socials: { [key: string]: boolean }[];
      payment_koeff: number;
      payable: number;
      currency: string;
      services: number[];
    }[];
  }[];
}

const TransportCalendar: React.FC<TransportCalendarProps> = ({ vehicals }) => {
  const [selectedRange, setSelectedRange] = useState<string[]>([]);
  const [selectedRent, setSelectedRent] = useState<any | null>(null);
  const [vehicle, setVehicle] = useState<any | null>(null);
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
        if (!isNaN(index)) selectedHeaders.add(index);
        if (!isNaN(rowId)) selectedRows.add(rowId);
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

  const hasBookings = vehicals.some((vehical) => vehical.rents.length > 0);

  if (!vehicals || vehicals.length === 0 || !hasBookings) {
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

  const extractNumericId = (id: number) => id;

  const { minDate, maxDate } = getMinMaxDates(
    vehicals.flatMap((vehical) => vehical.rents)
  );

  const minDateStr = minDate.toISOString().split("T")[0];
  const maxDateStr = maxDate.toISOString().split("T")[0];
  const dates: string[] = generateDateRange(minDateStr, maxDateStr);

  const groupedBookings = vehicals.reduce<Record<number, Booking[]>>(
    (acc, vehical) => {
      vehical.rents.forEach((rent: any) => {
        const numericId = extractNumericId(vehical.id);
        if (!acc[numericId]) {
          acc[numericId] = [];
        }
        acc[numericId].push(rent);
      });
      return acc;
    },
    {}
  );

  const handleFinishSelection: TFinishSelectionCallback = (items) => {
    // Получаем даты из атрибутов `data-date`
    const selectedDates = items
      .map((item) => item.getAttribute("data-date") || "")
      .filter((date) => date !== "");

    setSelectedRange(selectedDates);

    // Получаем идентификаторы строк из атрибутов `data-row`
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
        const newRent = {
          start_date: selectedDates[0] + "T09:00:00",
          end_date: selectedDates[selectedDates.length - 1] + "T18:00:00",
          payment_koeff: 0,
          payable: 0,
        };

        setSelectedRent(newRent);

        const vehical = vehicals.find((v) => v.id === smallestRowId);

        if (vehical) {
          setVehicle({
            id: vehical.id,
            name: vehical.name,
            type: vehical.type,
            class: vehical.class,
            brand: vehical.brand,
            model: vehical.model,
            engine_type: vehical.engine_type,
            edit_url: vehical.edit_url,
          });
        }
      }
    }

    // Устанавливаем выделенные заголовки
    const selectedHeaders = items.map((item) =>
      parseInt(item.getAttribute("data-id") || "0", 10)
    );

    setHighlightedHeaders(selectedHeaders);
  };

  const handleVehicleInfo = (
    rent: any,
    vehicle: {
      id: number;
      name: string;
      type: string;
      class: string;
      brand: string;
      model: string;
      engine_type: string;
      edit_url: string;
    }
  ) => {
    setSelectedRent(rent);
    setVehicle(vehicle);
  };

  const createBookingMatrix = () => {
    const matrix: {
      transportName: string;
      transportId: number;
      transportEditUrl: string;
      cells: JSX.Element[];
    }[] = [];

    vehicals.forEach((vehical) => {
      const row: JSX.Element[] = [];
      const relevantBookings = vehical.rents;
      const occupiedColumns = new Array(dates.length).fill(0);

      let colIndex = 0;

      relevantBookings.forEach((rent, index) => {
        const startDate = rent.start_date.split("T")[0];
        const endDate = rent.end_date.split("T")[0];
        const colSpan = calculateColSpan(startDate, endDate, dates);
        const startCol = dates.indexOf(startDate);

        while (colIndex < startCol) {
          if (occupiedColumns[colIndex] === 0) {
            row[colIndex] = (
              <td
                key={`empty-${vehical.id}-${colIndex}`}
                className="cell"
                data-id={colIndex.toString()}
                data-row={vehical.id.toString()}
                data-date={dates[colIndex]}
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
            key={`cell-${vehical.id}-${startCol}`}
            rent={rent}
            colSpan={adjustedColSpan}
            index={index}
            isContinuous={
              index > 0 &&
              relevantBookings[index - 1].end_date.split("T")[0] === startDate
            }
            onClick={() => handleVehicleInfo(rent, vehical)}
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
              key={`empty-${vehical.id}-${colIndex}`}
              className="cell"
              data-id={colIndex.toString()}
              data-row={vehical.id.toString()}
              data-date={dates[colIndex]}
            />
          );
        }
        colIndex++;
      }

      matrix.push({
        transportName: vehical.name,
        transportId: vehical.id,
        transportEditUrl: vehical.edit_url,
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
                  }
                  data-date={date}>
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
                    highlightedRows.includes(row.transportId)
                      ? "highlighted-transport"
                      : ""
                  }>
                  <a className="link" href={row.transportEditUrl}>
                    {row.transportName || ""}
                  </a>
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
      {selectedRent && (
        <RentalModal
          isOpen={!!selectedRent}
          onClose={() => setSelectedRent(null)}
          rent={selectedRent}
          vehicle={vehicle}
        />
      )}
    </>
  );
};

export default TransportCalendar;
