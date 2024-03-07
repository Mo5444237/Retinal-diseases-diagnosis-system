function formatTime(hour, minute) {
  return (
    (hour < 10 ? "0" + hour : hour) +
    ":" +
    (minute < 10 ? "0" + minute : minute)
  );
}

exports.getAvailableTime = (startTime, endTime) => {
  let hourMap = {};

  // Populate the hashmap
  for (let hour = startTime; hour <= endTime; hour++) {
    let value = formatTime(hour, 0);
    hourMap[value] = value;

    if (hour !== endTime) {
      value = formatTime(hour, 30);
      hourMap[value] = value;
    }
  }
  return hourMap;
};
