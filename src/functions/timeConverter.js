// Converts a string with a time into an object with ms and proper time
module.exports.toMS = delayInTime => {
  let delay = parseFloat(delayInTime);

  // Defaults to minutes if no modifier is given
  if (delay.toString() === delayInTime) {
    delay *= 60 * 1000;
    return {
      msTime: delay,
      properTime: getProperTime(delay)
    };
  };

  const delayModifier = delayInTime.replace(delay, '');
  if (
    // Seconds -> ms
    delayModifier === 's' ||
    delayModifier === 'sec' ||
    delayModifier === 'second' ||
    delayModifier === 'seconds'
  ) {
    delay *= 1000;
    return {
      msTime: delay,
      properTime: getProperTime(delay)
    };
  } else if (
    // Minutes -> ms
    delayModifier === 'm' ||
    delayModifier === 'min' ||
    delayModifier === 'minute' ||
    delayModifier === 'minutes'
  ) {
    delay *= 60 * 1000;
    return {
      msTime: delay,
      properTime: getProperTime(delay)
    };
  } else if (
    // Hours -> ms
    delayModifier === 'h' ||
    delayModifier === 'hr' ||
    delayModifier === 'hour' ||
    delayModifier === 'hours'
  ) {
    delay *= 60 * 60 * 1000;
    return {
      msTime: delay,
      properTime: getProperTime(delay)
    };
  } else if (
    // Days -> ms
    delayModifier === 'd' ||
    delayModifier === 'day' ||
    delayModifier === 'days'
  ) {
    delay *= 24 * 60 * 60 * 1000;
    return {
      msTime: delay,
      properTime: getProperTime(delay)
    };
  };
};

// Converts ms into a proper time
module.exports.fromMS = timeInMs => {
  return getProperTime(timeInMs);
};

const getProperTime = msTime => {
  let properTime = [];
  // The days
  if (msTime >= (24 * 60 * 60 * 1000)) {
    const days = Math.floor(msTime / (24 * 60 * 60 * 1000));
    properTime.push(`${days} days`);
    msTime -= days * 24 * 60 * 60 * 1000;
  };
  // The hours
  if (msTime >= (60 * 60 * 1000)) {
    const hours = Math.floor(msTime / (60 * 60 * 1000));
    properTime.push(`${hours} hours`);
    msTime -= hours * 60 * 60 * 1000;
  };
  // The minutes
  if (msTime >= (60 * 1000)) {
    const minutes = Math.floor(msTime / (60 * 1000));
    properTime.push(`${minutes} minutes`);
    msTime -= minutes * 60 * 1000;
  };
  // The seconds
  if (msTime >= (1000)) {
    const seconds = Math.floor(msTime / (1000));
    properTime.push(`${seconds} seconds`);
    msTime -= seconds * 1000;
  };

  return properTime.join(', ');
};