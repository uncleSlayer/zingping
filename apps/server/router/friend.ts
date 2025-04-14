import { Router } from "express";
import { z } from "zod";
import { Response } from "../types/responseType";
import { ROUTES_CONFIG } from "../config/routes";
import { prisma } from "../prisma";

export const friendRouter = Router();

const friendRequestSchema = z.object({
  email: z.string().email(),
});

const friendRequestRespondSchema = z.object({
  status: z.enum(["ACCEPT", "REJECT"]),
  senderId: z.string(),
});

const searchNewFriendSchema = z.object({
  email: z.string().email(),
});

friendRouter.post(
  ROUTES_CONFIG.protected.friends.friendsAdd.path,
  async (req, res) => {
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
        return;
      }

      if (!userEmail) {
        const response: Response = {
          status: "error",
          message: "Can not retrieve user email from header",
          data: null,
        };
        res.status(400).json(response);
        return;
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
        return;
      }

      const friendRequestData = friendRequestSchema.parse(req.body);

      if (friendRequestData.email === userEmail) {
        const response: Response = {
          status: "error",
          message: "Can not add yourself as a friend",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      if (!friendRequestData) {
        const response: Response = {
          status: "error",
          message: "Invalid payload",
          data: null,
        };
        res.status(400).json(response);
        return;
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
        return;
      }

      const friendRequest = await prisma.friendRequest.findFirst({
        where: {
          OR: [
            {
              senderUserId: userInDb.id,
              receiverUserId: requestedUser?.id,
              status: "PENDING",
            },
            {
              receiverUserId: userInDb.id,
              senderUserId: requestedUser?.id,
              status: "PENDING",
            },
          ],
        },
      });

      if (friendRequest) {
        const response: Response = {
          status: "error",
          message: "Friend request already exists",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      const friendRequestResolved = await prisma.friendRequest.findFirst({
        where: {
          OR: [
            {
              senderUserId: userInDb.id,
              receiverUserId: requestedUser?.id,
              status: "RESOLVED",
            },
            {
              receiverUserId: userInDb.id,
              senderUserId: requestedUser?.id,
              status: "RESOLVED",
            },
          ],
        },
      });

      if (friendRequestResolved) {
        const response: Response = {
          status: "error",
          message: "You are already friends with this user",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      await prisma.friendRequest.create({
        data: {
          receiverUserId: requestedUser?.id,
          senderUserId: userInDb.id,
        },
      });

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
  }
);

friendRouter.get(
  ROUTES_CONFIG.protected.friends.friendGetAll.path,
  async (req, res) => {
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
        return;
      }

      if (!userEmail) {
        const response: Response = {
          status: "error",
          message: "Can not retrieve user email from header",
          data: null,
        };
        res.status(400).json(response);
        return;
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
        return;
      }

      const allFriendRequests = await prisma.friendRequest.findMany({
        where: {
          OR: [
            { senderUserId: userInDb.id, status: "RESOLVED" },
            { receiverUserId: userInDb.id, status: "RESOLVED" },
          ],
        },
        include: {
          sender: true,
          receiver: true,
        },
      });

      const friends = allFriendRequests.map((request) => {
        const friend =
          request.senderUserId === userInDb.id
            ? request.receiver
            : request.sender;
        return {
          id: friend.id,
          email: friend.email,
          imageUrl: friend.imageUrl,
        };
      });

      const response: Response = {
        status: "success",
        message: "Friends fetched successfully",
        data: friends,
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
  }
);

friendRouter.get(
  ROUTES_CONFIG.protected.friends.sentFriendRequestPending.path,
  async (req, res) => {
    /**
     * @description - Get pending friend requests
     */

    try {
      const userEmail = req.headers["email"];
      console.log("Fetching pending requests for user:", userEmail);

      if (Array.isArray(userEmail)) {
        const response: Response = {
          status: "error",
          message: "Can not retrieve user email from header",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      if (!userEmail) {
        const response: Response = {
          status: "error",
          message: "Can not retrieve user email from header",
          data: null,
        };
        res.status(400).json(response);
        return;
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
        return;
      }

      console.log("Found user in DB:", userInDb.id);

      // Get all pending friend requests where the current user is either sender or receiver
      const pendingRequests = await prisma.friendRequest.findMany({
        where: {
          OR: [
            { senderUserId: userInDb.id, status: "PENDING" },
            { receiverUserId: userInDb.id, status: "PENDING" },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              email: true,
              imageUrl: true,
            },
          },
          receiver: {
            select: {
              id: true,
              email: true,
              imageUrl: true,
            },
          },
        },
      });

      console.log("Found pending requests:", pendingRequests);

      // Transform the data to match what the frontend expects
      const formattedRequests = pendingRequests.map((request) => {
        const isSender = request.senderUserId === userInDb.id;
        return {
          id: request.id,
          receiver: request.receiver.email,
          receiverId: request.receiver.id,
          sender: request.sender.email,
          senderId: request.sender.id,
          status: request.status,
          isSender,
        };
      });

      console.log("Formatted requests:", formattedRequests);

      const response: Response = {
        status: "success",
        message: "Pending friend requests fetched successfully",
        data: formattedRequests,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      const response: Response = {
        status: "error",
        message: "Something went wrong",
        data: null,
      };
      res.status(500).json(response);
    }
  }
);

friendRouter.post(
  ROUTES_CONFIG.protected.friends.friendRespond.path,
  async (req, res) => {
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
        return;
      }

      if (!userEmail) {
        const response: Response = {
          status: "error",
          message: "Can not retrieve user email from header",
          data: null,
        };
        res.status(400).json(response);
        return;
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
        return;
      }

      const friendRequestData = friendRequestRespondSchema.parse(req.body);

      if (!friendRequestData) {
        const response: Response = {
          status: "error",
          message: "Invalid payload",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      const friendRequest = await prisma.friendRequest.findFirst({
        where: {
          sender: {
            email: friendRequestData.senderId,
          },
          receiverUserId: userInDb.id,
          status: "PENDING",
        },
      });

      if (!friendRequest) {
        const response: Response = {
          status: "error",
          message: "Friend request does not exist",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      if (friendRequestData.status === "ACCEPT") {
        await prisma.friendRequest.update({
          where: {
            id: friendRequest.id,
          },
          data: {
            status: "RESOLVED",
          },
        });

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
          },
        });

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
  }
);

friendRouter.get(
  ROUTES_CONFIG.protected.friends.searchNewFriend.path,
  async (req, res) => {
    /**
     * @description - Search for a new friend
     */

    try {
      const userEmail = req.headers["email"];
      console.log("we are here");
      if (Array.isArray(userEmail)) {
        const response: Response = {
          status: "error",
          message: "Can not retrieve user email from header",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      if (!userEmail) {
        const response: Response = {
          status: "error",
          message: "Can not retrieve user email from header",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      const searchEmail = req.query.email as string;

      if (!searchEmail) {
        const response: Response = {
          status: "error",
          message: "Email is required",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      try {
        searchNewFriendSchema.parse({ email: searchEmail });
      } catch (error) {
        const response: Response = {
          status: "error",
          message: "Invalid email format",
          data: null,
        };
        res.status(400).json(response);
        return;
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
        return;
      }

      // Don't allow searching for yourself
      if (searchEmail === userEmail) {
        const response: Response = {
          status: "error",
          message: "Cannot search for yourself",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      const searchedUser = await prisma.user.findUnique({
        where: {
          email: searchEmail,
        },
      });

      if (!searchedUser) {
        const response: Response = {
          status: "error",
          message: "User not found",
          data: null,
        };
        res.status(404).json(response);
        return;
      }

      // Check if they are already friends
      const existingFriendRequest = await prisma.friendRequest.findFirst({
        where: {
          OR: [
            { senderUserId: userInDb.id, receiverUserId: searchedUser.id },
            { senderUserId: searchedUser.id, receiverUserId: userInDb.id },
          ],
          status: "RESOLVED",
        },
      });

      if (existingFriendRequest) {
        const response: Response = {
          status: "error",
          message: "You are already friends with this user",
          data: null,
        };
        res.status(400).json(response);
        return;
      }

      const response: Response = {
        status: "success",
        message: "User found successfully",
        data: {
          id: searchedUser.id,
          email: searchedUser.email,
          imageUrl: searchedUser.imageUrl,
        },
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
  }
);
