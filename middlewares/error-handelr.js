const { ValidationError, UniqueConstraintError, DatabaseError } = require('sequelize');
const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something Went Wrong',
    };
    

    if (err instanceof ValidationError) {
        customError.msg = err.errors.map((item) => item.message).join(',');
        customError.statusCode = 400;
    }

    if (err instanceof UniqueConstraintError) {
        customError.msg = `Duplicate value entered in ${Object.keys(err.fields).join(', ')} field(s), please choose another value`;
        customError.statusCode = 400;
    }

    if (err instanceof DatabaseError) {        
        
        customError.msg = 'Database error occurred';
        customError.statusCode = 500;
    }
    
    if (err.name === 'CastError') {
        customError.msg = `The item with this id: ${err.value} is Not Found`;
        customError.statusCode = 404;
    }
    
    
    console.log('DatabaseError', err);
    next();
    return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;