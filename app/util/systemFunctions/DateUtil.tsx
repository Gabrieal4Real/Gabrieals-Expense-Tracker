export function formatDateToddMMyyyyHHmmss(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
  
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
  
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
  
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

export function formatDateToddMMMyyyyHHmmssA(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const day = pad(date.getDate());
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    const hourStr = pad(hours);

    return `${day}-${month}-${year} ${hourStr}:${minutes}:${seconds} ${ampm}`;
}
