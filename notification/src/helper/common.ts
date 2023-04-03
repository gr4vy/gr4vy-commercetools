// eslint-disable-next-line
const prepareRequestBody = (event: { Records: any }) => {
  if (!event || !event.Records) return {}

  const [record] = event.Records ? event.Records : []
  const { body } = record
  let parsedBody
  if (body) {
    try {
      parsedBody = JSON.parse(body)
    } catch (e) {
      if (e.message.includes("Unexpected token")) {
        parsedBody = body
      } else {
        return {}
      }
    }
    const typeId = parsedBody?.resource?.typeId
    if (typeId && typeId === "order") {
      parsedBody.orderId = parsedBody.resource.id
    }
  }
  return parsedBody || {}
}

export { prepareRequestBody }
