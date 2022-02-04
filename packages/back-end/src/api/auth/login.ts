import * as functions from "firebase-functions";
import * as yup from "yup";

import PayloadValidator from "@services/validators/Payload";

import FireUtil from "@util/Firebase";

import { NsApiRequests } from "@project-xxx/types";

export default functions.https.onCall(
  async (data: NsApiRequests.NsAuth.ILoginReq) => {
    if (data.ping) {
      await FireUtil.pingFireStore();
      return { message: "Successful ping operation" };
    }

    await PayloadValidator.validate(
      yup.object().strict().shape({
        name: yup.string().required(),
        email: yup.string().required(),
        websitePass: yup.string().required(),
        pilotId: yup.string().required(),
      }),
      data
    );

    const res: NsApiRequests.NsAuth.ILoginRes = { token: "" };
    return res;
  }
);
