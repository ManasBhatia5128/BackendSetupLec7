class APIError extends Error{
    constructor(
        statusCode,
        message = "Something went wrong", // not to be used while production
        errors = [], // array of additional error details if we want to add
        stack = "",
    ){
        super(message); // parent class ie error class se error message mil jayega
        this.statusCode = statusCode;
        this.data = null; // find use of it
        this.message = message;
        this.success = false;
        this.errors = errors;
        if(stack){
            this.stack = stack;
        }
        else{
            Error.captureStackTrace(this, this.constructor); //The stack property shows the sequence of function calls leading up to the point where the error occurred. This is useful for debugging
        }
    }
}
// Error.captureStackTrace(this, this.constructor) excludes the constructor function (APIError) from the stack trace, making it cleaner and more readable.

// Key Notes
// super(message) ensures the parent class properly handles the message property.
// Error.captureStackTrace is used to generate a clean, developer-friendly stack trace for debugging.
// The stack property is essential for debugging as it helps trace where the error originated.

export {APIError}; 