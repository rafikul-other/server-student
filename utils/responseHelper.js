export const successResponse = (res, message, data = null, statusCode = 200, token = null) => {
  const response = {
    message,
    success: true,
  };
  if (data !== null) response.data = data;
  if (token) response.token = token;
  return res.status(statusCode).json(response);
};

export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    message,
    success: false,
    ...(errors !== null && { errors }),
  });
};