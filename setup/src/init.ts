import { env } from "process"

import { getLogger } from "@gr4vy-ct/common"

import C from "./config/constants"
import {createCustomFields} from "./services/commercetools/createCustomFields";
import {createAwsSubscriptions} from "./services/commercetools/createAwsSubscriptions";
import {createTaxCalculationExtension} from "./services/commercetools/createTaxCalculationExtension";
import { createGcpSubscriptions } from "./services";

const logger = getLogger()

export const init = async () => {

    //Create Extensions
    try{
        logger.debug("Creating extensions...")
        const extension = await createTaxCalculationExtension();
        if (extension) {
            logger.info("Successfully created Extensions")
        }
    }
    catch(e) {
        logger.error(e)
    }

    //Create Customfields
    try {
        logger.debug("Creating custom field...")
        const customfields = await createCustomFields();
        if (customfields) {
            logger.info("Successfully created Custom Fields")
        }
    } catch (e) {
        logger.error(e)
    }

    //Create Subscriptions
    try {
        logger.debug("Creating subscriptions...")
        let subscription;
        switch (env.CTP_SUBSCRIPTION_TYPE) {
            case C.CT.SUBSCRIPTION.TYPE.AWS:
                subscription = await createAwsSubscriptions();
                break;
            case C.CT.SUBSCRIPTION.TYPE.GCP:
                subscription = await createGcpSubscriptions();
                break;
            default:
                logger.error("Unsupported Subscription type")
                break;
        }
        if (subscription) {
            logger.info("Successfully created Subscription")
        }
    } catch (e) {
        logger.error(e)
    }
}