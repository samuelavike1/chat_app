export const formatMessageDateLong = (date) => {
    const now = new Date()
    const inputDate = new Date(date)

    if (isToday(inputDate)) {
        return inputDate.toLocaleDateString([], {hour: '2-digit', minute: '2-digit'})
    }else if (isYesterday(inputDate)) {
        return "yesterday " + inputDate.toLocaleDateString([], {hour: '2-digit', minute: '2-digit'});
    } else if (inputDate.getFullYear() === now.getFullYear()){
        return inputDate.toLocaleDateString([], {day: '2-digit', month: '2-digit'});
    } else {
        return inputDate.toLocaleDateString();
    }
}

export const formatMessageDateShort = (date) => {
    const now = new Date()
    const inputDate = new Date(date)

    if (isToday(inputDate)) {
        return inputDate.toLocaleDateString([], {hour: '2-digit', minute: '2-digit'});
    }else if (isYesterday(inputDate)) {
        return "yesterday";
    }else if (inputDate.getFullYear() === now.getFullYear()){
        return inputDate.toLocaleDateString([], {day: '2-digit', month: '2-digit'});
    }else {
        return inputDate.toLocaleDateString();
    }
}

export const isToday = (date) => {
    const today = new Date()
    return(
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}

export const isYesterday = (date) => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    return(
        date.getDate() === yesterday.getDate() &&
        date.getFullYear() === yesterday.getFullYear() &&
        date.getMonth() === yesterday.getMonth()
    );
}
