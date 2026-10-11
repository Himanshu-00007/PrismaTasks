import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.js";
import { addTask, deleteTask, getTask, updateTask } from "../controllers/task.controllers.js";
const router=Router();

router.post("/add-task",verifyJwt,addTask)
router.get("/get-task",verifyJwt,getTask)
router.delete("/:t_id",verifyJwt,deleteTask)
router.put("/:t_id",verifyJwt,updateTask)