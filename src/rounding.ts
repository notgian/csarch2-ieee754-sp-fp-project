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
    
    // If carry is still left after the most significant bit/digit
    if (carry > 0) {
        result = '1' + result;
    }
    return result;
}

/**
 * Demonstrates the four rounding methods based on IEEE 754 specifications.
 * @param {string} inputNum The input number as a string 
 * @param {boolean} isBinary True if the input is binary, False if decimal
 * @param {number} targetFractionDigits The number of fractional digits/bits to round to
 * @returns {object} An object containing the 4 rounded formats
 */
function demonstrateRoundingMethods(inputNum: string, isBinary: boolean, targetFractionDigits: number) {
    // Handles Sign
    const isNegative = inputNum.startsWith('-');
    const signStr = isNegative ? '-' : '';
    let magnitude = isNegative ? inputNum.substring(1) : inputNum;

    // Ensure decimal point exists for easier parsing
    if (!magnitude.includes('.')) {
        magnitude += '.';
    }

    const [intPart, fracPart] = magnitude.split('.');
    
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

export {
    demonstrateRoundingMethods
}