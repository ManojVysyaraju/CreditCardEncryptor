let _keyBit64 = '';
const _subKeys = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
    13: [],
    14: [],
    15: [],
    16: []
};
const _keyHex64 = '73357638792F423F';
function GenerateMainKeyBits() {
    _keyBit64 = Array.from(_keyHex64).map(x=>convert(x,16,2,'0000')).join('');
}
function convert(data, from, to, mask = '') {
    return (mask + parseInt(data, from).toString(to)).substr(-mask.length);
}
const pc1Left = {
    1: 57,
    2: 49,
    3: 41,
    4: 33,
    5: 25,
    6: 17,
    7: 9,
    8: 1,
    9: 58,
    10: 50,
    11: 42,
    12: 34,
    13: 26,
    14: 18,
    15: 10,
    16: 2,
    17: 59,
    18: 51,
    19: 43,
    20: 35,
    21: 27,
    22: 19,
    23: 11,
    24: 3,
    25: 60,
    26: 52,
    27: 44,
    28: 36
};
const pc1Right = {
    1: 63,
    2: 55,
    3: 47,
    4: 39,
    5: 31,
    6: 23,
    7: 15,
    8: 7,
    9: 62,
    10: 54,
    11: 46,
    12: 38,
    13: 30,
    14: 22,
    15: 14,
    16: 6,
    17: 61,
    18: 53,
    19: 45,
    20: 37,
    21: 29,
    22: 21,
    23: 13,
    24: 5,
    25: 28,
    26: 20,
    27: 12,
    28: 4
};
const pc2 = {
    1: 14,
    2: 17,
    3: 11,
    4: 24,
    5: 1,
    6: 5,
    7: 3,
    8: 28,
    9: 15,
    10: 6,
    11: 21,
    12: 10,
    13: 23,
    14: 19,
    15: 12,
    16: 4,
    17: 26,
    18: 8,
    19: 16,
    20: 7,
    21: 27,
    22: 20,
    23: 13,
    24: 2,
    25: 41,
    26: 52,
    27: 31,
    28: 37,
    29: 47,
    30: 55,
    31: 30,
    32: 40,
    33: 51,
    34: 45,
    35: 33,
    36: 48,
    37: 44,
    38: 49,
    39: 39,
    40: 56,
    41: 34,
    42: 53,
    43: 46,
    44: 42,
    45: 50,
    46: 36,
    47: 29,
    48: 32
}
const BitRotationDetails = {
    1: 1,
    2: 1,
    3: 2,
    4: 2,
    5: 2,
    6: 2,
    7: 2,
    8: 2,
    9: 1,
    10: 2,
    11: 2,
    12: 2,
    13: 2,
    14: 2,
    15: 2,
    16: 1,
};
function GenerateSubKeys() {
    const pc1 = {
        leftArray: [],
        rightArray: []
    }
    const binKey56Array = _keyBit64.split('');
    // create PC -1 left
    for (const key in pc1Left) {
        const position = pc1Left[key] - 1;
        pc1.leftArray.push(binKey56Array[position]);
    }
    // create PC -1 Right
    for (const key in pc1Right) {
        const position = pc1Right[key] - 1;
        pc1.rightArray.push(binKey56Array[position]);
    }

    for (const round in BitRotationDetails) {
        const shift = BitRotationDetails[round];
        const subkey = _subKeys[round];
        //shift left and right pc-1 based on the round shift value
        pc1.leftArray = leftShiftArray(pc1.leftArray, shift);
        pc1.rightArray = leftShiftArray(pc1.rightArray, shift);
        //combine left and right array to form intermediate key array to input for PC-2
        const shiftedKeyArray = [...(pc1.leftArray), ...(pc1.rightArray)];
        for (const pc2key in pc2) {
            const subkeyPosition = pc2[pc2key] - 1;
            subkey.push(shiftedKeyArray[subkeyPosition]);
        }
    }

}

function leftShiftArray(arr, shift) {
    shift = shift || 0;
    return [...arr.slice(shift), ...arr.slice(0, shift)]
}

GenerateMainKeyBits();
GenerateSubKeys();