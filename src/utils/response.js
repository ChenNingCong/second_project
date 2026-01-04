/**
 * 
 * @param {number} code 
 * @param {string} message 
 * @returns 
 */
function makeError(code, message) {
    return {
        success: false,
        data: null,
        code: code,
        error: message
    }
}

/**
 * 
 * @param {number} code 
 * @param {object} data 
 * @returns 
 */
function makeSuccess(code, data) {
    return {
        success: false,
        data: data,
        code: code,
        error: null
    }
}