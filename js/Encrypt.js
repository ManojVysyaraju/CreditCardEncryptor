/**
 * @author Manoj Vysyaraju<vysyarajusaimanoj@outlook.com>
 */
const _log = []; //variable used to store logs while doing encryption or decryption.
const _ccMax = 1000000; // upper limit of the data part in credit card number.
const _ccMask = '00000000000000000000'; // mask to generate 20 bit credit card  data.

/////////////////////////////////
/// Function used to encrypt credit card number
/// it dervies credit card number into its sub parts and create tweak data
/// input is credit card number
/// output is encrypted credit card
/////////////////////////////////
function encrypt_credit_card(ccn) {
    // Split credit card into Issuer Identification Number, Transaction Identification Number
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
    // add tweak to the data
    _log.push(`Issuer Identification Number: ${spanit(pre)}</br>Data to be encrypted:${spanit(data)}</br>Transaction Identification Number:${spanit(post)}`);
    _log.push(`Number to be encrypted: ${spanit(data)}`);
    _log.push(`Tweak: ${spanit(tweak)}`);
    let tweakedData = (dataInNumber + tweakInNumber) % _ccMax;
    _log.push(`Tweaked Number: ${spanit(tweakedData)}`);

    // preform encryption
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
    } while (encryptedNumber >= _ccMax);// encrypt untill the format is preserved

    // return the encrypted creditcard number
    return pre + '' + convert(encryptedNumber, 10, 10, '000000') + post;
}

/////////////////////////////////
/// Function used to decrypt credit card number
/// it dervies credit card number into its sub parts and creates tweaked data
/// input is encrypted credit card number
/// output is decrypted credit card number
/////////////////////////////////
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
    
    // preform decryption
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
    } while (decryptedNumber >= _ccMax);// decrypt untill the format is preserved
    const tweakInNumber = Number(tweak);
    const unTweakedData = (decryptedNumber - tweakInNumber + _ccMax) % _ccMax;
    _log.push(`un-tweaked Number: ${spanit(unTweakedData)}`);
    
    // return the decrypted creditcard number
    return pre + '' + convert(unTweakedData, 10, 10, '000000') + post;
}

/////////////////////////////////
/// Function used to encrypt/decrypt bits using fiestal network
/// Bits: bits needed to be encrypted or decrypted
/// isEncryption: determines if the bits are to be encrypted or decrypted. true: Encrypt, false: decrypt
/// logging: prints logs if set to true
/////////////////////////////////
function fpe_encrypt(bits, isEncryption, logging = true) {
    const keySequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    if (!isEncryption) {
        keySequence.reverse();
    }
    const bitArray = bits.split('');
    let left = bitArray.slice(0, 10);
    let right = bitArray.slice(10);
    let i = 1;
    logging && _log.push({ round: spanit(convert(0, 10, 10, '00')), leftblock: spanit(left.join('')), rightblock: spanit(right.join('')) });
    for (const key of keySequence) {
        const logObj = {};
        logObj['round'] = spanit(convert(i, 10, 10, '00'));
        logObj['key'] = spanit(_subKeys[key].join(''));
        const fOutput = special_creditcard_psuedorandomgenrator([...right], _subKeys[key], logObj);
        const right2 = bitwise_xor(fOutput, left);
        left = [...right];
        right = [...right2];
        logObj['leftblock'] = spanit(left.join(''));
        logObj['rightblock'] = spanit(right.join(''));
        logging && _log.push(logObj);
        i++;
    }
    const output = [...right, ...left];
    logging && _log.push(`final ${isEncryption?'encrypted data':'decrypted data'}: ${spanit(output.join(''))}`);
    return output.join('');
}
