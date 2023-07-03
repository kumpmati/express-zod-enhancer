import express from "express"
import { Server } from "http"
import { ENV } from "./config"
import cors from "cors"
import { handleAppError } from "./middleware/error"
import { logger } from "./utils/logger"
import { v1 } from "./v1"

/**
 * Starts the application
 */
const start = async () => {
  const app = express()
  const http = new Server(app)

  app.use(express.json())
  app.use(cors({ origin: ["http://localhost:3000"] }))

  /**
   * API routes
   */
  app.use("/api/v1", v1.compile())

  /**
   * Central error handler (mounted last)
   */
  app.use(handleAppError)

  http.listen(ENV.PORT, () => logger.info(`listening on port ${ENV.PORT}`))
}

start()
