const cors = () => {
  return {
    "Access-Control-Allow-Origin": process.env.APP_CORS_ALLOWED_HOSTS,
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Max-Age": 900
  }
}

export default cors
