import c from "./../../../config/constants"

// GraphQL query to get Custom objects
const getCustomObjectsByContainerQuery = `
    query($containerName: String!)  {
        customObjects (container: $containerName) {
            total
            results{
                id
                key
                container
                value
            }
        }
    }
`;

const variables = {
  containerName: c.CTP_GR4VY_PAYMENT_CONFIGURATION_CONTAINER,
}

export { getCustomObjectsByContainerQuery, variables }
