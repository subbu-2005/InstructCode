/**
 * Comprehensive Logging Middleware
 * Logs all incoming requests with detailed information
 */

export const requestLogger = (req, res, next) => {
    const startTime = Date.now();

    // Log incoming request
    console.log("\n" + "=".repeat(80));
    console.log(`📥 INCOMING REQUEST`);
    console.log("=".repeat(80));
    console.log(`🕐 Time: ${new Date().toISOString()}`);
    console.log(`🔗 Method: ${req.method}`);
    console.log(`🌐 URL: ${req.originalUrl}`);
    console.log(`📍 Path: ${req.path}`);
    console.log(`🏠 Base URL: ${req.baseUrl}`);
    console.log(`🔑 Headers:`, {
        authorization: req.headers.authorization ? '✓ Present' : '✗ Missing',
        'content-type': req.headers['content-type'] || 'Not set',
        origin: req.headers.origin || 'Not set',
        'user-agent': req.headers['user-agent']?.substring(0, 50) + '...' || 'Not set'
    });

    if (req.auth) {
        console.log(`👤 Clerk Auth:`, {
            userId: req.auth.userId || '✗ Missing',
            sessionId: req.auth.sessionId || '✗ Missing',
        });
    } else {
        console.log(`👤 Clerk Auth: ✗ Not authenticated`);
    }

    if (Object.keys(req.query).length > 0) {
        console.log(`🔍 Query Params:`, req.query);
    }

    if (req.body && Object.keys(req.body).length > 0) {
        console.log(`📦 Body:`, JSON.stringify(req.body).substring(0, 200));
    }

    // Log response
    const originalSend = res.send;
    res.send = function (data) {
        const duration = Date.now() - startTime;
        console.log("\n" + "-".repeat(80));
        console.log(`📤 RESPONSE`);
        console.log("-".repeat(80));
        console.log(`⏱️  Duration: ${duration}ms`);
        console.log(`📊 Status: ${res.statusCode}`);
        console.log(`📏 Size: ${data ? data.length : 0} bytes`);
        console.log("=".repeat(80) + "\n");

        originalSend.call(this, data);
    };

    next();
};

/**
 * Error Logging Middleware
 * Logs all errors with stack traces
 */
export const errorLogger = (err, req, res, next) => {
    console.error("\n" + "🔴".repeat(40));
    console.error(`❌ ERROR OCCURRED`);
    console.error("🔴".repeat(40));
    console.error(`🕐 Time: ${new Date().toISOString()}`);
    console.error(`🔗 Method: ${req.method}`);
    console.error(`🌐 URL: ${req.originalUrl}`);
    console.error(`💥 Error Message: ${err.message}`);
    console.error(`📚 Stack Trace:`);
    console.error(err.stack);
    console.error("🔴".repeat(40) + "\n");

    next(err);
};
