class APIError extends Error{
    constructor(
        statusCode,
        message = "Something went wrong", // not to be used while production
        errors = [],
        stack = "",
    ){
        super(message);
        this.statusCode = statusCode;
        this.data = null; // find use of it
        this.message = message;
        this.success = false;
        this.errors = errors;

        if(stack){
            this.stack = stack;
        }
        else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {APIError}; 