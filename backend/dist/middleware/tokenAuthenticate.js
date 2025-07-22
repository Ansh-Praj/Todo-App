import jwt from "jsonwebtoken";
export const tokenAuthenticate = ((req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ message: "Missing or invalid token" });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }
    catch (e) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
});
