/**
 * Converts a given DECIMAL number to its IEEE 754 Single Precision Floatng Point format IN BINARY
 * @param {number} num - The decimal number to convert
 * @returns {string} the resulting BINARY format of the conversion, space separated every 4 digits.
 */
function convertDec2BinFPSP(num: number) {
    if (Number.isNaN(num)) {
        return "0111 1111 1100 0000 0000 0000 0000 0000";
    } else if (num === Infinity) {
        return "0111 1111 1000 0000 0000 0000 0000 0000";
    } else if (num === -Infinity) {
        return "1111 1111 1000 0000 0000 0000 0000 0000";
    } else if (Object.is(0, num)) {
        return "0000 0000 0000 0000 0000 0000 0000 0000";
    } else if (Object.is(-0, num)) {
        return "1000 0000 0000 0000 0000 0000 0000 0000";
    }

    let signbit = num > 0 ? '0' : '1';

    // get number (absolute val) as binary string
    let rawNumBinStr = Number(Math.abs(num)).toString(2);

    // An intermediary step to make sure that the number
    // is actually normalized to 1
    let shift = 0;
    let binStrSplit, splitA, splitB;
    if (rawNumBinStr.startsWith('0')) {
        // set this temporarily here before 
        binStrSplit = rawNumBinStr.split('.');
        splitA = binStrSplit[0];
        splitB = binStrSplit.length > 1 ? binStrSplit[1] : '0';

        let shiftI = splitB.indexOf('1');
        // shiftI = shiftI > 126 ? 126 : shiftI; 
        splitA = '1';
        splitB = splitB.slice(shiftI + 1);
        shift = (shiftI + 1) * -1;
    } else {
        binStrSplit = rawNumBinStr.split('.');
        splitA = binStrSplit[0];
        splitB = binStrSplit.length > 1 ? binStrSplit[1] : '0';
    }

    // getting exponent
    let e = shift + splitA.length - 1;
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
        ePrimeBinStr = ePrimeDec.toString(2).padStart(8, '0').substring(0, 8);
    }

    // getting mantissa / significand
    let mantissa;
    if (specialState == 1) { // if infinity
        mantissa = ''.padStart(23, '0')
    } else if (specialState == 2) { // if denormalized: shift right by the exponent deficit
        const deficit = 1 - ePrimeDec; // see how far below the minimum normal exponent (-126) we are
        const leadingZeros = Math.max(deficit - 1, 0);
        mantissa = ''.padStart(leadingZeros, '0').concat('1').concat(splitB);
        mantissa = mantissa.padEnd(23, "0");
        mantissa = mantissa.substring(0, 23);
    } else {
        mantissa = splitA.slice(1, splitA.length);
        if (splitB) {
            mantissa = mantissa.concat(splitB)
        }
        mantissa = mantissa.padEnd(23, "0")

        // important for denormalized, but will also just keep 
        // in case a mantissa does keep going for a normal number
        mantissa = mantissa.substring(0, 23)
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

/**
 * Converts a given DECIMAL number to its IEEE 754 Single Precision Floatng Point format IN HEX.
 * This is basically the previous function, just converting the binary to hex.
 * @param {number} num - The decimal number to convert
 * @returns {string} the resulting HEX format of the conversion, space separated every 4 digits.
 */
function convertDec2HexFPSP(num: number) {
    if (Number.isNaN(num)) {
        return "7FC00000";
    } else if (num === Infinity) {
        return "7F800000";
    } else if (num === -Infinity) {
        return "FF800000";
    } else if (Object.is(0, num)) {
        return "00000000";
    } else if (Object.is(-0, num)) {
        return "80000000";
    }

    let signbit = num > 0 ? '0' : '1';

    // get number (absolute val) as binary string
    let rawNumBinStr = Number(Math.abs(num)).toString(2);

    // An intermediary step to make sure that the number
    // is actually normalized to 1
    let shift = 0;
    let binStrSplit, splitA, splitB;
    if (rawNumBinStr.startsWith('0')) {
        // set this temporarily here before 
        binStrSplit = rawNumBinStr.split('.');
        splitA = binStrSplit[0];
        splitB = binStrSplit.length > 1 ? binStrSplit[1] : '0';

        let shiftI = splitB.indexOf('1');
        // shiftI = shiftI > 126 ? 126 : shiftI;
        splitA = '1';
        splitB = splitB.slice(shiftI + 1);
        shift = (shiftI + 1) * -1;
    } else {
        binStrSplit = rawNumBinStr.split('.');
        splitA = binStrSplit[0];
        splitB = binStrSplit.length > 1 ? binStrSplit[1] : '0';
    }

    // getting exponent
    let e = shift + splitA.length - 1;
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
        ePrimeBinStr = ePrimeDec.toString(2).padStart(8, '0').substring(0, 8);
    }

    // getting mantissa / significand
    let mantissa;
    if (specialState == 1) { // if infinity
        mantissa = ''.padStart(23, '0')
    } else if (specialState == 2) { // if denormalized: shift right by the exponent deficit
        const deficit = 1 - ePrimeDec;
        const leadingZeros = Math.max(deficit - 1, 0);
        mantissa = ''.padStart(leadingZeros, '0').concat('1').concat(splitB);
        mantissa = mantissa.padEnd(23, "0");
        mantissa = mantissa.substring(0, 23);   
    } else {
        mantissa = splitA.slice(1, splitA.length);
        if (splitB) {
            mantissa = mantissa.concat(splitB)
        }
        mantissa = mantissa.padEnd(23, "0")

        // important for denormalized, but will also just keep 
        // in case a mantissa does keep going for a normal number
        mantissa = mantissa.substring(0, 23)
    }

    // formatting the number (as hex)
    let binNum = signbit.concat(ePrimeBinStr).concat(mantissa);
    let splitBinNum = binNum.match(/.{1,4}/g) || [];
    let hexNum = ''
    for (let x of splitBinNum) {
        let binDigits = Number('0b'.concat(x))
        hexNum += binDigits.toString(16).toUpperCase()
    }

    return hexNum.trim();
}

// note: moved rounding.ts functions here to keep all operation functions in one file

/**
 * Helper function to add 1 to the Least Significant Digit/Bit of a string magnitude.
 * Handles the carry-over logic for both binary and decimal bases.
 */
function addOneToMagnitude(magStr: string, isBinary: boolean): string {
    let result = '';
    let carry = 1;
    const base = isBinary ? 2 : 10;

    for (let i = magStr.length - 1; i >= 0; i--) {
        if (magStr[i] === '.') {
            result = '.' + result;
            continue;
        }
        let digit = parseInt(magStr[i], base) + carry;
        if (digit >= base) {
            digit = 0;
            carry = 1;
        } else {
            carry = 0;
        }
        result = digit.toString(base) + result;
    }

    // if carry is still left after the most significant bit/digit
    if (carry > 0) {
        result = '1' + result;
    }
    return result;
}

/**
 * Demonstrates the four rounding methods based on IEEE 754 specifications.
 * @param {string} inputNum The input number as a string
 * @param {boolean} isBinary True if the input is binary, False if decimal
 * @param {number} targetDigits The TOTAL number of significant digits/bits to keep,
 *                               including the integer part (e.g. the leading "1" of a
 *                               normalized mantissa like "1.xxxx").
 * @returns {object} An object containing the 4 rounded formats
 */
function demonstrateRoundingMethods(inputNum: string, isBinary: boolean, targetDigits: number) {
    // Handles Sign
    const isNegative = inputNum.startsWith('-');
    const signStr = isNegative ? '-' : '';
    let magnitude = isNegative ? inputNum.substring(1) : inputNum;

    // Ensure decimal point exists for easier parsing
    if (!magnitude.includes('.')) {
        magnitude += '.';
    }

    const [intPart, fracPart] = magnitude.split('.');

    // NOTE: "targetDigits" is the TOTAL significant-digit 
    // The integer part always costs intPart.length digits out of that budget
    const targetFractionDigits = Math.max(0, targetDigits - intPart.length);

    // If the number already fits the target, return it as is
    if (fracPart.length <= targetFractionDigits) {
        const paddedFrac = fracPart.padEnd(targetFractionDigits, '0');
        const formattedResult = targetFractionDigits > 0 ? `${signStr}${intPart}.${paddedFrac}` : `${signStr}${intPart}`;
        return {
            chopping: formattedResult,
            roundUp: formattedResult,
            roundDown: formattedResult,
            tiesToEven: formattedResult
        };
    }

    // Extract kept portion and the remainder (for Round and Sticky calculations)
    const keptFrac = fracPart.substring(0, targetFractionDigits);
    const remainder = fracPart.substring(targetFractionDigits);

    const magTruncated = targetFractionDigits > 0 ? `${intPart}.${keptFrac}` : intPart;
    // added: addOneToMagnitude to handle the carry addition when rounding up
    const magRoundedUp = addOneToMagnitude(magTruncated, isBinary);

    // Calculate Guard, Round, and Sticky conditions
    const R = parseInt(remainder[0], isBinary ? 2 : 10);
    // Sticky is true if ANY digit after R is non-zero
    const S = remainder.substring(1).match(/[1-9]/) ? 1 : 0;
    const hasRemainder = R > 0 || S > 0;

    // Apply Rounding Logic Based on Magnitude

    // Chopping (Truncation): Always moves toward zero
    const resChopping = `${signStr}${magTruncated}`;

    // Round Up (Toward +Infinity)
    let resRoundUp: string;
    if (!isNegative && hasRemainder) {
        resRoundUp = `${signStr}${magRoundedUp}`;
    } else {
        resRoundUp = `${signStr}${magTruncated}`;
    }

    // Round Down (Toward -Infinity)
    let resRoundDown: string;
    if (isNegative && hasRemainder) {
        resRoundDown = `${signStr}${magRoundedUp}`;
    } else {
        resRoundDown = `${signStr}${magTruncated}`;
    }

    // Round to Nearest, Ties to Even
    let resTiesToEven: string;
    const midpoint = isBinary ? 1 : 5; // The halfway point depends on the base

    let roundMagnitudeUp = false;

    if (R > midpoint || (R === midpoint && S > 0)) {
        // Above midpoint to Round Up Magnitude
        roundMagnitudeUp = true;
    } else if (R < midpoint) {
        // Below midpoint to Truncate Magnitude
        roundMagnitudeUp = false;
    } else {
        // EXACT Tie R == midpoint and S == 0 and Check LSB of the truncated magnitude
        const lsbStr = magTruncated.charAt(magTruncated.length - 1);
        const lsb = lsbStr === '.' ? parseInt(magTruncated.charAt(magTruncated.length - 2), isBinary ? 2 : 10) : parseInt(lsbStr, isBinary ? 2 : 10);

        // If LSB is odd, round up magnitude to make it even
        if (lsb % 2 !== 0) {
            roundMagnitudeUp = true;
        }
    }

    if (roundMagnitudeUp) {
        resTiesToEven = `${signStr}${magRoundedUp}`;
    } else {
        resTiesToEven = `${signStr}${magTruncated}`;
    }

    // Return the final formatted object
    return {
        chopping: resChopping,
        roundUp: resRoundUp,
        roundDown: resRoundDown,
        tiesToEven: resTiesToEven
    };
}

/**
 * Helper to convert input (Decimal or 8-digit IEEE Hex) to 32-bit binary string
 * @param {string} input The input number as a string
 * @returns {string} The 32-bit binary representation of the input
 */
function getBin32(input: string): string {
    const clean = input.trim();
    if (/^[0-9a-fA-F]{8}$/.test(clean)) {
        return parseInt(clean, 16).toString(2).padStart(32, '0');
    }
    const num = parseFloat(clean);
    return convertDec2BinFPSP(num).replace(/\s+/g, '');
}

/**
 * Formats binary bitstring into space-separated field notation: S EEEEEEEE MMMMMMMMMMMMMMMMMMMMMMM
 * @param {string} bin32 - The binary string to format
 * @returns {string} The formatted binary string
 */
function formatBinFields(bin32: string): string {
    return `${bin32[0]} ${bin32.substring(1, 9)} ${bin32.substring(9, 32)}`;
}

/**
 * Converts 32-bit binary string into float number
 * @param {string} bin32 - The binary string to convert
 * @returns {number} The float representation of the binary string
 */
function binary32ToFloat(bin32: string): number {
    const uint32 = parseInt(bin32, 2);
    return new Float32Array(new Uint32Array([uint32]).buffer)[0];
}

/**
 * Builds standard output object for arithmetic operation results.
 * @param {string} bin32 - The binary string to format
 * @param {string} hex - The hexadecimal string to format
 * @param {string} decimal - The decimal string to format
 * @param {string[]} steps - The steps to format
 * @returns {object} The formatted output object
 */
function formatOutput(bin32: string, hex: string, decimal: string, steps: string[]) {
    const binFields = formatBinFields(bin32);
    const binSpaced4 = bin32.match(/.{1,4}/g)!.join(' ');

    steps.push(`\n=== FINAL RESULT ===`);
    steps.push(`i) Binary:      ${binFields}`);
    steps.push(`ii) Hexadecimal: 0x${hex}`);
    steps.push(`iii) Decimal:    ${decimal}`);

    return {
        binary: binFields,
        binarySpaced4: binSpaced4,
        hex: hex,
        decimal: decimal,
        steps: steps
    };
}

/**
 * Performs IEEE 754 Single Precision Addition or Multiplication using rounding methods.
 * @param {string} operandA Decimal or IEEE Hex operand
 * @param {string} operandB Decimal or IEEE Hex operand
 * @param {string} operation "addition" | "add" | "+" or "multiplication" | "multiply" | "*"
 * @param {string} roundingMode "tiesToEven" | "chopping" | "roundUp" | "roundDown"
 */
function performOperation(operandA: string, operandB: string, operation: string, roundingMode: 'tiesToEven' | 'chopping' | 'roundUp' | 'roundDown' = 'tiesToEven') {
    const steps: string[] = [];

    //parse inputs into 32-bit binary
    const binA = getBin32(operandA);
    const binB = getBin32(operandB);

    const sA = binA[0], eA = parseInt(binA.substring(1, 9), 2), mA = binA.substring(9, 32);
    const sB = binB[0], eB = parseInt(binB.substring(1, 9), 2), mB = binB.substring(9, 32);

    const sigA = (eA === 0 ? '0' : '1') + mA;
    const sigB = (eB === 0 ? '0' : '1') + mB;

    // format output header
    steps.push(`=== IEEE 754 Operation (${operation}) ===`);
    steps.push(`Operand A (${operandA}): ${formatBinFields(binA)} | Hex: 0x${convertDec2HexFPSP(binary32ToFloat(binA))}`);
    steps.push(`Operand B (${operandB}): ${formatBinFields(binB)} | Hex: 0x${convertDec2HexFPSP(binary32ToFloat(binB))}`);

    const isAdd = operation.toLowerCase().includes('add') || operation === '+';
    let resSign = '0';
    let resExp = 0;
    let rawSigStr = '';

    // check for nan special cases
    if ((eA === 255 && mA !== '0'.repeat(23)) || (eB === 255 && mB !== '0'.repeat(23))) {
        steps.push(`Special Case: NaN operand input.`);
        return formatOutput("01111111110000000000000000000000", "7FC00000", "NaN", steps);
    }

    if (isAdd) {
        steps.push(`\n--- Step 1: Addition ---`);

        // check for infinity special cases in addition
        if (eA === 255 || eB === 255) {
            if (eA === 255 && eB === 255 && sA !== sB) {
                steps.push(`Special Case: (+Infinity) + (-Infinity) = NaN`);
                return formatOutput("01111111110000000000000000000000", "7FC00000", "NaN", steps);
            }
            const infBin = eA === 255 ? binA : binB;
            steps.push(`Special Case: Infinity Result`);
            return formatOutput(infBin, convertDec2HexFPSP(binary32ToFloat(infBin)), infBin[0] === '1' ? "-Infinity" : "Infinity", steps);
        }

        // align exponents by shifting smaller significand right
        const diff = eA - eB;
        let shiftA = sigA, shiftB = sigB;

        if (diff > 0) {
            steps.push(`Exponent Difference: ${diff}. Shifting B right by ${diff} bits.`);
            shiftB = shiftB.padStart(24 + diff, '0').substring(0, 24);
            resExp = eA;
        } else if (diff < 0) {
            steps.push(`Exponent Difference: ${-diff}. Shifting A right by ${-diff} bits.`);
            shiftA = shiftA.padStart(24 - diff, '0').substring(0, 24);
            resExp = eB;
        } else {
            resExp = eA;
        }

        // add or subtract significands based on signs
        const valA = BigInt('0b' + shiftA);
        const valB = BigInt('0b' + shiftB);
        let resVal = 0n;

        if (sA === sB) {
            resSign = sA;
            resVal = valA + valB;
            steps.push(`Adding Significands: ${shiftA} + ${shiftB} = ${resVal.toString(2)}`);
        } else {
            if (valA >= valB) {
                resSign = sA;
                resVal = valA - valB;
            } else {
                resSign = sB;
                resVal = valB - valA;
            }
            steps.push(`Subtracting Significands: |${shiftA} - ${shiftB}| = ${resVal.toString(2)}`);
        }

        if (resVal === 0n) {
            steps.push(`Result is Zero`);
            return formatOutput("00000000000000000000000000000000", "00000000", "0", steps);
        }

        // normalize significand and update exponent
        let binRes = resVal.toString(2);
        if (sA === sB && binRes.length > 24) {
            steps.push(`Carry Overflow: Shift right 1 bit and increment exponent to ${resExp + 1}`);
            resExp += 1;
            rawSigStr = `${binRes[0]}.${binRes.substring(1)}`;
        } else {
            binRes = binRes.padStart(24, '0');
            const leadingIdx = binRes.indexOf('1');
            if (leadingIdx > 0) {
                steps.push(`Normalization: Shift left ${leadingIdx} bits, decrement exponent to ${resExp - leadingIdx}`);
                resExp -= leadingIdx;
                binRes = binRes.substring(leadingIdx).padEnd(24, '0');
            }
            rawSigStr = `${binRes[0]}.${binRes.substring(1)}`;
        }
    } else {
        steps.push(`\n--- Step 1: Multiplication ---`);
        resSign = sA !== sB ? '1' : '0';

        // check for zero and infinity special cases in multiplication
        if ((eA === 0 && mA === '0'.repeat(23) && eB === 255) || (eB === 0 && mB === '0'.repeat(23) && eA === 255)) {
            steps.push(`Special Case: 0 * Infinity = NaN`);
            return formatOutput("01111111110000000000000000000000", "7FC00000", "NaN", steps);
        }
        if (eA === 255 || eB === 255) {
            const infBin = resSign + '11111111' + '0'.repeat(23);
            steps.push(`Special Case: Multiplication with Infinity`);
            return formatOutput(infBin, convertDec2HexFPSP(binary32ToFloat(infBin)), resSign === '1' ? "-Infinity" : "Infinity", steps);
        }
        if ((eA === 0 && mA === '0'.repeat(23)) || (eB === 0 && mB === '0'.repeat(23))) {
            const zeroBin = resSign + '00000000' + '0'.repeat(23);
            steps.push(`Special Case: Multiplication with Zero`);
            return formatOutput(zeroBin, convertDec2HexFPSP(binary32ToFloat(zeroBin)), resSign === '1' ? "-0" : "0", steps);
        }

        // calculate biased exponent for multiplication (E_A + E_B - 127)
        const expA_actual = eA === 0 ? 1 : eA;
        const expB_actual = eB === 0 ? 1 : eB;
        resExp = expA_actual + expB_actual - 127;
        steps.push(`Exponents: ${expA_actual} + ${expB_actual} - 127 = ${resExp}`);

        // multiply 24-bit significands
        const valA = BigInt('0b' + sigA);
        const valB = BigInt('0b' + sigB);
        const prod = (valA * valB).toString(2).padStart(48, '0');
        steps.push(`Product of Significands: ${sigA} * ${sigB} = ${prod}`);

        if (prod[0] === '1') {
            resExp += 1;
            rawSigStr = `${prod[0]}.${prod.substring(1)}`;
            steps.push(`Normalized Product (Shift Right 1): ${rawSigStr}, Exponent = ${resExp}`);
        } else {
            rawSigStr = `${prod[1]}.${prod.substring(2)}`;
            steps.push(`Normalized Product: ${rawSigStr}, Exponent = ${resExp}`);
        }
    }

    // apply chosen rounding mode using demonstrateRoundingMethods
    steps.push(`\n--- Step 2: Apply Rounding (${roundingMode}) ---`);
    const signedSigStr = (resSign === '1' ? '-' : '') + rawSigStr;
    const roundedObj = demonstrateRoundingMethods(signedSigStr, true, 23);
    const chosenSig = roundedObj[roundingMode] || roundedObj.tiesToEven;
    steps.push(`Rounded Significand: ${chosenSig}`);

    const unsignedSig = chosenSig.replace('-', '');
    const [intPart, fracPart] = unsignedSig.split('.');
    let finalMantissa = (fracPart || '').padEnd(23, '0').substring(0, 23);

    // handle carry overflow if rounding incremented integer part
    if (intPart.length > 1) {
        resExp += intPart.length - 1;
        const combined = intPart + (fracPart || '');
        finalMantissa = combined.substring(1, 24).padEnd(23, '0');
        steps.push(`Rounding Overflow: Exponent updated to ${resExp}`);
    }

    // check exponent overflow / underflow bounds
    if (resExp >= 255) {
        steps.push(`Exponent Overflow! Result is Infinity`);
        const infBin = resSign + '11111111' + '0'.repeat(23);
        return formatOutput(infBin, convertDec2HexFPSP(binary32ToFloat(infBin)), resSign === '1' ? "-Infinity" : "Infinity", steps);
    }
    if (resExp <= 0) {
        steps.push(`Exponent Underflow! Result is Zero`);
        const zeroBin = resSign + '00000000' + '0'.repeat(23);
        return formatOutput(zeroBin, convertDec2HexFPSP(binary32ToFloat(zeroBin)), resSign === '1' ? "-0" : "0", steps);
    }

    const expBits = resExp.toString(2).padStart(8, '0');
    const finalBin32 = resSign + expBits + finalMantissa;
    const finalDec = binary32ToFloat(finalBin32);

    return formatOutput(finalBin32, convertDec2HexFPSP(finalDec), finalDec.toString(), steps);
}

export {
    convertDec2BinFPSP,
    convertDec2HexFPSP,
    addOneToMagnitude,
    demonstrateRoundingMethods,
    performOperation
}
