// pages/api/private.ts
import { NextApiRequest, NextApiResponse } from "next";
import auth from "../../middleware/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return res
    .status(200)
    .json({ message: "This is a protected route", user: req.user });
};

export default auth(handler);
