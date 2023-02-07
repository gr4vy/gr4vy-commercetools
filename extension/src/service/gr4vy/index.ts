// import { Client, BuyerRequest } from "@gr4vy/node"

// interface Iprops {
//   gr4vyId: string
//   privateKey: string
//   environment: "production" | "sandbox"
// }

// class Gr4vy {
//   gr4vyClient: any

//   constructor({ gr4vyId, privateKey, environment }: Iprops) {
//     this.gr4vyClient = new Client({
//       gr4vyId,
//       privateKey,
//       environment: environment || "sandbox"
//     })
//   }

//   getEmbedToken({ amount, currency, buyerExternalIdentifier }: IgetEmbedToken) {
//     return this.gr4vyClient.getEmbedToken({
//       amount,
//       currency,
//       buyerExternalIdentifier,
//     })
//   }

//   createBuyer() {
//     // check customer id is exists in commercetools
//     const buyerRequest = new BuyerRequest()
//     buyerRequest.displayName = ""
//     buyerRequest.externalIdentifier = ""
//     return this.gr4vyClient.addBuyer(buyerRequest)
//   }
// }

// export default Gr4vy
