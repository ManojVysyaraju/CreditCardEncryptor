function enc() {
    const inputEle = document.getElementById('ccn');
    const value = inputEle.value;
    const output = encrypt_credit_card(value);
    const outputEle = document.getElementById('occn');
    if (validate(value)) {
        outputEle.textContent = output;
    } else {
        outputEle.textContent = '';
    }
}
function dec() {
    const inputEle = document.getElementById('eccn');
    const value = inputEle.value;
    const output = decrypt_credit_card(value);
    const outputEle = document.getElementById('oeccn');
    if (validate(value)) {
        outputEle.textContent = output;
    } else {
        outputEle.textContent = '';
    }
}
function validate(val) {
    if(val.length!=16){
        alert('Credit card should have 16 digits');
        return false;
    }
    for (const char of val) {
        if(isNaN(Number(char))){
            alert('Credit Card should only have numbers 0-9')
            return false;
        }
    }
    return true;
}