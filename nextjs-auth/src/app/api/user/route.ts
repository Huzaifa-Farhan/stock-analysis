import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {hash} from 'bcrypt';
import * as z from 'zod';

//define schema for input validation
const userSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
})
//my entire signup page was not working becasue the line below was in the userSchema. idk why???
// confirmPassword: z.string().min(1, 'Password confirmation is required'),

export async function POST(req: Request){
    try {
        //post api stuff
        const body = await req.json();

        const {email, username, password} = userSchema.parse(body);

       
        //check if email already exists
        const existingUserbyEmail = await db.user.findUnique({
            where: {email: email}
        })
        if(existingUserbyEmail){
            return NextResponse.json({user: null, message: "User with this email already exists"}, {status: 409})
        }

        //check if username already exists
        const existingUserbyUsername = await db.user.findUnique({
            where: {username: username}
        })
        if(existingUserbyUsername){
            return NextResponse.json({user: null, message: "User with this Username already exists"}, {status: 409})
        }

        const hashedPassword = await hash(password, 10);
        const newUser = await db.user.create({
            data:{
                username,
                email,
                password: hashedPassword
            }
        })
        const {password: newUserPassword, ...rest} = newUser;
        return NextResponse.json({user: rest, message: "User Created Successfully!"}, {status: 201});
    } catch (error) {
        return NextResponse.json({message: "Something went Wrong!"}, {status: 500});

        
    }
}