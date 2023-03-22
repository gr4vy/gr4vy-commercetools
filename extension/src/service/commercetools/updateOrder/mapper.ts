const responseMapper = async (result: any) => {
    return !!result?.body?.data?.updateOrder?.id
}

export {responseMapper}