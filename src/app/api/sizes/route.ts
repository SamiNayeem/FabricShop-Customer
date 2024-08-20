import { NextRequest, NextResponse } from "next/server";
const pool = require('@/config/db');

type UserRequest = {
    name?: string;
    createdby?: number;
    id?: number;
    updatedby?: number;
    deletedby?: number;
    chest?: number;
    waist?: number;
}

export async function GET(req: NextRequest) {
    try {
        const GetSizeInfo = "SELECT id, name, chest, waist, activitystatus, createdat, createdby, updatedat, updatedby FROM sizes WHERE activitystatus = 1";
        const [result] = await pool.execute(GetSizeInfo);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching sizes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { name, chest, waist, createdby } = await req.json() as UserRequest;
    if (!name || chest === undefined || waist === undefined || !createdby) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const InsertSizeInfo = `INSERT INTO sizes (name, chest, waist, createdby, createdat) VALUES (?, ?, ?, ?, NOW())`;
    const CheckDuplicateName = `SELECT COUNT(*) AS count FROM sizes WHERE LOWER(name) = LOWER(?) AND activitystatus = 1`;

    try {
        const [rows] = await pool.execute(CheckDuplicateName, [name]);
        const count = rows[0].count;
        if (count > 0) {
            return NextResponse.json({ error: 'Size name already exists' }, { status: 400 });
        }
        const result = await pool.execute(InsertSizeInfo, [name, chest, waist, createdby]);
        return NextResponse.json({ message: 'Size added successfully', result }, { status: 200 });
    } catch (error) {
        console.error('Error inserting Size:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const { id, name, chest, waist, updatedby } = await req.json() as UserRequest;
    if (!id || !name || chest === undefined || waist === undefined || !updatedby) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const updateQuery = `UPDATE sizes SET name = ?, chest = ?, waist = ?, updatedby = ?, updatedat = NOW() WHERE id = ?`;
    const CheckDuplicateName = `SELECT COUNT(*) AS count FROM sizes WHERE LOWER(name) = LOWER(?) AND activitystatus = 1 AND id != ?`;

    try {
        const [rows] = await pool.execute(CheckDuplicateName, [name, id]);
        const count = rows[0].count;
        if (count > 0) {
            return NextResponse.json({ error: 'Size name already exists' }, { status: 400 });
        }
        const result = await pool.execute(updateQuery, [name, chest, waist, updatedby, id]);
        return NextResponse.json({ message: 'Size updated successfully', result }, { status: 200 });
    } catch (error) {
        console.error('Error updating Size:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { id, deletedby } = await req.json() as UserRequest;
    if (!id || !deletedby) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const deleteSize = `UPDATE sizes SET activitystatus = 0, deletedby = ?, deletedat = NOW() WHERE id = ?`;

    try {
        const result = await pool.execute(deleteSize, [deletedby, id]);
        return NextResponse.json({ message: 'Size deleted successfully', result }, { status: 200 });
    } catch (error) {
        console.error('Error deleting Size:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
