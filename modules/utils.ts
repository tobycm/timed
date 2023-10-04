export function secondsToTime(
  rawSeconds: number,
  colons?: true,
  doubleZeroInMinute?: true
) {
  rawSeconds = Math.round(rawSeconds); // cho chắc

  const hours = Math.floor(rawSeconds / 3600);
  const minutes = Math.floor((rawSeconds - hours * 3600) / 60);
  const seconds = rawSeconds - hours * 3600 - minutes * 60;

  return (
    (hours > 0 ? `${hours}${colons ? ":" : "h "}` : "") +
    (minutes < 10 && doubleZeroInMinute ? "0" : "") +
    minutes +
    (colons ? ":" : "m ") +
    (seconds < 10 ? "0" : "") +
    seconds +
    (!colons ? "s" : "")
  );
}

export function randomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  return result;
}
