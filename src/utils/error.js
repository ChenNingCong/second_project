/**
 * @param {Response} res 
 * @param {number} code 
 * @param {string} message 
 * @returns 
 */
export function fail(res, code, message) {
    res.status(code).json({
        success: false,
        data: null,
        code: code,
        error: message
    })
}

/**
 * 
 * @param {Response} res 
 * @param {number} code 
 * @param {object} data 
 * @returns 
 */
export function succeed(res, code, data) {
    res.status(code).json({
        success: true,
        data: data,
        code: code,
        error: null
    })
}

export class AppError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.isOperational = true;
    }
}

// 400 - Bad Request
export class BadRequestError extends AppError {
    constructor(message = "Bad Request") {
        super(400, message);
    }
}

// 401 - Unauthorized Request
export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized Request") {
        super(401, message);
    }
}

// 404 - Not Found
export class NotFoundError extends AppError {
    constructor(message = "Resource Not Found") {
        super(404, message);
    }
}

// 409 - Conflict
export class ConflictError extends AppError {
    constructor(message = "Conflict") {
        super(409, message);
    }
}


// 422 - Unprocessable Entity
export class ValidationError extends AppError {
    constructor(message = "Validation Failed") {
        super(422, message);
    }
}
