import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const pool = require('@/config/db');

type UserRequest = {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  address: string;
};

export async function POST(req: NextRequest) {
  try {
    const { firstname, lastname, username, email, password, address } = (await req.json()) as UserRequest;

    // Check if the user already exists
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const [result] = await pool.query(
      'INSERT INTO users (firstname, lastname, username, email, userpassword, address, userrole, createdat) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [firstname, lastname, username, email, hashedPassword, address, 'customer']
    );

    return NextResponse.json({ message: 'User registered successfully', userId: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Error registering user:' ,error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
