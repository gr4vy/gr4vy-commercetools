import { getLogger } from "./utils";
import {createCustomFields} from "./services/commercetools/createCustomFields";
import {createSubscriptions} from "./services/commercetools/createSubscriptions";

const logger = getLogger()

export const init = async () => {
    try{
        logger.debug("Create custom field start")
        const customFieldsResult = await createCustomFields();
        logger.debug("Create custom field end")
        logger.debug("Create subscriptions start")
        const createSubscriptionsResult = await createSubscriptions();
        logger.debug("Create subscriptions end")
    } catch (e) {
        logger.error(JSON.stringify(e))
    }
}