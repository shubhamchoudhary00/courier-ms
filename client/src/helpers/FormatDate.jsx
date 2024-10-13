const FormatDate = (dateString) => {
    const date = new Date(dateString);
  
    // Create arrays to get the month abbreviations
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
    // Extract the day, month, and year
    const day = date.getUTCDate().toString().padStart(2, '0'); // Get the day and pad it to 2 digits
    const month = months[date.getUTCMonth()]; // Get the month abbreviation
    const year = date.getUTCFullYear(); // Get the full year
  
    // Return the formatted date as dd-mmm-yyyy
    return `${day}-${month}-${year}`;
  };
  

  
  export default FormatDate;
  