export const formatPublishDate = (dateString: string | null) => {
  if(dateString == null){
    return "-"
  }
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,  // For 12-hour time format with AM/PM
  };

  return new Intl.DateTimeFormat('en-GB', options).format(date);
};