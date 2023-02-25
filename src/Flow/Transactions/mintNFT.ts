/** @format */

export const mintNFT = () => {
  return `
  import NonFungibleToken from 0x631e88ae7f1d7c20
  import Morfi from 54879e206dce6b91
  import MetadataViews from 0x631e88ae7f1d7c20
  import FlowToken from 0x7e60df042a9c0868


  transaction(metadataId: UInt64) {

    let PaymentVault: &FlowToken.Vault
    let CollectionPublic: &Morfi.Collection{NonFungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        // Setup
        if signer.borrow<&Morfi.Collection>(from: Morfi.CollectionStoragePath) == nil {
            signer.save(<- Morfi.createEmptyCollection(), to: Morfi.CollectionStoragePath)
            signer.link<&Morfi.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(Morfi.CollectionPublicPath, target: Morfi.CollectionStoragePath)
        }

        var paymentPath: StoragePath = /storage/flowTokenVault

        self.PaymentVault = signer.borrow<&FlowToken.Vault>(from: paymentPath)!

        self.CollectionPublic = signer.getCapability(Morfi.CollectionPublicPath)
                              .borrow<&Morfi.Collection{NonFungibleToken.Receiver}>()
                              ?? panic("Did not properly set up the Morfi NFT Collection.")

    }

    execute {
        let payment: @FlowToken.Vault <- self.PaymentVault.withdraw(amount: 1.0) as! @FlowToken.Vault
        let nftId = Morfi.mintNFT(metadataId: metadataId, recipient: self.CollectionPublic, payment: <- payment)
        log("An NFT has been minted successfully!")
    }

  }
  `;
};
