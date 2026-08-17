import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";
import { logger } from "./config/logger";

const startServer = async () => {
    try {
        await connectDatabase();

        app.listen(env.port, () => {
            logger.info(`Server running on port ${env.port}`);
        });
    } catch (error) {
        logger.error({ err: error }, "Failed to start server");
        process.exit(1);
    }
};

void startServer();