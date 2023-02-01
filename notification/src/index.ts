import { createServer } from "./server/"

const server = createServer()

server.listen(4000, async () => {
  console.log(`Notification module is running at http://localhost:4000`)
})
