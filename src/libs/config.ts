export const MORGAN_RORMAT = `:method :url :response-time [:status] \n`

import mongoose from "mongoose";
export const shapeIntoMongooseObjectId = (target: any) => {
    return typeof target === 'string' ? new mongoose.Types.ObjectId(target) :target;
};