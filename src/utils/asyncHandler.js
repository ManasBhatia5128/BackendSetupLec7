// const asyncHandler = () => {}
// const asyncHandler = (func) => {() => {}} // somewhat aisa sa system hai

// this function is accepting a function fn and returning an async function which takes parameters (req, res, next)
// basically jb hum iss function mein apna connectDatabase function pass karenge toh hume uska error manually handle krne ki jarurat nhi padegi
const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      const statusCodeGiven = Number.isInteger(error.statusCode) && error.statusCode >= 100 && error.statusCode < 600 
        ? error.statusCode 
        : 500; // do check this code again

      res.status(statusCodeGiven).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
      console.log(error);
    }
  };
};


// const asyncHandler(requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
//     }
// }

export { asyncHandler };