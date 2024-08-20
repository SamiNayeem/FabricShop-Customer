import { NextRequest, NextResponse } from "next/server";
const pool = require("@/config/db");

type UserRequest = {
  name: string;
  createdby?: number;
  id?: number;
  updatedby?: number;
  deletedby?: number;
  hexcode?: string;
};

export async function GET(req: NextRequest) {
  try {
    
    const GetColorInfo =
      "SELECT id, name, hexcode, createdat, createdby, updatedat, updatedby, activestatus FROM colors WHERE activestatus = 1 LIMIT 5";
    const [result] = await pool.execute(GetColorInfo);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching colors:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { name, hexcode, createdby } = (await req.json()) as UserRequest;
  const InsertColorInfo = `INSERT INTO colors (name, hexcode, createdby, createdat) VALUES (?, ?, ?, NOW())`;
  const CheckDuplicateName = `SELECT COUNT(*) AS count FROM colors WHERE LOWER(name) = LOWER(?) AND activestatus = 1`;

  try {
    const [rows] = await pool.execute(CheckDuplicateName, [name]);
    const count = rows[0].count;
    if (count > 0) {
      return NextResponse.json(
        { error: "Color name already exists" },
        { status: 400 }
      );
    }
    const result = await pool.execute(InsertColorInfo, [
      name,
      hexcode,
      createdby,
    ]);
    return NextResponse.json(
      { message: "Color added successfully", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error inserting Color:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { id, name, updatedby } = (await req.json()) as UserRequest;
  const updateQuery = `UPDATE colors SET name = ?, updatedby = ?, updatedat = NOW() WHERE id = ?`;
  const CheckDuplicateName = `SELECT COUNT(*) AS count FROM colors WHERE LOWER(name) = LOWER(?) AND activestatus = 1 AND id != ?`;

  try {
    const [rows] = await pool.execute(CheckDuplicateName, [name, id]);
    const count = rows[0].count;
    if (count > 0) {
      return NextResponse.json(
        { error: "Color name already exists" },
        { status: 400 }
      );
    }
    const result = await pool.execute(updateQuery, [name, updatedby, id]);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error updating Color:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { id, deletedby } = (await req.json()) as UserRequest;
  const deleteColor = `UPDATE colors SET activestatus = 0, deletedby = ?, deletedat = NOW() WHERE id = ?`;

  try {
    const result = await pool.execute(deleteColor, [deletedby, id]);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error deleting Color:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
