/** @format */

require("dotenv").config();
const fcl = require("@onflow/fcl");
const t = require("@onflow/types");
const Buffer = require("buffer/").Buffer;
const { authorizationFunction } = require("./authorization");

fcl.config().put("accessNode.api", "https://rest-testnet.onflow.org");

// This function validates the transaction
const validateTransaction = (transactionDetails) => {
  if (transactionDetails.status === 4 && transactionDetails.statusCode === 0) {
    console.log("Successful");
    return "Successful";
  } else {
    return transactionDetails;
  }
};
// This is the function that pays for the transaction and fees
const proposer = authorizationFunction;
const payer = authorizationFunction;
const authorizations = [authorizationFunction];

export const uploadMetadata = async (
  name: String,
  description: String,
  image: String,
  extra: { String: String },
  ipfsCID: String
) => {
  // Args
  const args = (arg, t) => [
    arg(name, t.Array(t.String)),
    arg(description, t.Array(t.String)),
    arg(image, t.Array(t.String)),
    arg(extra, t.Array(t.Dictionary({ key: t.String, value: t.String }))),
    arg(ipfsCID, t.String),
  ];
  // Transaction script
  const transactionData = `
import Morfi from ${process.env.MORFI_ACCOUNT}

transaction(
  name: String,
  description: String,
  image: String,
  extra: {String: String},
  ipfsCID: String
) {
  let Administrator: &Morfi.Administrator
  prepare(deployer: AuthAccount) {
    self.Administrator = deployer.borrow<&Morfi.Administrator>(from: Morfi.AdministratorStoragePath)
                          ?? panic("This account is not the Administrator.")
  }

  execute {

      self.Administrator.createNFTMetadata(
        name: name,
        description: description,
        imagePath: image,
        ipfsCID: ipfsCID,
        extra: extra,
      )
  }
}
  `;
  const txnId = await fcl.mutate({
    cadence: transactionData,
    args,
    proposer: proposer,
    payer: payer,
    authorizations: authorizations,
    limit: 999,
  });

  let response = validateTransaction(await fcl.tx(txnId).onceSealed());
  return response;
};

export const mintNFT = async (metadataId: String) => {
  const args = (arg, t) => [arg(metadataIds, t.UInt64)];

  const transactionData = `
  import NonFungibleToken from 0x631e88ae7f1d7c20
  import Morfi from ${process.env.MORFI_ACCOUNT}
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
  const txnId = await fcl.mutate({
    cadence: transactionData,
    args,
    proposer: proposer,
    payer: payer,
    authorizations: authorizations,
    limit: 999,
  });

  let response = validateTransaction(await fcl.tx(txnId).onceSealed());
  return response;
};
