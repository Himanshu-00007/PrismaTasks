import { prisma } from "../lib/db_init.js";
import type { Request, Response } from "express";
type newData = {
  title?: string;
  completed?: boolean;
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const allTask = await prisma.tasks.findMany({
      where: {
        userId: Number(req.userId),
      },
    });
    return res.status(200).json({
      message: "fetching tasks successfully",
      allTask,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
export const addTask = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const user_Id = Number(req.userId);
    const newTask = await prisma.tasks.create({
      data: {
        title: title,
        userId: user_Id!,
        completed: false,
      },
    });
    return res.status(201).json({
      newTask,
      message: "task added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { t_id } = req.params;
    const id = Number(t_id);
    if (!t_id) {
      return res.status(400).json({
        message: "invalid task id",
      });
    }
    const { title, completed } = req.body;
    const newData: newData = {};
    if (title!==undefined) {
      newData.title = title;
    }
    if (completed!=undefined) {
      newData.completed = completed;
    }
    const updatedTask = await prisma.tasks.update({
      where: {
        taskId: id,
        userId: Number(req.userId),
      },
      data: newData,
    });
    return res.status(200).json({
      updatedTask,
      message: "task updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { t_id } = req.params;
    const id = Number(t_id);
    const deletedTask = await prisma.tasks.delete({
      where: {
        taskId: id,
        userId: Number(req.userId),
      },
    });

    return res.status(200).json({
      deleteTask,
      message: "task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
