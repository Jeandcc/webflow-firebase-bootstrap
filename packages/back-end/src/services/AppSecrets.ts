import * as admin from "firebase-admin";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

import { join } from "path";
import { readFileSync } from "fs";

export type TAppSecrets = "WF_API-KEY" | "TEST_SECRET";
export type TAppSecretsObj = { [key in TAppSecrets]?: string };

export default class AppSecrets {
  private static localCache: TAppSecretsObj = {};

  private static api = new SecretManagerServiceClient();

  public static async get(secretName: TAppSecrets) {
    const cachedSecret = this.getSecretFromLocalStorage(secretName);
    if (cachedSecret) return cachedSecret;

    if (process.env.NODE_ENV === "development" || admin.apps.length === 0) {
      return this.getSecretFromLocalEnv(secretName);
    }

    return this.getSecretFromSecretManager(secretName);
  }

  private static setSecretOnLocalStorage(name: TAppSecrets, value?: string) {
    this.localCache[name] = value;
  }

  private static getSecretFromLocalStorage(name: TAppSecrets) {
    return this.localCache[name];
  }

  private static async getSecretFromLocalEnv(name: TAppSecrets) {
    const fileBuffer = readFileSync(join(process.cwd(), "runtimeconfig.json"));
    const localKeys: TAppSecretsObj = JSON.parse(fileBuffer.toString());
    const secretVal = localKeys[name];

    this.setSecretOnLocalStorage(name, secretVal);
    return secretVal;
  }

  private static async getSecretFromSecretManager(name: TAppSecrets) {
    const currentProject = admin.apps[0]?.options.projectId;

    const [version] = await this.api.accessSecretVersion({
      name: `projects/${currentProject}/secrets/${name}/versions/latest`,
    });

    const payload = version.payload?.data?.toString();

    this.setSecretOnLocalStorage(name, payload);
    return payload;
  }
}
