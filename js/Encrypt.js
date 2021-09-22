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
const _log = [];
const _ccMax = 1000000;
const _ccMask = '00000000000000000000';
function encrypt_credit_card(ccn) {
    _log.length = 0;
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
    _log.push(`predata: ${spanit(pre)} data:${spanit(data)} postdata:${spanit(post)}`);
    _log.push(`Number to be encrypted: ${spanit(data)}`);
    _log.push(`Tweak: ${spanit(tweak)}`);
    let tweakedData = (dataInNumber + tweakInNumber) % _ccMax;
    _log.push(`Tweaked Number: ${spanit(tweakedData)}`);
    let encryptedData = '';
    let encryptedNumber;
    do {
        let tweakedDataInBits = convert(tweakedData, 10, 2, _ccMask);
        _log.push(`Tweaked Data in Bits: ${spanit(tweakedDataInBits)}`);
        encryptedData = fpe_encrypt(tweakedDataInBits, true);
        _log.push(`fraction of 1's in encrypted data: ${spanit(fractionOfOneBits(encryptedData.split('')))}`);
        _log.push(`fraction of bits in encrypted data matched with input data: ${spanit(fractionOfMatchedBits(tweakedDataInBits, encryptedData))}`)
        encryptedNumber = convert(encryptedData, 2, 10);
        _log.push(`encrypted number: ${spanit(encryptedNumber)}`);
        if (encryptedNumber >= _ccMax) {
            _log.push(`as encrypted number is more than 6 digits, we encrypt again`);
            tweakedData = encryptedNumber;
        }
    } while (encryptedNumber >= _ccMax);

    return pre + '' + convert(encryptedNumber,10,10,'000000') + post;
}
function decrypt_credit_card(ccn) {
    _log.length = 0;
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
    _log.push(`predata: ${spanit(pre)} data:${spanit(data)} postdata:${spanit(post)}`);
    _log.push(`Number to be decrypted: ${spanit(data)}`);
    _log.push(`Tweak: ${spanit(tweak)}`);
    let dataInNumber = Number(data);
    let decryptedData = '';
    let decryptedNumber;
    do {
        let dataInBits = convert(dataInNumber, 10, 2, _ccMask);
        _log.push(`Data in Bits: ${spanit(dataInBits)}`);
        decryptedData = fpe_encrypt(dataInBits, false);
        decryptedNumber = convert(decryptedData, 2, 10);
        _log.push(`decrypted number: ${spanit(decryptedNumber)}`);
        if (decryptedNumber >= _ccMax) {
            _log.push(`as decrypted number is more than 6 digits, we decrypt again`);
            dataInNumber = decryptedNumber;
        }
    } while (decryptedNumber >= _ccMax);
    const tweakInNumber = Number(tweak);
    const unTweakedData = (decryptedNumber - tweakInNumber + _ccMax) % _ccMax;
    _log.push(`un-tweaked Number: ${spanit(unTweakedData)}`);
    return pre + '' + convert(unTweakedData,10,10,'000000') + post;
}

function fpe_encrypt(bits, isEncryption, logging=true) {
    const keySequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    if (!isEncryption) {
        keySequence.reverse();
    }
    const bitArray = bits.split('');
    let left = bitArray.slice(0, 10);
    let right = bitArray.slice(10);
    let i = 1;
    logging && _log.push(`round:${spanit(convert(0, 10, 10, '00'))} leftblock:${spanit(left.join(''))} rightblock:${spanit(right.join(''))}`);
    for (const key of keySequence) {
        const fOutput = special_creditcard_psuedorandomgenrator([...right], _subKeys[key]);
        const right2 = bitwise_xor(fOutput, left);
        left = [...right];
        right = [...right2];
        logging && _log.push(`round:${spanit(convert(i, 10, 10, '00'))} key:${spanit(_subKeys[key].join(''))} leftblock:${spanit(left.join(''))} rightblock:${spanit(right.join(''))}`);
        i++;
    }
    const output = [...right, ...left];
    logging && _log.push(`final round: ${spanit(output.join(''))}`);
    return output.join('');
}
function spanit(value) {
    return `<span class='log-value'>${value}</span>`;
}
function fractionOfOneBits(data) {
    return data.filter(x => x == 1).length / data.length;
}
function fractionOfMatchedBits(a, b) {
    let matched = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] == b[i]) {
            matched++;
        }
    }
    return matched / a.length;
}
const allEncryptions = [];
function getAllEncryptions() {
    allEncryptions.length = 0;
    for (let i = 0; i < _ccMax; i++) {
        let input = i;
        const enc_i = convert(i, 10, 2, _ccMask);
        let o = _ccMax;
        let enc_output = '';
        let iteration = 0;
        while (o >= _ccMax) {
            let enc_input = convert(input, 10, 2, _ccMask);
            enc_output = fpe_encrypt(enc_input, true, false);
            o = convert(enc_output, 2, 10);
            input = o;
            iteration++;
        }
        allEncryptions.push({
            input: i,
            inputbits: enc_i,
            outputbits: enc_output,
            outputnumber: o,
            iterations: iteration,
            fraction1: fractionOfOneBits(enc_output.split('')),
            fractionAB: fractionOfMatchedBits(enc_i, enc_output)
        });
    }
}
