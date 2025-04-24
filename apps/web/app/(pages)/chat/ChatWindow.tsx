"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SocketContext } from "@/contexts/SocketProvider";
import { MoreVertical, VideoIcon, SearchIcon, Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/contexts/TanstackQueryProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AuthContext } from "@/contexts/AuthProvider";
import { API_HOST } from "@/config/host";

const ChatWindow = ({
  friendInfo,
}: {
  friendInfo: {
    id: string;
    email: string;
    imageUrl: string;
  } | null;
}) => {
  if (!friendInfo) return <h3>Open chat with a friend to see messages...</h3>;

  const [messageText, setMessageText] = useState("");
  useEffect(() => {
    setMessageText("");
  }, [friendInfo]);

  const socketContext = useContext(SocketContext);
  const auth = useContext(AuthContext);
  const email = auth?.email;

  if (!socketContext?.isConnected) {
    return <div className="h-full flex items-center justify-center">
      <h3 className="text-gray-500">Connecting to chat server...</h3>
    </div>
  }

  const {
    data: messagesData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["personal-message", friendInfo.email],
    queryFn: async () => {
      const response = await fetch(
        `${API_HOST}/chat/get/all?otherPersonEmail=${friendInfo.email}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data.data;
    },
  });

  if (isPending) return <h3>Loading your messages...</h3>;
  if (isError) return <h3>Something went wrong...</h3>;

  return (
    <div className="h-full">
      {friendInfo && (
        <div className="flex gap-2 flex-col h-full">
          <Card className="mb-2 p-0 shadow-none flex cursor-pointer justify-between items-center gap-5 border-none">
            <h3 className="font-medium text-xl mr-auto">{friendInfo.email}</h3>
            {/* <div className="flex items-center gap-2">
              <VideoIcon className="hover:bg-[rgb(238,238,248)] rounded-full w-8 h-8 p-1" />
              <MoreVertical className="hover:bg-[rgb(238,238,248)] rounded-full w-8 h-8 p-1" />
            </div> */}
          </Card>
          <ScrollArea className="basis-4/6 h-3/4 shadow-none border rounded-lg">
            {messagesData.map((message: any, index: number) => {
              return (
                <ul className="flex flex-col justify-evenly">
                  <li
                    className={`${message.sender.email === email ? `bg-[rgb(118,120,237)] w-fit px-5 py-1 mx-3 my-1 rounded-full text-white self-end` : `bg-[rgb(238,238,248)] w-fit px-5 py-1 mx-3 my-1 rounded-full self-start`}`}
                  >
                    {message.message}
                  </li>
                </ul>
              );
            })}
          </ScrollArea>
          <Card className="basis-1/6 left-11 flex gap-2 border-none shadow-none items-center py-2">
            <div className="flex items-center bg-[rgb(238,238,248)] py-1 px-3 rounded-lg w-full">
              <Input
                type="text"
                value={messageText}
                placeholder="Message"
                onChange={(e) => setMessageText(e.target.value)}
                className="outline-none rounded-none"
              />
              <Send
                onClick={() => {
                  try {
                    socketContext?.sendMessage({
                      to: friendInfo.email,
                      msg: messageText,
                      from: email!,
                      time: Date.now(),
                    });
                    setMessageText("");
                    queryClient.setQueryData(
                      ["personal-message", friendInfo.email],
                      (oldData: any) =>
                        oldData
                          ? [
                              ...oldData,
                              {
                                sender: { email: email },
                                message: messageText,
                              },
                            ]
                          : oldData
                    );
                  } catch (error) {
                    console.log(error);
                  }
                }}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
