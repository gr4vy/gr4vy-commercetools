import bunyan, { Stream } from "bunyan"

let logger: bunyan

const getLogger = () => {
  const { LOGGER_TYPE, LOGGER_PATH } = process.env
  const streams: Stream[] = [bunyan.DEBUG, bunyan.INFO, bunyan.ERROR].map(level => {
    return {
      level,
      ...(LOGGER_TYPE === "file" ? { path: LOGGER_PATH } : { stream: process.stdout }),
    }
  })
  if (!logger)
    logger = bunyan.createLogger({
      name: "ctp-gr4vy-common-package",
      streams,
    })
  return logger
}

export { getLogger }
