import { Router } from "express";
import { Response } from "../types/responseType";
import { ROUTES_CONFIG } from "../config/routes";
import { prisma } from "../prisma";

export const chatRouter = Router();

chatRouter.get(ROUTES_CONFIG.protected.chat[0], async (req, res) => {

    /**
     * @description - Get all chats
     */

    try {

        const userEmail = req.headers["email"];
        const otherPersonEmail = req.params.email;

        if (Array.isArray(userEmail)) {
            const response: Response = {
                status: "error",
                message: "Can not retrieve user email from header",
                data: null,
            };
            res.status(400).json(response);
            return
        }

        if (!userEmail) {
            const response: Response = {
                status: "error",
                message: "Can not retrieve user email from header",
                data: null,
            };
            res.status(400).json(response);
            return
        }

        const userInDb = await prisma.user.findUnique({
            where: {
                email: userEmail,
            },
        });

        if (!userInDb) {
            const response: Response = {
                status: "error",
                message: "User does not exist",
                data: null,
            };
            res.status(400).json(response);
            return
        }

        const allChats = await prisma.messages.findMany({
            where: {
                OR: [
                    { sender: { email: userInDb.email }, receiver: { email: otherPersonEmail } },
                    { receiver: { email: userInDb.email }, sender: { email: otherPersonEmail } }
                ]
            },

            include: {
                sender: true,
                receiver: true
            }
        })

        if (!allChats) {
            const response: Response = {
                status: "error",
                message: "No chats found",
                data: null,
            };
            res.status(400).json(response);
            return
        }

        const response: Response = {
            status: "success",
            message: "Chats fetched successfully",
            data: allChats,
        };

        res.status(200).json(response);

    } catch (error) {
        const response: Response = {
            status: "error",
            message: "Something went wrong",
            data: null,
        };
        res.status(500).json(response);
    }

})