"use client";

import { ReactNode, useEffect } from "react";
import { socket } from "@/helpers/socket";
import { useAuth } from "@/hooks/useAuth";
import customToast from "@/hooks/customToast";

export default function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id); // Join the user's room

      // Handler for task assignment notifications
      const handleTaskAssigned = (data: {title:string,message:string}) => {
        customToast(data.title, data.message);
      };

      // Handler for task edit notifications
      const handleTaskEdited = (data: {title:string,message:string}) => {
        customToast(data.title, data.message);
      };

      // Set up listeners
      socket.on("taskAssigned", handleTaskAssigned);
      socket.on("editTask", handleTaskEdited);

      // Cleanup function
      return () => {
        socket.off("taskAssigned", handleTaskAssigned);
        socket.off("editTask", handleTaskEdited);
      };
    }
  }, [user?._id]);

  return <>{children}</>;
}