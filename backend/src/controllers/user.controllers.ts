import { prisma } from "../lib/db_init.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUser=async(req:Request,res:Response)=>{
  try{
    const id=Number(req.userId)
    

    const user=await prisma.user.findUnique({
      where:{
        id:id
      },
      omit:{
        password:true
      }
    })
    if(!user){
      return res.status(404).json({
        message:"user not found"
      })
    }
    return res.status(200).json({
      message:"fetching user successfully",
      user
    })
  }
  catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      return res.status(404).json({
        message: "name is required",
      });
    }
    if (!email) {
      return res.status(404).json({
        message: "email is required",
      });
    }
    if (!password) {
      return res.status(404).json({
        message: "password is required",
      });
    }
    const alreadyExists = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (alreadyExists) {
      return res.status(401).json({
        message: "user already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
      },
    });
    const { password: _, ...safeUser } = newUser;
    const token = jwt.sign(
      {
        user_id: newUser.id,
      },
      process.env.TOKEN_SECRET_KEY!
    );
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      })
      .json({
        safeUser,
        message: "user registered successfully",
      });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(404).json({
        message: "email is required",
      });
    }
    if (!password) {
      return res.status(404).json({
        message: "password is required",
      });
    }
    const currUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!currUser) {
      return res.status(404).json({
        message: "user does not exists",
      });
    }
    const isValid = bcrypt.compare(password, currUser.password);
    if (!isValid) {
      return res.status(404).json({
        message: "invalid password",
      });
    }
    const { password: _, ...safeUser } = currUser;
    const token = jwt.sign( 
      {
        user_id: currUser.id,
      },
      process.env.TOKEN_SECRET_KEY!
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      })
      .json({
        safeUser,
        message: "user login successfully",
      });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({
      message: "user logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
