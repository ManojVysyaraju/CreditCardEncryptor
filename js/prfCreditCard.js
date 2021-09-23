const expansionDict = {
    1: 32,
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    7: 4,
    8: 5,
    9: 6,
    10: 7,
    11: 8,
    12: 9,
    13: 8,
    14: 9,
    15: 10,
    16: 11,
    17: 12,
    18: 13,
    19: 12,
    20: 13,
    21: 14,
    22: 15,
    23: 16,
    24: 17,
    25: 16,
    26: 17,
    27: 18,
    28: 19,
    29: 20,
    30: 21,
    31: 20,
    32: 21,
    33: 22,
    34: 23,
    35: 24,
    36: 25,
    37: 24,
    38: 25,
    39: 26,
    40: 27,
    41: 28,
    42: 29,
    43: 28,
    44: 29,
    45: 30,
    46: 31,
    47: 32,
    48: 1
}
function special_creditcard_psuedorandomgenrator(blk, k) {
    const key = [...k];
    const block = [...blk];

    if (block.length < 32) {
        block.reverse();
        while (block.length - 32) {
            block.push(0);
        }
        block.reverse();
    }
    const eBlock = expand(block);
    const xoredData = bitwise_xor(eBlock, key);
    const output = contract(xoredData);

    return output;
}
function expand(block) {
    const expandedBlock = [];
    for (const k in expansionDict) {
        expandedBlock.push(block[expansionDict[k]]);
    }
    return expandedBlock;
}
function contract(data) {
    const output = [];
    while (output.length != 10) {
        const chunks = getChunks(data, 6);
        data = unbox(chunks);
        if (data.length + output.length == 10) {
            while (data.length) {
                output.push(data.pop());
            }
        }
        while (data.length % 6 != 0) {
            output.push(data.pop());
        }
    }
    output.reverse();
    return output;
}
function unbox(chunks) {
    const data = [];
    for (const box in chunks) {
        const chunk = chunks[box];
        const sbox = _sBoxDict[box];
        const boxmapping = sbox[chunk.join('')];
        data.push(...boxmapping)
    }
    return data;
}
