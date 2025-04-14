import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ENV_CONFIG } from "../config/env";
import { ROUTES_CONFIG } from "../config/routes";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    
    const cookies = req.cookies;
    const token = cookies["auth-token"];  

    try {
        // Get the base path without query parameters
        const requestPath = req.path;

        // Extract paths from protected routes
        const protectedRoutes = Object.values(ROUTES_CONFIG.protected)
            .flatMap(category => 
                Object.values(category).map(route => route.path)
            );

        // Extract paths from public routes
        const publicRoutes = Object.values(ROUTES_CONFIG.public)
            .flatMap(category => 
                Object.values(category).map(route => route.path)
            );

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
        } else {
            // If the route is not found in either public or protected routes
            res.status(404).json({ message: "Route not found" });
        }

    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};