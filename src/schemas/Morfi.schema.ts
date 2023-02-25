/** @format */

import { object, string, TypeOf } from "zod";

export const uploadMetadataToCollectionSchema = object({
  body: object({
    dreamName: string({
      required_error: "Dream name is required",
      invalid_type_error: "Dream name must be a string",
    }),
    dreamDescription: string({
      required_error: "Dream description is required",
      invalid_type_error: "Dream description must be a string",
    }),
    feelingDescription: string({
      required_error: "Feeling description is required",
      invalid_type_error: "Feeling description must be a string",
    }),
    realLifeDescription: string({
      required_error: "Real life description is required",
      invalid_type_error: "Real life description must be a string",
    }),
  }).strict(),
});

export type uploadMetadataToCollectionInput = TypeOf<
  typeof uploadMetadataToCollectionSchema
>["body"];
