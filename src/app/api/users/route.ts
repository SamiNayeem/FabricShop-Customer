import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
const pool = require('@/config/db');

type UserRequest = {
    id?: number;
    firstname?: string;
    lastname?: string;
    username?: string;
    userpassword?: string;
    address?: string;
    email?: string;
    userrole?: string;
}

export async function GET(req: NextRequest) {
    try {
        const GetUserInfo = "SELECT id, firstname, lastname, username, userrole, status, email, createdat, image FROM users WHERE UserRole = 'admin'";
        const [result] = await pool.execute(GetUserInfo);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { firstname, lastname, username, userpassword, address, email } = await req.json() as UserRequest;
    if (!firstname || !lastname || !username || !userpassword || !address || !email) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const saltRounds = 5;

    try {
        const HashedPassword = await bcrypt.hash(userpassword, saltRounds);

        const CheckUsernameQuery = "SELECT username FROM users WHERE username = ?";
        const [ExistingUsernames] = await pool.execute(CheckUsernameQuery, [username]);

        if (ExistingUsernames.length > 0) {
            return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
        }

        const InsertUserInfo = `
            INSERT INTO users (firstname, lastname, username, userpassword, address, email, userrole, createdat)
            VALUES (?, ?, ?, ?, ?, ?, 'admin', NOW())
        `;

        const result = await pool.execute(InsertUserInfo, [firstname, lastname, username, HashedPassword, address, email]);
        return NextResponse.json({ message: 'User registered successfully', result }, { status: 200 });
    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const { id, firstname, lastname, username, address, email } = await req.json() as UserRequest;
    if (!id || !firstname || !lastname || !username || !address || !email) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const updateQuery = `
            UPDATE users
            SET firstname = ?, lastname = ?, username = ?, address = ?, email = ?, updatedat = NOW()
            WHERE id = ?
        `;

        const result = await pool.execute(updateQuery, [firstname, lastname, username, address, email, id]);
        return NextResponse.json({ message: 'User updated successfully', result }, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { id } = await req.json() as UserRequest;
    if (!id) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const deleteUserQuery = `UPDATE users SET activestatus = 0, deletedat = NOW() WHERE id = ?`;
        const result = await pool.execute(deleteUserQuery, [id]);
        return NextResponse.json({ message: 'User deleted successfully', result }, { status: 200 });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
