import firebase from "firebase";

interface INormalizedUser {
  name: string;
  id: string;
}

export interface IActivity {
  id?: string;
  type: "STARTUP/LIKE";
  fromUser: INormalizedUser;
  toUser?: INormalizedUser;
  createdAt: firebase.firestore.FieldValue | firebase.firestore.Timestamp;
}
