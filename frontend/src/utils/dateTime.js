//export const createDateTimeFormatter = () => {
//    try {
//        const locale = navigator?.language || 'en-US';
//        return new Intl.DateTimeFormat(locale, {
//            year: 'numeric', month: 'short', day: '2-digit',
//            hour: '2-digit', minute: '2-digit', second: '2-digit',
//            hour12: false, timeZoneName: 'short',
//        });
//    } catch {
//        return new Intl.DateTimeFormat('en-US', {
//            year: 'numeric', month: 'short', day: '2-digit',
//            hour: '2-digit', minute: '2-digit', second: '2-digit',
//            hour12: false, timeZoneName: 'short',
//        });
//    }
//};

//export const formatDateTime = (val, formatter) => {
//    try {
//        if (!val) return '-';
//        const d = val instanceof Date ? val : new Date(val);
//        if (Number.isNaN(d.getTime())) return '-';
//        return (formatter || createDateTimeFormatter()).format(d);
//    } catch {
//        return '-';
//    }
//};

//// Robust field resolvers for varying backend keys
//export const resolveTriggeredBy = (inc) => (
//    inc?.triggeredBy ?? inc?.reportedBy ?? inc?.raisedBy ?? inc?.createdBy ?? inc?.userName ?? inc?.name ?? ''
//);

//export const resolveStationName = (inc) => (
//    inc?.station?.name ?? inc?.stationName ?? inc?.station_name ?? inc?.station ?? inc?.locationName ?? ''
//);

//export const resolveStationLocation = (inc) => {
//    const value = inc?.location ?? inc?.Location ?? inc?.station?.location ?? inc?.station?.Location ??
//        inc?.locationName ?? inc?.LocationName ?? inc?.site ?? inc?.Site ?? inc?.area ?? inc?.Area ?? inc?.building ?? inc?.Building ?? '';
//    return value?.toString().trim();
//};


// src/utils/dateTime.js


// src/utils/dateTime.js
export const createDateTimeFormatter = () => {
    try {
        const locale = navigator?.language || 'en-US';
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZoneName: 'short',
        });
    } catch {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZoneName: 'short',
        });
    }
};

export const formatDateTime = (val, formatter) => {
    try {
        if (!val) return '-';
        const d = val instanceof Date ? val : new Date(val);
        if (Number.isNaN(d.getTime())) return '-';
        return (formatter || createDateTimeFormatter()).format(d);
    } catch {
        return '-';
    }
};

// Robust field resolvers for varying backend keys
export const resolveTriggeredBy = (inc) =>
    inc?.triggeredBy ??
    inc?.reportedBy ??
    inc?.raisedBy ??
    inc?.createdBy ??
    inc?.userName ??
    inc?.name ??
    '';

export const resolveStationName = (inc) =>
    inc?.station?.name ??
    inc?.stationName ??
    inc?.station_name ??
    inc?.station ??
    inc?.locationName ??
    '';

export const resolveStationLocation = (inc) => {
    const value =
        inc?.location ??
        inc?.Location ??
        inc?.station?.location ??
        inc?.station?.Location ??
        inc?.locationName ??
        inc?.LocationName ??
        inc?.site ??
        inc?.Site ??
        inc?.area ??
        inc?.Area ??
        inc?.building ??
        inc?.Building ??
        '';
    return value?.toString().trim();
};