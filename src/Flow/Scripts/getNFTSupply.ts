/** @format */

export const getMintedNFTs = () => {
  return `
import Morfi from 54879e206dce6b91

pub fun main(MetadataId: UInt64): UInt64? {
  return Morfi.getNFTMetadata(MetadataId)?.minted
}
  `;
};
