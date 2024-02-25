export const formatAmount = value => `₦${Number(value).toLocaleString("en-US")}`;
export const formatAmountFraction = value => `₦${Number(value).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits:2})}`;
export const formatNumber = value => new Intl.NumberFormat('en-US').format(value.toString().replace(/\D/g, ''));
export const formatNumberToFloat = value => parseFloat(value.toString().replace(/,/g, ''));
export const formatNumberFraction = value => Number(value).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits:2});

export const calculateTimeLeft = (targetDate) => {
  const now = new Date().getTime();
  const difference = new Date(targetDate) - now;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Build an array of non-zero units
    const nonZeroUnits = [];
    if (days > 0) nonZeroUnits.push(`${days}`.padStart(2,0));
    if (hours > 0) nonZeroUnits.push(`${hours}`.padStart(2,0));
    if (minutes > 0) nonZeroUnits.push(`${minutes}`.padStart(2,0));
    nonZeroUnits.push(`${seconds}`.padStart(2,0));

    // Join the units into a string
    const formattedTime = nonZeroUnits.join(':');
    
    return formattedTime;
  }
};
