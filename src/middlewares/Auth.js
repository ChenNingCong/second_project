const CheckAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect(`/unauthorized`);
};
export { CheckAuthenticated } 