interface APIRequest {
  ping?: boolean;
}

export namespace NsAuth {
  export interface ILoginReq extends APIRequest {
    name: string;
    email: string;
    websitePass: string;
    pilotId: string;
  }

  export interface ILoginRes {
    token: string;
  }
}
