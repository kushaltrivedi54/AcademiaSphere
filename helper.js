const isValidString = (str) => {
    return typeof str === 'string' && str.trim() !== '';
}

const isValidArray = (arr) => {
    return Array.isArray(arr) && arr.length > 0;
}

module.exports = { isValidString, isValidArray };
