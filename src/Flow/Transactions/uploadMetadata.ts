/** @format */

export const uploadMetadata = () => {
  return `
import Morfi from 54879e206dce6b91

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
};
