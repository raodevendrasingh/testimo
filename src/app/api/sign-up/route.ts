import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import bcrypt from "bcryptjs"
import { sendVerifyEmail } from "@/helpers/sendVerifyEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        const existingUserVerifiedbyUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingUserVerifiedbyUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {
                status: 400
            })
        }

        const existingUserbyEmail = await UserModel.findOne({ email });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserbyEmail) {
            if (existingUserbyEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "Email Already exists!"
                }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)

                existingUserbyEmail.password = hashedPassword;
                existingUserbyEmail.verifyCode = verifyCode;
                existingUserbyEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                await existingUserbyEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingFeedback: true,
                feedback: []
            })

            await newUser.save();
        }

        //& send verification email
        const emailResponse = await sendVerifyEmail(
            email, username, verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message,
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "User registered sucessfully! Email verification pending.",
        }, { status: 201 });


    } catch (error) {
        console.error("Error signing up: ", error);
        return Response.json({
            success: false,
            message: 'Failed to sign up'
        }, { status: 500 })
    }
}