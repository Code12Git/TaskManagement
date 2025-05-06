// lib/storage.ts
import { WebStorage } from "redux-persist/es/types";

export const createNoopStorage = (): WebStorage => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getItem(_key) {
      return Promise.resolve(null);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setItem(_key, _value) {
      return Promise.resolve();
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
export const storage = typeof window !== "undefined" ? require("redux-persist/lib/storage").default : createNoopStorage();