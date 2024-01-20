import { Response, NextFunction } from "express";
import { ReqTyp } from "..";

const asyncHandler =
  (
    fn: (
      arg0: ReqTyp,
      arg1: Response<any, Record<string, any>>,
      arg2: NextFunction | undefined
    ) => void
  ) =>
  (req: ReqTyp, res: Response, next?: NextFunction) => {
    fn(req, res, next);
  };

export default asyncHandler;
