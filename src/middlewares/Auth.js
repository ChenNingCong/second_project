import { User } from "../models/User.js";
export const isAuthenticated = (req) => {
    return req.session && req.session.userId
}
export const checkAuthenticated = (req, res, next) => {
    if (isAuthenticated(req)) {
        return next();
    }
    res.redirect(`/unauthorized`);
};
export const injectFakeSession = async (req, res, next) => {
    const id = (await User.findOne({}, "_id"))._id;
    if (!id) {
        throw Error("Unable to set up test session")
    }
    req.session = { userId : id};
    next();
}