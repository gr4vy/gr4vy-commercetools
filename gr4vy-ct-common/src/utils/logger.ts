import bunyan, { Stream } from "bunyan"
import { v4 as uuidv4 } from "uuid"

const getLogger = () => {
  const { LOGGER_TYPE, LOGGER_PATH } = process.env
  const streams: Stream[] = [bunyan.DEBUG].map(level => {
    return {
      level,
      ...(LOGGER_TYPE === "file" ? { path: LOGGER_PATH } : { stream: process.stdout }),
    }
  })

  let logger
  if (!logger) {
    logger = bunyan.createLogger({
      name: "ctp-gr4vy-package",
      streams,
    })
  }

  logger = logger.child({ requestId: uuidv4() })
  return logger
}

export { getLogger }
