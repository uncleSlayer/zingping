import { Router } from "express";
import { z } from 'zod'
import { Response } from "../types/responseType";
import { ROUTES_CONFIG } from "../config/routes";
import { prisma } from "../prisma";

export const friendRouter = Router();

const friendRequestSchema = z.object({
    email: z.string().email(),
})

const friendRequestRespondSchema = z.object({
    status: z.enum(["ACCEPT", "REJECT"]),
    receiverId: z.string(),
})

friendRouter.post(ROUTES_CONFIG.protected.friend[0], async (req, res) => {

    /**
     * @description - Send friend request to a user
     */

    try {

        const userEmail = req.headers["email"];

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

        const friendRequestData = friendRequestSchema.parse(req.body);

        if (friendRequestData.email === userEmail) {
            const response: Response = {
                status: "error",
                message: "Can not add yourself as a friend",
                data: null,
            };
            res.status(400).json(response);
            return
        }

        if (!friendRequestData) {
            const response: Response = {
                status: "error",
                message: "Invalid payload",
                data: null,
            };
            res.status(400).json(response);
            return
        }

        res.status(200).json({ message: "Friend request sent successfully" });

        const requestedUser = await prisma.user.findUnique({
            where: {
                email: friendRequestData.email,
            },
        });

        if (!requestedUser) {
            const response: Response = {
                status: "error",
                message: "Requested user does not exist",
                data: null,
            };
            res.status(400).json(response);
            return
        }

        const friendRequest = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    { senderUserId: userInDb.id, receiverUserId: requestedUser?.id, status: 'PENDING' },
                    { receiverUserId: userInDb.id, senderUserId: requestedUser?.id, status: 'PENDING' }
                ]
            }
        })

        if (friendRequest) {
            const response: Response = {
                status: "error",
                message: "Friend request already exists",
                data: null,
            };
            res.status(400).json(response);
            return
        }

        const friendRequestResolved = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    { senderUserId: userInDb.id, receiverUserId: requestedUser?.id, status: 'RESOLVED' },
                    { receiverUserId: userInDb.id, senderUserId: requestedUser?.id, status: 'RESOLVED' }
                ]
            }
        })

        if (friendRequestResolved) {
            const response: Response = {
                status: "error",
                message: "You are already friends with this user",
                data: null,
            };
            res.status(400).json(response);
            return
        }

        await prisma.friendRequest.create({
            data: {
                receiverUserId: requestedUser?.id,
                senderUserId: userInDb.id,
            }
        })

        const response: Response = {
            status: "success",
            message: "Friend request sent successfully",
            data: null,
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

friendRouter.post(ROUTES_CONFIG.protected.friend[1], async (req, res) => {

    /**
     * @description - Get all friends
     */

    try {

        const userEmail = req.headers["email"];

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

        const allFriendRequests = await prisma.friendRequest.findMany({
            where: {
                OR: [
                    { senderUserId: userInDb.id, receiverUserId: userInDb.id, status: 'RESOLVED' },
                    { receiverUserId: userInDb.id, senderUserId: userInDb.id, status: 'RESOLVED' }
                ]
            }
        });

        if (!allFriendRequests) {
            const response: Response = {
                status: "error",
                message: "No friends found",
                data: null,
            };
            res.status(400).json(response);
            return
        }

        const allFriendsObj: any[] = []

        allFriendRequests.forEach(async friendRequest => {
            if (friendRequest.senderUserId === userInDb.id) {
                allFriendsObj.push(await prisma.user.findFirst({ where: { id: friendRequest.receiverUserId } }))
            } else {
                allFriendsObj.push(await prisma.user.findFirst({ where: { id: friendRequest.senderUserId } }))
            }
        })

        const response: Response = {
            status: "success",
            message: "Friends fetched successfully",
            data: allFriendsObj,
        };

    } catch (error) {
        const response: Response = {
            status: "error",
            message: "Something went wrong",
            data: null,
        };
        res.status(500).json(response);
    }
})

friendRouter.get(ROUTES_CONFIG.protected.friend[2], async (req, res) => {

    /**
     * @description - Get pending friend requests
     */

    try {

        const userEmail = req.headers["email"];

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

        const friendRequestsSent = await prisma.friendRequest.findMany({
            where: {
                senderUserId: userInDb.id,
                status: 'PENDING'
            }
        });

        if (!friendRequestsSent) {
            const response: Response = {
                status: "error",
                message: "No pending friend requests found",
                data: null,
            };
            res.status(400).json(response);
            return
        }

        const friendRequestSentData: any[] = []

        friendRequestsSent.forEach(async friendRequest => {
            friendRequestSentData.push({
                sender: (await prisma.user.findFirst({ where: { id: friendRequest.senderUserId } }))?.name,
                receiver: (await prisma.user.findFirst({ where: { id: friendRequest.receiverUserId } }))?.name
            })
        })


        const response: Response = {
            status: "success",
            message: "Pending friend requests fetched successfully",
            data: friendRequestSentData,
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

friendRouter.post(ROUTES_CONFIG.protected.friend[3], async (req, res) => {

    /**
     * @description - Respond to friend requests
     */

    try {

        const userEmail = req.headers["email"];

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

        const friendRequestData = friendRequestRespondSchema.parse(req.body);

        if (!friendRequestData) {
            const response: Response = {
                status: "error",
                message: "Invalid payload",
                data: null,
            };
            res.status(400).json(response);
            return
        }

        const friendRequest = await prisma.friendRequest.findFirst({
            where: {
                senderUserId: userInDb.id,
                receiverUserId: friendRequestData.receiverId,
                status: 'PENDING'
            }
        })

        if (!friendRequest) {
            const response: Response = {
                status: "error",
                message: "Friend request does not exist",
                data: null,
            };
            res.status(400).json(response);
            return
        }

        if (friendRequestData.status === "ACCEPT") {
            await prisma.friendRequest.update({
                where: {
                    id: friendRequest.id,
                },
                data: {
                    status: "RESOLVED",
                }
            })

            const response: Response = {
                status: "success",
                message: "Friend request accepted successfully",
                data: null,
            };

            res.status(200).json(response);

        } else {

            await prisma.friendRequest.delete({
                where: {
                    id: friendRequest.id,
                }
            })

            const response: Response = {
                status: "success",
                message: "Friend request rejected successfully",
                data: null,
            };

            res.status(200).json(response);
        }

    } catch (error) {

        const response: Response = {
            status: "error",
            message: "Something went wrong",
            data: null,
        };

        res.status(500).json(response);

    }

})