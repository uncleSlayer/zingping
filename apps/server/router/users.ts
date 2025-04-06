import { Router } from "express";
import { Response as ResponseType } from "../types/responseType";
import { prisma } from "../prisma/index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from 'zod';
import { ENV_CONFIG } from "../config/env";
import { ROUTES_CONFIG } from "../config/routes";

const registerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    profileImageUrl: z.string()
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export const usersRouter = Router();

usersRouter.post(ROUTES_CONFIG.public.auth[1], async (req, res) => {

    try {

        const { name, email, password, profileImageUrl } = req.body;

        const registerData = registerSchema.parse(req.body);

        if (!registerData) {
            const response: ResponseType = {
                status: "error",
                message: "Invalid data",
                data: null,
            };
            res.status(400).json(response);
            return
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            const response: ResponseType = {
                status: "error",
                message: "User already exists",
                data: null,
            };
            res.status(400).json(response);
        }

        bcrypt.hash(password, 10, async (err: any, hash: any) => {
            if (err) {
                throw err;
            } else {

                const user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password: hash,
                        imageUrl: profileImageUrl,
                    },
                });

                const response: ResponseType = {
                    status: "success",
                    message: "User registered successfully",
                    data: user,
                };

                res.status(200).json(response);

            }
        });

    } catch (error) {

        const response: ResponseType = {
            status: "error",
            message: "Something went wrong",
            data: null,
        };

        res.status(500).json(response);

    }

});

usersRouter.post(ROUTES_CONFIG.public.auth[0], async (req, res) => {

    try {

        const { email, password } = req.body;

        const loginData = loginSchema.parse(req.body);
        if (!loginData) {
            const response: ResponseType = {
                status: "error",
                message: "Invalid data",
                data: null,
            };
            res.status(400).json(response);
            return
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!existingUser) {
            const response: ResponseType = {
                status: "error",
                message: "User does not exist",
                data: null,
            };
            res.status(400).json(response);
            return
        }

        bcrypt.compare(password, existingUser.password, async (err: any, isMatch: any) => {
            if (err) {
                throw err;
            } else {
                if (isMatch) {
                    const token = jwt.sign({ email: existingUser.email }, ENV_CONFIG.JWT_SECRET);

                    const responseInfo: ResponseType = {
                        status: "success",
                        message: "User logged in successfully",
                        data: {
                            email: existingUser.email
                        },
                    };

                    res.cookie("auth-token", token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true }).status(200).json(responseInfo);

                } else {
                    const response: ResponseType = {
                        status: "error",
                        message: "Incorrect password",
                        data: null,
                    };
                    res.status(400).json(response);
                }
            }
        })

    } catch (error) {

        const response: ResponseType = {
            status: "error",
            message: "Something went wrong",
            data: null,
        };

        res.status(500).json(response);

    }


})

usersRouter.get(ROUTES_CONFIG.protected.auth[0], async (req, res) => {
    try { 

        res.clearCookie("auth-token").status(200).json({
            status: "success",
            message: "User logged out successfully",
            data: null,
        });

    } catch (error) {
        const response: ResponseType = {
            status: "error",
            message: "Something went wrong",
            data: null,
        };
        res.status(500).json(response);
    }
})