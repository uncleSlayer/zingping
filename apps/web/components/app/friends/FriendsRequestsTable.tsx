"use client";

import { Card } from "@/components/ui/card";
import {
  FriendRequestsSent,
  FriendRequestsColumns,
} from "../table/columns/FriendRequestSentColumn";
import { DataTable } from "../table/table/Data-table";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { getAllSentRequests } from '@/app/actions/friends/sentFriendRequestsAction'
import { Skeleton } from "@/components/ui/skeleton";
import { API_HOST } from "@/config/host";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { AuthContext } from "@/contexts/AuthProvider";

interface FriendRequest {
  id: string;
  receiver: string;
  receiverId: string;
  sender: string;
  senderId: string;
  status: string;
  isSender: boolean;
}

const FriendsRequestTable = () => {
  const authContext = useContext(AuthContext);

  const loggedInUserEmail = authContext?.email;

  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery<FriendRequest[]>({
    queryKey: ["friend-requests"],
    queryFn: async () => {
      const response = await fetch(`${API_HOST}/friend/request/pending`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        return data.data;
      }
      throw new Error(data.message || "Failed to fetch friend requests");
    },
  });

  const handleAcceptRejectRequest = async (
    senderEmailId: string,
    acceptRejectAction: "ACCEPT" | "REJECT"
  ) => {
    try {
      const response = await fetch(`${API_HOST}/friend/respond`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: senderEmailId,
          status: acceptRejectAction,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
      } else {
        console.error("Failed to accept request:", data.message);
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[125px] w-[250px] rounded-lg" />;
  }

  return (
    <div className="flex flex-col">
      <h3 className="text-3xl my-2">Friend Requests</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {friendRequests?.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.id}</TableCell>
              <TableCell>
                {request.isSender ? request.receiver : request.sender}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800"
                >
                  Pending
                </Badge>
              </TableCell>
              <TableCell>
                {request.sender !== loggedInUserEmail ? (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAcceptRejectRequest(request.sender, "ACCEPT")}
                      className="h-8 w-8 p-0"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAcceptRejectRequest(request.sender, "REJECT")}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-gray-100 text-gray-800"
                  >
                    Sent
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FriendsRequestTable;
