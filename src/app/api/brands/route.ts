import { NextRequest, NextResponse } from "next/server";
const pool = require('@/config/db');

type UserRequest = {
    name: string;
    createdby?: number;
    id?: number;
    updatedby?: number;
    deletedby?: number;
}

export async function GET(req: NextRequest) {
    try {
        const GetBrandInfo = "SELECT id, name, createdat, createdby, updatedat, updatedby, activestatus FROM brands WHERE activestatus = 1";
        const [result] = await pool.execute(GetBrandInfo);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching brands:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { name, createdby } = await req.json() as UserRequest;
    const InsertBrandInfo = `INSERT INTO brands (name, createdby, createdat) VALUES (?, ?, NOW())`;
    const CheckDuplicateName = `SELECT COUNT(*) AS count FROM brands WHERE LOWER(name) = LOWER(?) AND activestatus = 1`;

    try {
        const [rows] = await pool.execute(CheckDuplicateName, [name]);
        const count = rows[0].count;
        if (count > 0) {
            return NextResponse.json({ error: 'Brand name already exists' }, { status: 400 });
        }
        const result = await pool.execute(InsertBrandInfo, [name, createdby]);
        return NextResponse.json({ message: 'Brand added successfully', result }, { status: 200 });
    } catch (error) {
        console.error('Error inserting Brand:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const { id, name, updatedby } = await req.json() as UserRequest;
    const updateQuery = `UPDATE brands SET name = ?, updatedby = ?, updatedat = NOW() WHERE id = ?`;
    const CheckDuplicateName = `SELECT COUNT(*) AS count FROM brands WHERE LOWER(name) = LOWER(?) AND activestatus = 1 AND id != ?`;

    try {
        const [rows] = await pool.execute(CheckDuplicateName, [name, id]);
        const count = rows[0].count;
        if (count > 0) {
            return NextResponse.json({ error: 'Brand name already exists' }, { status: 400 });
        }
        const result = await pool.execute(updateQuery, [name, updatedby, id]);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error updating Brand:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { id, deletedby } = await req.json() as UserRequest;
    const deleteBrand = `UPDATE brands SET activestatus = 0, deletedby = ?, deletedat = NOW() WHERE id = ?`;

    try {
        const result = await pool.execute(deleteBrand, [deletedby, id]);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error deleting Brand:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
