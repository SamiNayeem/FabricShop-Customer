import { NextRequest, NextResponse } from "next/server";
const pool = require('@/config/db');

type UserRequest = {
    name?: string;
    createdby?: number;
    id?: number;
    updatedby?: number;
    deletedby?: number;
}

export async function GET(req: NextRequest) {
    try {
        const GetCategoryInfo = "SELECT id, name, activestatus, createdat, createdby, updatedat, updatedby FROM categories WHERE activestatus = 1";
        const [result] = await pool.execute(GetCategoryInfo);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { name, createdby } = await req.json() as UserRequest;
    if (!name || !createdby) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const InsertCategoryInfo = `INSERT INTO categories (name, createdby, createdat) VALUES (?, ?, NOW())`;
    const CheckDuplicateName = `SELECT COUNT(*) AS count FROM categories WHERE LOWER(name) = LOWER(?) AND activestatus = 1`;

    try {
        const [rows] = await pool.execute(CheckDuplicateName, [name]);
        const count = rows[0].count;
        if (count > 0) {
            return NextResponse.json({ error: 'Category name already exists' }, { status: 400 });
        }
        const result = await pool.execute(InsertCategoryInfo, [name, createdby]);
        return NextResponse.json({ message: 'Category added successfully', result }, { status: 200 });
    } catch (error) {
        console.error('Error inserting Category:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const { id, name, updatedby } = await req.json() as UserRequest;
    if (!id || !name || !updatedby) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const updateQuery = `UPDATE categories SET name = ?, updatedby = ?, updatedat = NOW() WHERE id = ?`;
    const CheckDuplicateName = `SELECT COUNT(*) AS count FROM categories WHERE LOWER(name) = LOWER(?) AND activestatus = 1 AND id != ?`;

    try {
        const [rows] = await pool.execute(CheckDuplicateName, [name, id]);
        const count = rows[0].count;
        if (count > 0) {
            return NextResponse.json({ error: 'Category name already exists' }, { status: 400 });
        }
        const result = await pool.execute(updateQuery, [name, updatedby, id]);
        return NextResponse.json({ message: 'Category updated successfully', result }, { status: 200 });
    } catch (error) {
        console.error('Error updating Category:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { id, deletedby } = await req.json() as UserRequest;
    if (!id || !deletedby) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const deleteCategory = `UPDATE categories SET activestatus = 0, deletedby = ?, deletedat = NOW() WHERE id = ?`;

    try {
        const result = await pool.execute(deleteCategory, [deletedby, id]);
        return NextResponse.json({ message: 'Category deleted successfully', result }, { status: 200 });
    } catch (error) {
        console.error('Error deleting Category:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
