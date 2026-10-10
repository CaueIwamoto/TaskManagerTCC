import type { UserRecord } from "../db.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserRecord;
    }
  }
}

export {};
