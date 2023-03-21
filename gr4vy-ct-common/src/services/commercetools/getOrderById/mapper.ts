import {Order} from "./../../types"

const responseMapper = async (
    result: any
): Promise<{
    order: Order
}> => {
    return result?.body?.data?.order || {}
}

export { responseMapper }
