// global.d.ts or lib/global.d.ts
import { Mongoose } from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import { NextApiRequest } from "next";

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

declare module "next" {
  interface NextApiRequest {
    user?: string | JwtPayload;
  }
}