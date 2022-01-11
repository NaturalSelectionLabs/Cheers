export const timeDifferent = (timeStamp: number): string => {
    const date1: any = new Date(timeStamp);
    const date2: any = Date.now();
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor(((diffTime % (1000 * 60 * 60 * 24)) % (1000 * 60 * 60)) / (1000 * 60));
    if (diffDays === 0 && diffHours === 0 && diffMinutes === 0) {
        return 'less than a minute ago';
    } else if (diffDays === 0 && diffHours === 0) {
        return diffMinutes + ' minutes ago';
    } else if (diffDays === 0) {
        return diffHours + ' hours ago';
    } else {
        return diffDays + ' days ago';
    }
};

export const formatDate = (ts: string): string => {
    let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let date = new Date(parseInt(ts) * 1000);
    let day = date.getDay() < 10 ? '0' + date.getDay() : date.getDay();
    return `${month[date.getMonth()]} ${day}, ${date.getFullYear()}`;
};
