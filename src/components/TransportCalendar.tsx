import React, { useRef, useState } from "react";
import BookingCell from "./BookingCell";
import { generateDateRange, getMinMaxDates, calculateColSpan } from "../utils/dateUtils";
import { ReactMouseSelect } from 'react-mouse-select';

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
    
    // Преобразуем даты в строки формата YYYY-MM-DD
    const minDateStr = minDate.toISOString().split('T')[0];
    const maxDateStr = maxDate.toISOString().split('T')[0];

    const dates: string[] = generateDateRange(minDateStr, maxDateStr);

    const groupedBookings = bookings.reduce<Record<string, Booking[]>>((acc, booking) => {
        if (!acc[booking.transportName]) {
            acc[booking.transportName] = [];
        }
        acc[booking.transportName].push(booking);
        return acc;
    }, {});

    const [selectedRange, setSelectedRange] = useState<string[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);

    const handleFinishSelection = (items: Element[], e: MouseEvent) => {
        const selectedDates = items.map(item => dates[parseInt(item.getAttribute('data-id') || '', 10)]);
        console.log('Selected Dates:', selectedDates); // Debugging line
        setSelectedRange(selectedDates);
    };

    const createBookingMatrix = () => {
        const matrix: { transportName: string; cells: JSX.Element[] }[] = [];
        Object.keys(groupedBookings).forEach((transportName, rowIndex) => {
            const row: JSX.Element[] = [];
            const relevantBookings = groupedBookings[transportName];
            let colIndex = 0; // текущий индекс колонки

            relevantBookings.forEach((booking, index) => {
                const startDate = booking.start.split('T')[0];
                const endDate = booking.end.split('T')[0];
                const colSpan = calculateColSpan(startDate, endDate, dates);
                const startCol = dates.indexOf(startDate);

                // Проверяем и добавляем пустые ячейки, если необходимо
                while (colIndex < startCol) {
                    row[colIndex] = (
                        <td
                            key={`empty-${transportName}-${colIndex}`}
                            className={`cell`}
                            data-id={colIndex.toString()}
                            data-row={rowIndex}
                        />
                    );
                    colIndex++;
                }

                // Проверяем, совпадает ли дата конца аренды с началом новой
                const previousBooking = relevantBookings[index - 1];
                const isContinuous = previousBooking && previousBooking.end.split('T')[0] === startDate;

                row[startCol] = (
                    <BookingCell
                        key={`cell-${transportName}-${startCol}`}
                        booking={booking}
                        colSpan={colSpan}
                        index={index}
                        isContinuous={isContinuous}
                    />
                );

                colIndex = startCol + colSpan;
            });

            // Добавляем пустые ячейки до конца строки
            while (colIndex < dates.length) {
                row[colIndex] = (
                    <td
                        key={`empty-${transportName}-${colIndex}`}
                        className={`cell`}
                        data-id={colIndex.toString()}
                        data-row={rowIndex}
                    />
                );
                colIndex++;
            }

            matrix.push({ transportName, cells: row });
        });
        return matrix;
    };

    const bookingMatrix = createBookingMatrix();

    return (
        <>
            <main className="container">
                <table className="transport-calendar">
                    <thead>
                        <tr>
                            <th>Транспорт</th>
                            {dates.map((date, index) => (
                                <th key={index}>{new Date(date).toLocaleDateString('ru-RU').substring(0, 5)}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody >
                        {bookingMatrix.map((row, rowIndex) => (
                            <tr key={rowIndex} >
                                <td>{row.transportName}</td>
                                {row.cells}
                            </tr>
                        ))}
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
        </>
    );
};

export default TransportCalendar;
