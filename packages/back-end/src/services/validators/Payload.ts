import * as yup from "yup";

import AppError from "@services/AppErrors";

export default class PayloadValidator {
  static async validate(yupSchema: yup.AnySchema, data: object) {
    try {
      await yupSchema.validate(data);
    } catch (error) {
      throw AppError("REQUEST/MALFORMED", error);
    }
  }
}
