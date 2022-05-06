export function deserializeDates(data: string): any {
    return JSON.parse(data, reviveDateTime);
}

const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3}\w)?$/
function reviveDateTime(key: any, value: any): any {
    if (typeof value === 'string') {
        if (dateRegex.test(value)) {
            return new Date(value);
        }
    }

    return value;
}