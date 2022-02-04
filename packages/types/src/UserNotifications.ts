import { IActivity } from "./SiteActivity";

export type INotification = IActivity & {
  read: boolean;
};
