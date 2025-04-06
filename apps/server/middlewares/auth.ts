import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ENV_CONFIG } from "../config/env";
import { ROUTES_CONFIG } from "../config/routes";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    
    const cookie = req.headers["cookie"];

    if (!cookie) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const token = cookie.split("=")[1];

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {

        const requestPath = req.originalUrl;


        const protectedRoutes = Object.keys(ROUTES_CONFIG.protected).map(key => ROUTES_CONFIG.protected[key as keyof typeof ROUTES_CONFIG.protected])[0];

        const publicRoutes = Object.keys(ROUTES_CONFIG.public).map(key => ROUTES_CONFIG.public[key as keyof typeof ROUTES_CONFIG.public])[0];
        if (publicRoutes.includes(requestPath)) {
            
            next();
            return;
        
        } else if (protectedRoutes.includes(requestPath)) {
            jwt.verify(token, ENV_CONFIG.JWT_SECRET, (err: any, decoded: any) => {

                if (err) {
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                }

                req.headers["email"] = decoded.email;

                next();

            });
        }

    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};