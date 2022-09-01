export function make_backslash_d(): string {
    const current_date = new Date();
    let day;

    switch (current_date.getDay()) {
        case 0:
            day = "Sun";
            break;
        case 1:
            day = "Mon";
            break;
        case 2:
            day = "Tue";
            break;
        case 3:
            day = "Wed";
            break;
        case 4:
            day = "Thu";
            break;
        case 5:
            day = "Fri";
            break;
        case 6:
            day = "Sat";
            break;
        default:
            day = "?";
            break;
    }

    let month;
    switch (current_date.getMonth()) {
        case 0:
            month = "Jan";
            break;
        case 1:
            month = "Feb";
            break;
        case 2:
            month = "Mar";
            break;
        case 3:
            month = "Apr";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "Jun";
            break;
        case 6:
            month = "Jul";
            break;
        case 7:
            month = "Aug";
            break;
        case 8:
            month = "Sep";
            break;
        case 9:
            month = "Oct";
            break;
        case 10:
            month = "Nov";
            break;
        case 11:
            month = "Dec";
            break;
        default:
            month = "?";
            break;
    }

    return `${day} ${month} ${current_date.getDate() > 9 ? "" : "0"}${current_date.getDate()}`;
}

export function make_backslash_t(): string {
    const current_date = new Date();
    let hour = current_date.getHours();
    let minute = current_date.getMinutes();
    let second = current_date.getSeconds();

    // 0 pad the hour, minute, and second if they are less than 10
    if (hour < 10) {
        // @ts-ignore: We do some bad things here
        hour = `0${hour}`;
    }
    if (minute < 10) {
        // @ts-ignore: We do some bad things here
        minute = `0${minute}`;
    }
    if (second < 10) {
        // @ts-ignore: We do some bad things here
        second = `0${second}`;
    }

    return `${hour}:${minute}:${second}`;
}

export function make_backslash_capital_t(): string {
    const current_date = new Date();
    let hour;
    let minute = current_date.getMinutes();
    let second = current_date.getSeconds();

    if (current_date.getHours() > 12) {
        hour = current_date.getHours() - 12;
    } else {
        hour = current_date.getHours();
    }

    // 0 pad the hour, minute, and second if they are less than 10
    if (hour < 10) {
        // @ts-ignore: We do some bad things here
        hour = `0${hour}`;
    }
    if (minute < 10) {
        // @ts-ignore: We do some bad things here
        minute = `0${minute}`;
    }
    if (second < 10) {
        // @ts-ignore: We do some bad things here
        second = `0${second}`;
    }

    return `${hour}:${minute}:${second}`;
}

export function make_backslash_at(): string {
    const current_time = new Date();
    let hour = current_time.getHours();
    let minute = current_time.getMinutes();
    const am_pm = hour >= 12 ? "pm" : "am";

    // 0 pad the hour, minute, and second if they are less than 10
    if (hour < 10) {
        // @ts-ignore: We do some bad things here
        hour = `0${hour}`;
    }

    if (minute < 10) {
        // @ts-ignore: We do some bad things here
        minute = `0${minute}`;
    }

    return `${hour}:${minute} ${am_pm}`;
}