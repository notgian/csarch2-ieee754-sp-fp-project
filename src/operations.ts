/**
 * Converts a given DECIMAL number to its IEEE 754 Single Precision Floatng Point format IN BINARY
 * @param {number} num - The decimal number to convert
 * @returns {string} the resulting BINARY format of the conversion, space separated every 4 digits.
 */
function convertDec2BinFPSP(num: number) {
    let signbit;
    
    // ensuring +/- zero is captured
    if (num > 0 || Object.is(0, num))
        signbit = '0';
    else if (num < 0 || Object.is(-0, num))
        signbit = '1';
    else 
        throw Error('Could not obtain the sign bit. Perhaps there is something wrong with the number input?')

    // get number (absolute val) as binary string
    let rawNumBinStr = Number(Math.abs(num)).toString(2);

    // getting exponent
    let binStrSplit = rawNumBinStr.split('.');
    let splitA = binStrSplit[0];
    let splitB = binStrSplit.length > 1 ? binStrSplit[1] : undefined;

    let e = splitA.length - 1;
    let ePrimeDec = e + 127;
    
    let ePrimeBinStr;

    // switch for denoting 
    //  normal = 0
    //  infinity = 1
    //  denormalized = 2
    let specialState = 0;
    
    // Handling potentally infinity or denormalized
    // for exponent field
    if (ePrimeDec >= 255) {
        ePrimeBinStr = '11111111';
        specialState = 1;
        console.log('INF')
    } else if (ePrimeDec <= 0) {
        ePrimeBinStr = '00000000';
        specialState = 2;
        console.log('DN')
    } else {
        ePrimeBinStr = ePrimeDec.toString(2).padStart(8, '0').substring(0,8);
    }
    
    // getting mantissa / significand
    let mantissa;
    if (specialState == 1) { // if infinity
        mantissa = ''.padStart(23, '0')
    } else {
        mantissa = splitA.slice(1, splitA.length);
        if (splitB) {
            mantissa = mantissa.concat(splitB)
        }
        mantissa = mantissa.padEnd(23, "0")

        // important for denormalized, but will also just keep 
        // in case a mantissa does keep going for a normal number
        mantissa = mantissa.substring(0,23)
    }
    
    // formatting the number
    let binNum = signbit.concat(ePrimeBinStr).concat(mantissa);
    let splitBinNum = binNum.match(/.{1,4}/g) || [];
    let binNumSep = ''
    for (let x of splitBinNum) {
        binNumSep += x.concat(' ')
    }

    return binNumSep.trim();
}

export default convertDec2BinFPSP
