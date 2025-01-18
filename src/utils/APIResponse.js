class APIResponse{
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode;
    }
}

export {APIResponse};

/*
statuscode > 400 => api error, not hard and fast rule but do API error for it
 */