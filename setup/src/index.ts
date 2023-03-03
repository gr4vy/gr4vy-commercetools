import * as dotenv from 'dotenv'

import { createServer } from "./server/"

const server = createServer()

dotenv.config()

server.listen(5000, async () => {
  console.log(`Setup module is running at http://localhost:5000`)
})
