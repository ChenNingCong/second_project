import { User } from "../models/User.js";
import { UnauthorizedError } from "../utils/error.js";
export const isAuthenticated = (req) => {
    return req.session && req.session.userId
}
export const checkAuthenticated = (req, res, next) => {
    if (isAuthenticated(req)) {
        return next();
    } else {
        return next(new UnauthorizedError("User is not loggined in"))
    }
    
};
export const injectFakeSession = async (req, res, next) => {
    const id = (await User.findOne({}, "_id"))._id;
    if (!id) {
        throw Error("Unable to set up test session")
    }
    req.session = { userId : id};
    next();
}