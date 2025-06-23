const adminAuth = (req, res, next) => {
    const token = "xyz";
    const isAuthorized = token === "xyz"; // Replace with actual authorization logic
    if (!isAuthorized) {
        return res.status(401).send('Unauthorized Admin');
    }
    else {
        next();
    }
};

const userAuth = (req, res, next) => {
    const token = "xyz";
    const isAuthorized = token === "xyz"; // Replace with actual authorization logic
    if (!isAuthorized) {
        return res.status(401).send('Unauthorized User');
    }
    else {
        next();
    }
};

module.exports = { adminAuth, userAuth };
