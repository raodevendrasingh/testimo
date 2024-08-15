import { z } from 'Zod';
import dbConnect from '@/lib/dbConnect';
import { UserModel } from '@/models/User';
import { usernameValidation } from '@/schemas/signUpSchema';

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
   
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result); //Todo: remove

        if (!result.success) {
            const usernameErr = result.error.format().username?._errors || []
            return Response.json({
                sucess: false,
                message: usernameErr?.length > 0 ? usernameErr.join(',') : "Invalid query parameters",
            }, { status: 400 })
        }

        const { username } = result.data

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })

        if (existingVerifiedUser) {
            return Response.json({
                sucess: false,
                message: "Username is already taken"
            }, { status: 400 })
        }

        return Response.json({
            sucess: true,
            message: "Username is available"
        }, { status: 200 })




    } catch (error) {
        console.error("Error checking username!\n", error);
        return Response.json({
            sucess: false,
            message: "Error checking username"
        }, { status: 500 })
    }
}