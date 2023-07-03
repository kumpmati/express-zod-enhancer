import express from "express"
import { ENV } from "./config"
import cors from "cors"
import { handleAppError } from "./middleware/error"
import { logger } from "./utils/logger"
import redoc from "redoc-express"
import { v1 } from "./v1"
import { generateSpec } from "../lib/spec"

/**
 * Starts the application
 */
const start = async () => {
  const app = express()

  app.use(express.json())
  app.use(cors({ origin: ["http://localhost:3000"] }))

  /**
   * Api V1 routes
   */
  app.use("/v1", v1)

  app.listen(ENV.PORT, () => logger.info(`listening on port ${ENV.PORT}`))

  app.get("/docs/spec.yml", (_, res) => res.status(200).end(generateSpec(app).getSpecAsYaml()))

  app.get("/docs", redoc({ title: "Hello world", specUrl: "/docs/spec.yml" }))

  /**
   * Central error handler (mount last)
   */
  app.use(handleAppError)
}

start()
