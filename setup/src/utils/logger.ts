import bunyan from "bunyan"

let logger: bunyan

const getLogger = () => {
  if (!logger)
    logger = bunyan.createLogger({
      name: "ctp-gr4vy-setup-module",
      streams: [
        {
          level: "error",
          path: "./log/app.log",
        },
        {
          level: "info",
          path: "./log/app.log",
        },
      ],
      level: bunyan.INFO, //TODO: provide the config value param here
    })
  return logger
}

export { getLogger }
