"use client";
import { DragDropContext, Draggable, DropResult } from "@hello-pangea/dnd";
import { Droppable } from "@hello-pangea/dnd";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Task, User } from "@/types";
import TaskItem from "./TaskItem";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchUser } from "@/redux/actions/userAction";
import toast from "react-hot-toast";
import { socket } from "@/helpers/socket";
import { updateAll } from "@/redux/actions/taskAction";
import Link from "next/link";

const TaskBoard = ({ initialTasks }: { initialTasks: Task[] }) => {
  const dispatch = useAppDispatch();
  const { filteredData } = useAppSelector((state) => state.tasks);
  const { userData } = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [task, setTasks] = useState<Task[]>(initialTasks);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const groupedTasks = initialTasks.reduce(
    (acc: Record<string, Task[]>, task) => {
      if (!acc[task.status]) acc[task.status] = [];
      acc[task.status].push(task);
      return acc;
    },
    {}
  );

  const groupedFilteredTasks =
    filteredData?.reduce((acc: Record<string, Task[]>, task) => {
      if (!acc[task.status]) acc[task.status] = [];
      acc[task.status].push(task);
      return acc;
    }, {}) || {};

  useEffect(() => {
    const getUser = async () => {
      const res = await dispatch(fetchUser());
      if (res && res.data) {
        setUsers(Array.isArray(res.data) ? res.data : [res.data]);
      }
    };
    getUser();
  }, [dispatch]);

  useEffect(() => {
    if (!userData?._id) return;
    socket.emit("join", userData._id);
    const handleTaskAssigned = (data: { title: string }) => {
      toast.success(`New task assigned to you: ${data.title}`);
    };
    socket.on("taskAssigned", handleTaskAssigned);
    return () => {
      socket.off("taskAssigned", handleTaskAssigned);
    };
  }, [userData?._id]);

  const getTasksToDisplay = (status: string) => {
    if (filteredData && filteredData.length > 0) {
      return groupedFilteredTasks[status] || [];
    }
    return groupedTasks[status] || [];
  };
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const startStatus = source.droppableId;
    const finishStatus = destination.droppableId;
    const taskIndex = initialTasks.findIndex(
      (task) => task._id === draggableId
    );

    if (taskIndex === -1) return;

    const updatedTasks = [...initialTasks];
    const [movedTask] = updatedTasks.splice(taskIndex, 1);

    // Update status if moving between columns
    if (startStatus !== finishStatus) {
      movedTask.status = finishStatus as
        | "not-started"
        | "in-progress"
        | "completed";
    }

    // Find the correct position to insert
    const finishTasks = updatedTasks.filter(
      (task) => task.status === finishStatus
    );
    const newIndex =
      destination.index > finishTasks.length
        ? finishTasks.length
        : destination.index;

    // Insert at new position
    const insertPosition = updatedTasks.findIndex(
      (task) =>
        task.status === finishStatus &&
        updatedTasks.filter((t) => t.status === finishStatus).indexOf(task) >=
          newIndex
    );

    updatedTasks.splice(
      insertPosition >= 0 ? insertPosition : updatedTasks.length,
      0,
      movedTask
    );
    setTasks(updatedTasks);

    console.log("hey");
    await dispatch(updateAll(updatedTasks));
  };
  console.log(task);

  return (
    <div className="min-h-screen w-screen mb-12 rounded bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-8xl mx-auto"
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Task Dashboard
            </h1>
            <div className="flex gap-2">
              {["Not Started", "In Progress", "Completed"].map((status) => (
                <div key={status} className="flex items-center gap-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      status === "Not Started"
                        ? "bg-red-500"
                        : status === "In Progress"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                  />
                  <span className="text-sm text-gray-600">{status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { status: "not-started", title: "Not Started", color: "red" },
              { status: "in-progress", title: "In Progress", color: "amber" },
              { status: "completed", title: "Completed", color: "emerald" },
            ].map((column) => (
              <Droppable key={column.status} droppableId={column.status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`h-full rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? "bg-gray-50" : "bg-transparent"
                    }`}
                  >
                    <Column
                      title={column.title}
                      status={column.status}
                      color={column.color}
                      tasks={getTasksToDisplay(column.status)}
                      users={users}
                      isFiltering={!!filteredData && filteredData.length > 0}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </motion.div>
    </div>
  );
};

interface ColumnProps {
  title: string;
  status: string;
  color: string;
  tasks: Task[];
  users: User[];
  isFiltering: boolean;
}

const Column = ({ title, color, tasks, users, isFiltering }: ColumnProps) => {
  const colorMap = {
    red: {
      bg: "bg-red-500",
      bgLight: "bg-red-100",
      text: "text-red-800",
      hover: "hover:bg-red-600",
    },
    amber: {
      bg: "bg-amber-500",
      bgLight: "bg-amber-100",
      text: "text-amber-800",
      hover: "hover:bg-amber-600",
    },
    emerald: {
      bg: "bg-emerald-500",
      bgLight: "bg-emerald-100",
      text: "text-emerald-800",
      hover: "hover:bg-emerald-600",
    },
  };

  const colorClass = colorMap[color as keyof typeof colorMap];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full flex flex-col w-full"
    >
      <div
        className={`border-t-4 ${colorClass.bg} bg-white rounded-lg shadow-sm h-full flex flex-col`}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${colorClass.bg}`}></div>
              {title}
            </h2>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass.bgLight} ${colorClass.text}`}
            >
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
              {isFiltering && tasks.length === 0 && " (filtered)"}
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id!} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`mb-3 ${
                      snapshot.isDragging
                        ? "opacity-75 shadow-lg"
                        : "opacity-100"
                    }`}
                    style={provided.draggableProps.style}
                  >
                    <TaskItem task={task} users={users} />
                  </div>
                )}
              </Draggable>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              {isFiltering ? "No matching tasks" : "No tasks in this column"}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <Link href="/addtask">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-2 text-sm font-medium rounded-md ${colorClass.bg} text-white ${colorClass.hover} transition-colors`}
            >
              + Add Task
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskBoard;
