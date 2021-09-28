/**
 * @author Manoj Vysyaraju<vysyarajusaimanoj@outlook.com>
 */

// function convert number from one base to other base and padd output based on the provided mask
function convert(data, from, to, mask = '') {
    return (mask + parseInt(data, from).toString(to)).substr(-mask.length);
}

//function to create a span tag out the value
function spanit(value) {
    return `<span class='log-value'>${value}</span>`;
}

// function to output fraction of 1's present in the data
function fractionOfOneBits(data) {
    return data.filter(x => x == 1).length / data.length;
}

// function to determine the fraction of matched bits between two binary arrays
function fractionOfMatchedBits(a, b) {
    let matched = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] == b[i]) {
            matched++;
        }
    }
    return matched / a.length;
}

// function perform bitwise xor operation between two binary arrays
function bitwise_xor(A, B) {
    const C = [];
    for (let index = 0; index < A.length; index++) {
        C.push(A[index] != B[index] ? 1 : 0);
    }
    return C;
}

// functon to group chunks from data based on chunksize
function getChunks(data, chunkSize) {
    const chunks = {};
    let chunk = 1;
    for (let i = 0; i < data.length; i += chunkSize) {
        chunks[chunk] = data.slice(i, i + chunkSize);
        chunk++
    }
    return chunks;
}

// function to left shit array based on shift value.
function leftShiftArray(arr, shift) {
    shift = shift || 0;
    return [...arr.slice(shift), ...arr.slice(0, shift)]
}

// test function to create lookup for all the possible credit cards.
const allEncryptions = [];
function getAllEncryptions() {
    allEncryptions.length = 0;
    const start = new Date();
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
    const end = new Date();
    console.log(start, end, (end.getTime() - start.getTime()) / 1000);
}