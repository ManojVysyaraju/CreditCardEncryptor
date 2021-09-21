const ipVector = {
    1: 58,
    2: 50,
    3: 42,
    4: 34,
    5: 26,
    6: 18,
    7: 10,
    8: 2,
    9: 60,
    10: 52,
    11: 44,
    12: 36,
    13: 28,
    14: 20,
    15: 12,
    16: 4,
    17: 62,
    18: 54,
    19: 46,
    20: 38,
    21: 30,
    22: 22,
    23: 14,
    24: 6,
    25: 64,
    26: 56,
    27: 48,
    28: 40,
    29: 32,
    30: 24,
    31: 16,
    32: 8,
    33: 57,
    34: 49,
    35: 41,
    36: 33,
    37: 25,
    38: 17,
    39: 9,
    40: 1,
    41: 59,
    42: 51,
    43: 43,
    44: 35,
    45: 27,
    46: 19,
    47: 11,
    48: 3,
    49: 61,
    50: 53,
    51: 45,
    52: 37,
    53: 29,
    54: 21,
    55: 13,
    56: 5,
    57: 63,
    58: 55,
    59: 47,
    60: 39,
    61: 31,
    62: 23,
    63: 15,
    64: 7,
}

const _ccMax = 1000000;
const _ccMask = '00000000000000000000';
function encrypt_credit_card(ccn) {
    const creditCardNumber = ccn.toString();
    const ccArray = creditCardNumber.split('');
    let data = '';
    let tweak = '';
    let pre = '';
    let post = '';
    for (let index = 0; index < ccArray.length; index++) {
        if (index > 5 && index < 12) {
            data += ccArray[index];
        }
        if (index < 2 || index >= 12) {
            tweak += ccArray[index];
        }
        if (index <= 5) {
            pre += ccArray[index]
        }
        if (index >= 12) {
            post += ccArray[index]
        }
    }
    const dataInNumber = Number(data);
    const tweakInNumber = Number(tweak);
    const tweakedData = (dataInNumber + tweakInNumber) % _ccMax;
    const tweakedDataInBits = convert(tweakedData, 10, 2, _ccMask);;
    let encryptedData = '';
    let encryptedNumber;
    do {
        encryptedData = fpe_encrypt(tweakedDataInBits, true);
        encryptedNumber = convert(encryptedData, 2, 10, '000000');
    } while (encryptedNumber >= _ccMax);

    return pre + '' + encryptedNumber + post;
}
function decrypt_credit_card(ccn) {
    const creditCardNumber = ccn.toString();
    const ccArray = creditCardNumber.split('');
    let data = '';
    let tweak = '';
    let pre = '';
    let post = '';
    for (let index = 0; index < ccArray.length; index++) {
        if (index > 5 && index < 12) {
            data += ccArray[index];
        }
        if (index < 2 || index >= 12) {
            tweak += ccArray[index];
        }
        if (index <= 5) {
            pre += ccArray[index]
        }
        if (index >= 12) {
            post += ccArray[index]
        }
    }
    const dataInNumber = Number(data);
    const dataInBits = convert(dataInNumber, 10, 2, _ccMask);
    let encryptedData = '';
    let encryptedNumber;
    do {
        encryptedData = fpe_encrypt(dataInBits, false);
        encryptedNumber = convert(encryptedData, 2, 10, '000000');
    } while (encryptedNumber > _ccMax);
    const tweakInNumber = Number(tweak);
    const tweakedData = (encryptedNumber - tweakInNumber + _ccMax) % _ccMax;

    return pre + '' + ('000000' + tweakedData).substr(-6) + post;
}

function fpe_encrypt(bits, isEncryption) {
    const keySequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    if (!isEncryption) {
        keySequence.reverse();
    }
    const bitArray = bits.split('');
    let left = bitArray.slice(0, 10);
    let right = bitArray.slice(10);
    for (const key of keySequence) {
        console.log(left.join(''), right.join(''), left.join('') == right.join(''));
        const fOutput = special_creditcard_psuedorandomgenrator([...right], _subKeys[key]);
        const right2 = bitwise_xor(fOutput, left);
        left = [...right];
        right = [...right2];
    }

    return [...right, ...left].join('');
}
