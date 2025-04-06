import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ENV_CONFIG } from "../config/env";
import { ROUTES_CONFIG } from "../config/routes";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    
    const cookies = req.cookies;

    const token = cookies["auth-token"];  

    try {

        const requestPath = req.originalUrl;

        const protectedRoutes: string[] = []
        const publicRoutes: string[] = []

        Object.keys(ROUTES_CONFIG.protected).map(key => ROUTES_CONFIG.protected[key as keyof typeof ROUTES_CONFIG.protected]).map((routes) => {
            protectedRoutes.push(...routes)
        });

        Object.keys(ROUTES_CONFIG.public).map(key => ROUTES_CONFIG.public[key as keyof typeof ROUTES_CONFIG.public]).map((routes) => {
            publicRoutes.push(...routes)
        }) 

        console.log({
            protectedRoutes,
            publicRoutes,
            requestPath
        })

        if (publicRoutes.includes(requestPath)) {
            next();
            return;
        
        } else if (protectedRoutes.includes(requestPath)) {
            
            if (!token) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
 
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