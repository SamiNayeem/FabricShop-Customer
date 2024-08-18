import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
const pool = require("@/config/db");
require("dotenv").config(); // Load environment variables from .env file

type UserRequest = {
  username: string;
  userpassword: string;
};

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  if (!JWT_SECRET) {
    return NextResponse.json(
      { error: "JWT_SECRET is not defined" },
      { status: 500 }
    );
  }
  const { username, userpassword } = (await req.json()) as UserRequest;
  try {
    // Check if the user exists
    const checkUserQuery = `
                    SELECT id, userpassword FROM users 
                    WHERE username = "${username}" AND userrole = 'customer'
                `;
    const [rows] = await pool.execute(checkUserQuery, [username]);

    if (rows.length === 0) {
      // User not found
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const user = rows[0];

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(
      userpassword,
      user.userpassword
    );

    if (!isPasswordValid) {
      // Invalid password
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET as string, {
      expiresIn: "1h",
    });

    // Return the token and user id
    return NextResponse.json({ message: "Login successful", token, userid: user.id }, { status: 200 });
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
