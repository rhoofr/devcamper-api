/**
 * Returns a formatted string with the current local time as shown in @return below.
 * @param  Nada
 * @return {String} 'Current Date/Time: 02-09-2020 08:28:21 Local'
 */
exports.getCurrentDateTimeLocal = () => {
  const dt = new Date();
  let currentDate = dt.getDate();
  let currentMonth = dt.getMonth() + 1;
  const currentYear = dt.getFullYear();
  let currentHours = dt.getHours();
  let currentMins = dt.getMinutes();
  let currentSecs = dt.getSeconds();

  // Add 0 before date, month, hrs, mins or secs if they are less than 0
  currentDate = currentDate < 10 ? `0${currentDate}` : currentDate;
  currentMonth = currentMonth < 10 ? `0${currentMonth}` : currentMonth;
  currentHours = currentHours < 10 ? `0${currentHours}` : currentHours;
  currentMins = currentMins < 10 ? `0${currentMins}` : currentMins;
  currentSecs = currentSecs < 10 ? `0${currentSecs}` : currentSecs;

  return `${currentMonth}-${currentDate}-${currentYear} ${currentHours}:${currentMins}:${currentSecs} Local`;
};
