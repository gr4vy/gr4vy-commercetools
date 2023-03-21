import * as dotenv from 'dotenv'

import { createServer } from "./server/"

dotenv.config()

const server = createServer()

server.listen(4000, async () => {
  console.log(`Notification module is running at http://localhost:4000`)
})
