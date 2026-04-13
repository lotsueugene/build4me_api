const requestLogger = (req, res, next) => {
    const timeStamp = new Date().toISOString();
    console.log(`[${timeStamp}] ${req.method} ${req.originalUrl}`)

    if(req.method === "POST" || req.method === "PUT") {
        console.log("Request Body", JSON.stringify(req.body, null, 2))
    }

    next()
};

module.exports = requestLogger;