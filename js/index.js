/**
 * @author Manoj Vysyaraju<vysyarajusaimanoj@outlook.com>
 */
function enc() {
    const inputEle = document.getElementById('ccn');
    const value = inputEle.value;
    const output = encrypt_credit_card(value);
    const outputEle = document.getElementById('occn');
    const logEle = document.getElementById('elog');
    const msg = validate(value);
    if (!msg) {
        outputEle.textContent = output;
        delayLog(logEle, _log);
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
        delayLog(logEle, _log);
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
function delayLog(ele, log) {
    Array.from(document.getElementsByTagName('button')).map(x => x.disabled = true);
    const l = [...log];
    l.reverse();
    ele.innerHTML = '';
    printLog(ele, l);
}
function printLog(ele, log) {
    const msg = log.pop();
    if (msg) {
        setTimeout(() => {
            ele.innerHTML += evalMsg(msg) + '<span class="br"></span>';
            const pres = Array.from(document.getElementsByTagName('pre'));
            pres.reverse();
            pres[0] && pres[0].scrollIntoView();
            printLog(ele, log);
        }, 100);
    }
    else {
        const buttons = Array.from(document.getElementsByTagName('button'));
        buttons.map(x => x.disabled = false);
        document.getElementById('key').scrollIntoView();
    }
}
function evalMsg(x) {
    if (typeof (x) == typeof ('')) {
        return x;
    } else {
        return _roundMask.replace('#left', x.leftblock)
            .replace('#round', x.round)
            .replace('#right', x.rightblock)
            .replace('#key', x.key ? 'key: ' + x.key : '');
    }
}
const _roundMask = `
<pre>
-----------------------------ROUND #round-----------------------------
#key
left: #left   right:#right
-------------------------------------------------------------------
</pre>
`;