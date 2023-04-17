import * as dotenv from 'dotenv'

import {init} from "./init"
import { validate } from "./validate"

dotenv.config()

//validate input parameters
validate();

//init script to create custom fields, subscription, extensions etc.
init();
