import dateformat from 'dateformat' 

export const formatTime = (date)=>{
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - new Date(date).getTime();

    // Calculate the differences in seconds, minutes, hours, and days
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days === 1 ? 'Yesterday' : dateformat(date, 'mmm d, yyyy')}`;
    } else if (hours > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else {
        return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
}

export const randomDarkColor =  () => {
  let color = "#";
  while (color==="#") {
    const c = Math.floor(Math.random() * 16777215).toString(16); // Generate random color

    const r = parseInt(c.slice(1, 3), 16);
    const g = parseInt(c.slice(3, 5), 16);
    const b = parseInt(c.slice(5, 7), 16);

    // Calculate the relative luminance using the WCAG formula
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    if (luminance > 0.55){
        color += c;
    } 
        
  }

  return color;
}

export const formatAmount = value => `₦${Number(value).toLocaleString("en-US")}`;
