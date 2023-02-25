/** @format */

export const getNFTsMetadata = () => {
  return `
import Morfi from 54879e206dce6b91

pub fun main(): {UInt64: Morfi.NFTMetadata} {
  return Morfi.getNFTMetadatas()
}
  `;
};
