import {
    byteArray2hexStr
} from './bytes';

export function bin2String(array) {
    // TODO Do we need this alias?
    return bytesToString(array);
}

export { byteArray2hexStr }

export function hexChar2byte(c) {
    let d;

    if (c >= 'A' && c <= 'F')
        d = c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
    else if (c >= 'a' && c <= 'f')
        d = c.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
    else if (c >= '0' && c <= '9')
        d = c.charCodeAt(0) - '0'.charCodeAt(0);

    if (typeof d === 'number')
        return d;
    else
        throw new Error('The passed hex char is not a valid hex char');
}

export function isHexChar(c) {
    if ((c >= 'A' && c <= 'F') ||
        (c >= 'a' && c <= 'f') ||
        (c >= '0' && c <= '9')) {
        return 1;
    }

    return 0;
}

export function hexStr2byteArray(str) {
    if (typeof str !== 'string')
        throw new Error('The passed string is not a string')

    const byteArray = Array();
    let d = 0;
    let j = 0;
    let k = 0;

    for (let i = 0; i < str.length; i++) {
        const c = str.charAt(i);

        if (isHexChar(c)) {
            d <<= 4;
            d += hexChar2byte(c);
            j++;

            if (0 === (j % 2)) {
                byteArray[k++] = d;
                d = 0;
            }
        } else
            throw new Error('The passed hex char is not a valid hex string')
    }

    return byteArray;
}
