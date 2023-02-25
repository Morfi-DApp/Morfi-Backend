/** @format */

require("dotenv").config();
import { NextFunction, Request, Response, query } from "express";
import { uploadMetadata } from "../Flow/actions";
import { uploadMetadataToCollectionInput } from "../schemas/Morfi.schema";

//
// Upload Metadata
//
export const uploadMetadataHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const txnDetails = await uploadMetadata(
      req.body.dreamName,
      req.body.dreamDescription,
      req.body.image,
      req.body.extras,
      req.body.ipfsCID
    );
  } catch (err) {
    return err;
  }
};
