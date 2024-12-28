// Caesar Cipher
function caesarCipherEncrypt(text, shift) {
    return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char < 'a' ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
    });
}

function caesarCipherDecrypt(text, shift) {
    return caesarCipherEncrypt(text, 26 - shift);
}

// Vernam Cipher
function vernamCipherEncrypt(text, key) {
    return text.split('').map((char, index) => {
        const encryptedChar = String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(index % key.length));
        console.log(`Encrypting - Input Char: ${char}, Key Char: ${key[index % key.length]}, Encrypted Char Code: ${encryptedChar.charCodeAt(0)}, Encrypted Char: ${encryptedChar}`);
        return encryptedChar;
    }).join('');
}

function vernamCipherDecrypt(text, key) {
    return text.split('').map((char, index) => {
        const decryptedChar = String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(index % key.length));
        console.log(`Decrypting - Input Char: ${char}, Key Char: ${key[index % key.length]}, Decrypted Char Code: ${decryptedChar.charCodeAt(0)}, Decrypted Char: ${decryptedChar}`);
        return decryptedChar;
    }).join('');
}

// Vigenere Cipher
function vigenereCipherEncrypt(text, key) {
    key = key.toLowerCase();
    let keyIndex = 0;
    return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char < 'a' ? 65 : 97;
        const shift = key[keyIndex++ % key.length].charCodeAt(0) - 97;
        return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
    });
}

function vigenereCipherDecrypt(text, key) {
    key = key.toLowerCase();
    let keyIndex = 0;
    return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char < 'a' ? 65 : 97;
        const shift = key[keyIndex++ % key.length].charCodeAt(0) - 97;
        return String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
    });
}
// Hill Cipher
function hillCipherEncrypt(text, key) {
    if (key.length !== 4) return "Key must be a 2x2 matrix (4 numbers).";

    const matrix = key.split(' ').map(Number);
    const textVector = text.slice(0, 2).split('').map(char => char.charCodeAt(0) - 65);

    const encryptedVector = [
        (matrix[0] * textVector[0] + matrix[1] * textVector[1]) % 26,
        (matrix[2] * textVector[0] + matrix[3] * textVector[1]) % 26
    ];

    return encryptedVector.map(num => String.fromCharCode(num + 65)).join('');
}

function hillCipherDecrypt(text, key) {
    if (key.length !== 4) return "Key must be a 2x2 matrix (4 numbers).";

    const matrix = key.split(' ').map(Number);
    const determinant = (matrix[0] * matrix[3] - matrix[1] * matrix[2]) % 26;
    const inverseDeterminant = [...Array(26).keys()].find(x => (determinant * x) % 26 === 1);

    if (!inverseDeterminant) return "Matrix is not invertible.";

    const inverseMatrix = [
        (matrix[3] * inverseDeterminant) % 26,
        (-matrix[1] * inverseDeterminant + 26) % 26,
        (-matrix[2] * inverseDeterminant + 26) % 26,
        (matrix[0] * inverseDeterminant) % 26
    ];

    const textVector = text.slice(0, 2).split('').map(char => char.charCodeAt(0) - 65);

    const decryptedVector = [
        (inverseMatrix[0] * textVector[0] + inverseMatrix[1] * textVector[1]) % 26,
        (inverseMatrix[2] * textVector[0] + inverseMatrix[3] * textVector[1]) % 26
    ];

    return decryptedVector.map(num => String.fromCharCode(num + 65)).join('');
}

// Playfair Cipher
function playfairCipherEncrypt(text, key) {
    text = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    key = key.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');

    const table = createPlayfairTable(key);
    text = text.length % 2 === 0 ? text : text + 'X';

    let encrypted = '';
    for (let i = 0; i < text.length; i += 2) {
        const [aRow, aCol] = findInTable(table, text[i]);
        const [bRow, bCol] = findInTable(table, text[i + 1]);

        if (aRow === bRow) {
            encrypted += table[aRow][(aCol + 1) % 5] + table[bRow][(bCol + 1) % 5];
        } else if (aCol === bCol) {
            encrypted += table[(aRow + 1) % 5][aCol] + table[(bRow + 1) % 5][bCol];
        } else {
            encrypted += table[aRow][bCol] + table[bRow][aCol];
        }
    }
    return encrypted;
}

function playfairCipherDecrypt(text, key) {
    const table = createPlayfairTable(key);

    let decrypted = '';
    for (let i = 0; i < text.length; i += 2) {
        const [aRow, aCol] = findInTable(table, text[i]);
        const [bRow, bCol] = findInTable(table, text[i + 1]);

        if (aRow === bRow) {
            decrypted += table[aRow][(aCol + 4) % 5] + table[bRow][(bCol + 4) % 5];
        } else if (aCol === bCol) {
            decrypted += table[(aRow + 4) % 5][aCol] + table[(bRow + 4) % 5][bCol];
        } else {
            decrypted += table[aRow][bCol] + table[bRow][aCol];
        }
    }
    return decrypted;
}

function createPlayfairTable(key) {
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    const table = [];
    const used = new Set(key + alphabet);

    let index = 0;
    for (let char of used) {
        if (index % 5 === 0) table.push([]);
        table[table.length - 1].push(char);
        index++;
    }
    return table;
}

function findInTable(table, char) {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (table[row][col] === char) return [row, col];
        }
    }
    return [-1, -1];
}

// Rail Fence Cipher
function railFenceCipherEncrypt(text, rails) {
    const fence = Array.from({ length: rails }, () => []);
    let rail = 0, direction = 1;

    for (const char of text) {
        fence[rail].push(char);
        rail += direction;
        if (rail === 0 || rail === rails - 1) direction *= -1;
    }

    return fence.flat().join('');
}

function railFenceCipherDecrypt(text, rails) {
    const fence = Array.from({ length: rails }, () => []);
    let rail = 0, direction = 1;

    const lengths = Array(rails).fill(0);
    for (let i = 0; i < text.length; i++) {
        lengths[rail]++;
        rail += direction;
        if (rail === 0 || rail === rails - 1) direction *= -1;
    }

    let pos = 0;
    for (let r = 0; r < rails; r++) {
        for (let j = 0; j < lengths[r]; j++) {
            fence[r].push(text[pos++]);
        }
    }

    rail = 0;
    direction = 1;
    let result = [];
    for (let i = 0; i < text.length; i++) {
        result.push(fence[rail].shift());
        rail += direction;
        if (rail === 0 || rail === rails - 1) direction *= -1;
    }

    return result.join('');
}
// Monoalphabetic Cipher
function monoalphabeticCipherEncrypt(text, key) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const keyMap = key.toUpperCase().split('');

    return text.toUpperCase().split('').map(char => {
        const index = alphabet.indexOf(char);
        return index !== -1 ? keyMap[index] : char;
    }).join('');
}

function monoalphabeticCipherDecrypt(text, key) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const keyMap = key.toUpperCase().split('');

    return text.toUpperCase().split('').map(char => {
        const index = keyMap.indexOf(char);
        return index !== -1 ? alphabet[index] : char;
    }).join('');
}

// Add event listeners to buttons
// Polyalphabetic Cipher
function polyalphabeticCipherEncrypt(text, key) {
    key = key.toUpperCase();
    let keyIndex = 0;

    return text.toUpperCase().replace(/[A-Z]/g, (char) => {
        const charCode = char.charCodeAt(0) - 65;
        const keyCode = key[keyIndex++ % key.length].charCodeAt(0) - 65;
        return String.fromCharCode(((charCode + keyCode) % 26) + 65);
    });
}

function polyalphabeticCipherDecrypt(text, key) {
    key = key.toUpperCase();
    let keyIndex = 0;

    return text.toUpperCase().replace(/[A-Z]/g, (char) => {
        const charCode = char.charCodeAt(0) - 65;
        const keyCode = key[keyIndex++ % key.length].charCodeAt(0) - 65;
        return String.fromCharCode(((charCode - keyCode + 26) % 26) + 65);
    });
}

// Autokey Cipher
function autokeyCipherEncrypt(text, key) {
    key = key.toUpperCase() + text.toUpperCase();
    let keyIndex = 0;

    return text.toUpperCase().replace(/[A-Z]/g, (char) => {
        const charCode = char.charCodeAt(0) - 65;
        const keyCode = key[keyIndex++].charCodeAt(0) - 65;
        return String.fromCharCode(((charCode + keyCode) % 26) + 65);
    });
}

function autokeyCipherDecrypt(text, key) {
    key = key.toUpperCase();
    let keyIndex = 0;
    let decrypted = '';

    text.toUpperCase().split('').forEach((char) => {
        const charCode = char.charCodeAt(0) - 65;
        const keyCode = key[keyIndex].charCodeAt(0) - 65;
        const decryptedChar = String.fromCharCode(((charCode - keyCode + 26) % 26) + 65);
        decrypted += decryptedChar;
        key += decryptedChar; // Add decrypted char to the key for autokey sequence
        keyIndex++;
    });

    return decrypted;
}

// Columnar Transposition Cipher
function columnarTranspositionEncrypt(text, key) {
    const numCols = key.length;
    const grid = Array.from({ length: numCols }, () => []);

    // Fill grid row-wise
    for (let i = 0; i < text.length; i++) {
        grid[i % numCols].push(text[i]);
    }

    // Sort columns by key order
    const sortedColumns = key
        .split('')
        .map((char, index) => ({ char, index }))
        .sort((a, b) => a.char.localeCompare(b.char))
        .map((item) => grid[item.index]);

    // Flatten grid column-wise
    return sortedColumns.flat().join('');
}

function columnarTranspositionDecrypt(text, key) {
    const numCols = key.length;
    const numRows = Math.ceil(text.length / numCols);
    const grid = Array.from({ length: numCols }, () => []);

    // Sort columns by key order
    const sortedColumns = key
        .split('')
        .map((char, index) => ({ char, index }))
        .sort((a, b) => a.char.localeCompare(b.char));

    // Determine lengths of each column
    let startIndex = 0;
    sortedColumns.forEach((item, i) => {
        const columnLength = i < text.length % numCols ? numRows : numRows - 1;
        grid[item.index] = text.slice(startIndex, startIndex + columnLength).split('');
        startIndex += columnLength;
    });

    // Read grid row-wise
    let result = '';
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (grid[col][row]) {
                result += grid[col][row];
            }
        }
    }

    return result;
}

// Add event listeners to buttons
function addEventListeners() {
    const sections = document.querySelectorAll('.cipher-section');

    sections.forEach((section) => {
        const encryptButton = section.querySelector('.encrypt-btn');
        const decryptButton = section.querySelector('.decrypt-btn');
        const inputText = section.querySelector('.input-text');
        const keyInput = section.querySelector('.key-input');
        const outputText = section.querySelector('.output-text');

        encryptButton.addEventListener('click', () => {
            const id = section.id;
            const input = inputText.value;
            const key = keyInput ? keyInput.value : null;
            let result = '';

            switch (id) {
                case 'caesar':
                    result = caesarCipherEncrypt(input, parseInt(key, 10) || 3); // Default shift is 3
                    break;
                case 'vernam':
                    result = vernamCipherEncrypt(input, key || 'KEY');
                    break;
                case 'vigenere':
                    result = vigenereCipherEncrypt(input, key || 'KEY');
                    break;
                case 'railfence':
                    result = railFenceCipherEncrypt(input, parseInt(key, 10) || 3); // Default rails is 3
                    break;
                case 'hill':
                    result = hillCipherEncrypt(input, key || '3 3 2 5');
                    break;
                case 'playfair':
                    result = playfairCipherEncrypt(input, key || 'KEY');
                    break;
                case 'monoalphabetic':
                    result = monoalphabeticCipherEncrypt(input, key || 'ZYXWVUTSRQPONMLKJIHGFEDCBA');
                    break;
                case 'polyalphabetic':
                    result = polyalphabeticCipherEncrypt(input, key || 'KEY');
                    break;
                case 'autokey':
                    result = autokeyCipherEncrypt(input, key || 'A');
                    break;
                case 'columnar':
                    result = columnarTranspositionEncrypt(input, key || 'KEY');
                    break;
                case 'elgamal':
                    result = elGamalEncrypt(input, key || '23 5');
                    break;
                case 'sdes':
                    result = sdesEncrypt(input, key || '1010101010');
                    break;
                default:
                    result = 'Encryption not implemented';
            }

            outputText.value = result;
        });

        decryptButton.addEventListener('click', () => {
            const id = section.id;
            const input = inputText.value;
            const key = keyInput ? keyInput.value : null;
            let result = '';

            switch (id) {
                case 'caesar':
                    result = caesarCipherDecrypt(input, parseInt(key, 10) || 3); // Default shift is 3
                    break;
                case 'vernam':
                    result = vernamCipherDecrypt(input, key || 'KEY');
                    break;
                case 'vigenere':
                    result = vigenereCipherDecrypt(input, key || 'KEY');
                    break;
                case 'railfence':
                    result = railFenceCipherDecrypt(input, parseInt(key, 10) || 3); // Default rails is 3
                    break;
                case 'hill':
                    result = hillCipherDecrypt(input, key || '3 3 2 5');
                    break;
                case 'playfair':
                    result = playfairCipherDecrypt(input, key || 'KEY');
                    break;
                case 'monoalphabetic':
                    result = monoalphabeticCipherDecrypt(input, key || 'ZYXWVUTSRQPONMLKJIHGFEDCBA');
                    break;
                case 'polyalphabetic':
                    result = polyalphabeticCipherDecrypt(input, key || 'KEY');
                    break;
                case 'autokey':
                    result = autokeyCipherDecrypt(input, key || 'A');
                    break;
                case 'columnar':
                    result = columnarTranspositionDecrypt(input, key || 'KEY');
                    break;
                case 'elgamal':
                    result = elGamalDecrypt(input, key || '23 5');
                    break;
                case 'sdes':
                    result = sdesDecrypt(input, key || '1010101010');
                    break;
                default:
                    result = 'Decryption not implemented';
            }

            outputText.value = result;
        });
    });
}

// ElGamal Cipher
function elGamalEncrypt(text, key) {
    const [p, g] = key.split(' ').map(Number);
    const y = Math.pow(g, 5) % p; // Assuming a fixed private key 5 for demonstration

    return text.split('').map(char => {
        const m = char.charCodeAt(0);
        const k = Math.floor(Math.random() * (p - 2)) + 1; // Random session key
        const c1 = Math.pow(g, k) % p;
        const c2 = (m * Math.pow(y, k)) % p;
        return `${c1},${c2}`;
    }).join(' ');
}

function elGamalDecrypt(ciphertext, key) {
    const [p, x] = key.split(' ').map(Number); // Assuming x is the private key

    return ciphertext.split(' ').map(pair => {
        const [c1, c2] = pair.split(',').map(Number);
        const s = Math.pow(c1, x) % p;
        const m = (c2 * Math.pow(s, p - 2)) % p; // Modular multiplicative inverse
        return String.fromCharCode(m);
    }).join('');
}

// Simplified DES (S-DES)
function sdesEncrypt(text, key) {
    const permute = (input, table) => table.map(i => input[i - 1]).join('');

    const IP = [2, 6, 3, 1, 4, 8, 5, 7]; // Initial Permutation
    const IP_INV = [4, 1, 3, 5, 7, 2, 8, 6]; // Inverse Initial Permutation
    const EP = [4, 1, 2, 3, 2, 3, 4, 1]; // Expansion Permutation
    const P4 = [2, 4, 3, 1]; // P4 Permutation

    const S0 = [
        [1, 0, 3, 2],
        [3, 2, 1, 0],
        [0, 2, 1, 3],
        [3, 1, 3, 2]
    ];

    const S1 = [
        [0, 1, 2, 3],
        [2, 0, 1, 3],
        [3, 0, 1, 0],
        [2, 1, 0, 3]
    ];

    const XOR = (a, b) => a.split('').map((bit, i) => bit ^ b[i]).join('');

    const f = (right, subkey) => {
        const expanded = permute(right, EP);
        const xored = XOR(expanded, subkey);

        const sbox = (input, box) => {
            const row = parseInt(input[0] + input[3], 2);
            const col = parseInt(input[1] + input[2], 2);
            return box[row][col].toString(2).padStart(2, '0');
        };

        const left = sbox(xored.slice(0, 4), S0);
        const right = sbox(xored.slice(4), S1);

        return permute(left + right, P4);
    };

    const generateSubkeys = (key) => {
        const P10 = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6]; // P10 Permutation
        const P8 = [6, 3, 7, 4, 8, 5, 10, 9]; // P8 Permutation

        const shifted = (bits, shift) => bits.slice(shift) + bits.slice(0, shift);

        const permutedKey = permute(key, P10);
        const left = shifted(permutedKey.slice(0, 5), 1);
        const right = shifted(permutedKey.slice(5), 1);

        const subkey1 = permute(left + right, P8);
        const subkey2 = permute(shifted(left, 2) + shifted(right, 2), P8);

        return [subkey1, subkey2];
    };

    const subkeys = generateSubkeys(key);
    const permutedText = permute(text, IP);

    const left = permutedText.slice(0, 4);
    const right = permutedText.slice(4);

    const round1 = XOR(left, f(right, subkeys[0]));
    const round2 = XOR(right, f(round1, subkeys[1]));

    return permute(round2 + round1, IP_INV);
}

function sdesDecrypt(text, key) {
    return sdesEncrypt(text, key); // Encryption and decryption use reversed keys
}

// Initialize event listeners on page load
document.addEventListener('DOMContentLoaded', addEventListeners);

// Initialize event listeners on page load
document.addEventListener('DOMContentLoaded', addEventListeners);
