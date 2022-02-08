import { FireFunctions } from '@/services/firebase';

import { NsApiRequests } from '@project-xxx/types';

const getTypedHttpFunc = <IReq, IRes>(funcName: string) => {
  interface ITypedHttpFunc extends firebase.default.functions.HttpsCallable {
    (data: IReq): Promise<{ data: IRes }>;
  }

  const typedFunc: ITypedHttpFunc = FireFunctions.httpsCallable(funcName);
  return typedFunc;
};

export default {
  auth: {
    login: getTypedHttpFunc<
      NsApiRequests.NsAuth.ILoginReq,
      NsApiRequests.NsAuth.ILoginRes
    >('auth-login'),
  },
};
