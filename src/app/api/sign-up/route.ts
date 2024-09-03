import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import bcrypt from "bcryptjs"
import { nanoid } from 'nanoid';
import { sendVerifyEmail } from "@/helpers/sendVerifyEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email, password } = await request.json();

        const existingUserbyEmail = await UserModel.findOne({ email });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const signUpToken = nanoid(32)

        if (existingUserbyEmail) {
            if (existingUserbyEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "Email Already exists!"
                }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)

                existingUserbyEmail.password = hashedPassword;
                existingUserbyEmail.signUpToken = signUpToken;
                existingUserbyEmail.verifyCode = verifyCode;
                existingUserbyEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                await existingUserbyEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username: email.split("@")[0],
                email,
                password: hashedPassword,
                signUpToken,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingTestimonials: true,
                testimonial: [],
            })

            await newUser.save();
        }

        //& send verification email
        const emailResponse = await sendVerifyEmail(
            email, signUpToken, verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message,
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            token: signUpToken,
            message: "User registered sucessfully! Email verification pending.",
        }, { status: 201 });


    } catch (error) {
        console.error("Error signing up: ", error);
        return Response.json({
            success: false,
            message: 'Error signing up!'
        }, { status: 500 })
    }
}