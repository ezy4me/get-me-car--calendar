// utils/dateUtils.ts

/**
 * Генерация диапазона дат от start до end.
 * @param start - Начальная дата в формате строки (YYYY-MM-DD).
 * @param end - Конечная дата в формате строки (YYYY-MM-DD).
 * @returns Массив строк, представляющих даты в формате YYYY-MM-DD.
 */
export const generateDateRange = (start: string, end: string): string[] => {
    const dates: string[] = [];
    const currentDate = new Date(start);
    const endDate = new Date(end); // Преобразуем end один раз для использования в сравнении

    while (currentDate <= endDate) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        dates.push(`${year}-${month}-${day}`);

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};

/**
 * Получение минимальной и максимальной дат из массива бронирований.
 * @param bookings - Массив объектов бронирований.
 * @returns Объект с minDate и maxDate.
 */
export const getMinMaxDates = (bookings: { start: string; end: string }[]): { minDate: Date; maxDate: Date } => {
    const allDates = bookings.flatMap(booking => [
        new Date(booking.start).getTime(),
        new Date(booking.end).getTime()
    ]);

    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));

    return { minDate, maxDate };
};

/**
 * Вычисление количества колонок (colSpan) для диапазона дат.
 * @param startDate - Дата начала в формате YYYY-MM-DD.
 * @param endDate - Дата окончания в формате YYYY-MM-DD.
 * @param dates - Массив всех дат.
 * @returns Количество колонок, которое нужно занять.
 */
export const calculateColSpan = (startDate: string, endDate: string, dates: string[]): number => {
    const startIndex = dates.indexOf(startDate);
    const endIndex = dates.indexOf(endDate);
    return endIndex - startIndex + 1;
};

/**
 * Проверка, входит ли дата в диапазон дат.
 * @param date - Дата для проверки.
 * @param start - Дата начала диапазона.
 * @param end - Дата окончания диапазона.
 * @returns true, если дата находится в диапазоне, иначе false.
 */
export const isDateInRange = (date: string, start: string, end: string): boolean => {
    const checkDate = new Date(date);
    return checkDate >= new Date(start) && checkDate <= new Date(end);
};
