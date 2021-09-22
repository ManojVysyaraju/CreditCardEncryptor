function enc() {
    const inputEle = document.getElementById('ccn');
    const value = inputEle.value;
    const output = encrypt_credit_card(value);
    const outputEle = document.getElementById('occn');
    const logEle = document.getElementById('elog');
    const msg = validate(value);
    if (!msg) {
        outputEle.textContent = output;
        logEle.innerHTML = _log.join('<span class="br"></span>');
    } else {
        outputEle.textContent = '';
        logEle.textContent = msg;
    }
}
function dec() {
    const inputEle = document.getElementById('eccn');
    const value = inputEle.value;
    const output = decrypt_credit_card(value);
    const outputEle = document.getElementById('oeccn');
    const logEle = document.getElementById('dlog');
    const msg = validate(value);
    if (!msg) {
        outputEle.textContent = output;
        logEle.innerHTML = _log.join('<span class="br"></span>');
    } else {
        outputEle.textContent = '';
        logEle.textContent = msg;
    }
}
function validate(val) {
    if (val.length != 16) {
        return 'Credit card should have 16 digits';

    }
    for (const char of val) {
        if (isNaN(Number(char))) {
            return 'Credit Card should only have numbers 0-9';
        }
    }
    return '';
}