import { getLogger } from "./utils";
import {createCustomFields} from "./services/commercetools/createCustomFields";

const logger = getLogger()

export const init = async () => {
    try{
        logger.debug("Create custom field start")
        const result = await createCustomFields();
        logger.debug("Create custom field end")
    } catch (e) {
        logger.error(e)
    }
}