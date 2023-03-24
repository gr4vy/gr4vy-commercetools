import * as dotenv from 'dotenv'
import { createServer } from "./server/"
import {init} from "./init"

const server = createServer()

dotenv.config()
//init script to create custom fields
init();

server.listen(5000, async () => {
  console.log(`Setup module is running at http://localhost:5000`)
})
