/**
 * @author Manoj Vysyaraju<vysyarajusaimanoj@outlook.com>
 */
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
    _log.push(`Issuer Identification Number: ${spanit(pre)}</br>Data to be encrypted:${spanit(data)}</br>Transaction Identification Number:${spanit(post)}`);
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

    return pre + '' + convert(encryptedNumber, 10, 10, '000000') + post;
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
    _log.push(`Issuer Identification Number: ${spanit(pre)}</br>Data to be encrypted: ${spanit(data)}</br>Transaction Identification Number:${spanit(post)}`);
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
    return pre + '' + convert(unTweakedData, 10, 10, '000000') + post;
}

function fpe_encrypt(bits, isEncryption, logging = true) {
    const round_logs = [];
    const keySequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    if (!isEncryption) {
        keySequence.reverse();
    }
    const bitArray = bits.split('');
    let left = bitArray.slice(0, 10);
    let right = bitArray.slice(10);
    let i = 1;
    logging && round_logs.push({ round: spanit(convert(0, 10, 10, '00')), leftblock: spanit(left.join('')), rightblock: spanit(right.join('')) });
    for (const key of keySequence) {
        const fOutput = special_creditcard_psuedorandomgenrator([...right], _subKeys[key]);
        const right2 = bitwise_xor(fOutput, left);
        left = [...right];
        right = [...right2];
        logging && round_logs.push({ round: spanit(convert(i, 10, 10, '00')), key: spanit(_subKeys[key].join('')), leftblock: spanit(left.join('')), rightblock: spanit(right.join('')) });
        i++;
    }
    const output = [...right, ...left];
    _log.push(...round_logs);
    logging && _log.push(`final ${isEncryption?'encrypted data':'decrypted data'}: ${spanit(output.join(''))}`);
    return output.join('');
}
