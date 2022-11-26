export const convertTimeStringToMinute = (str) => {
  const a = str.split(':');
  return +a[0] * 60 + +a[1];
};

export const addMinuteToTimeString = (str, min) => {
  const totalMinutes = convertTimeStringToMinute(str) + min;
  const currentHours = Math.floor(totalMinutes / 60);
  const currentMinutes = totalMinutes % 60;
  return zeroPad(currentHours, 2) + ':' + zeroPad(currentMinutes, 2);
};

export const zeroPad = (num, places) => String(num).padStart(places, '0');
