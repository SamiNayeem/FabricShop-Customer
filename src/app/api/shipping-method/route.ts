import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/config/db');

export async function GET(req: NextRequest) {
    try {
        const GetShippingMethodsInfo = `
            SELECT shippingmethod, createdat, createdby, updatedat, updatedby 
            FROM shippingmethods 
            WHERE activestatus = 1
        `;
        const [result] = await pool.execute(GetShippingMethodsInfo);
        console.log([result]);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching shipping methods:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { shippingmethod, createdby } = await req.json();

    if (!shippingmethod || !createdby) {
        return NextResponse.json({ error: 'Shipping method and createdby are required' }, { status: 400 });
    }

    const InsertShippingMethodsInfo = `
        INSERT INTO shippingmethods (shippingmethod, createdby, createdat)
        VALUES (?, ?, NOW())
    `;

    const CheckDuplicateName = `
        SELECT COUNT(*) AS count 
        FROM shippingmethods 
        WHERE LOWER(shippingmethod) = LOWER(?) AND activestatus = 1
    `;

    try {
        // Check for duplicate name in a case-insensitive manner
        const [rows] = await pool.execute(CheckDuplicateName, [shippingmethod]);
        const count = rows[0].count;
        
        if (count > 0) {
            return NextResponse.json({ error: 'Shipping method already exists' }, { status: 400 });
        }

        const [result] = await pool.execute(InsertShippingMethodsInfo, [shippingmethod, createdby]);
        return NextResponse.json({ message: 'Shipping method added successfully', result }, { status: 200 });
    } catch (error) {
        console.error('Error inserting shipping method:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const { shippingmethod, updatedby, id } = await req.json();

    if (!shippingmethod || !updatedby || !id) {
        return NextResponse.json({ error: 'Shipping method, updatedby, and ID are required' }, { status: 400 });
    }

    const updateQuery = `
        UPDATE shippingmethods
        SET shippingmethod = ?, updatedby = ?, updatedat = NOW()
        WHERE id = ?
    `;

    const CheckDuplicateName = `
        SELECT COUNT(*) AS count 
        FROM shippingmethods 
        WHERE LOWER(shippingmethod) = LOWER(?) AND activestatus = 1 AND id != ?
    `;

    try {
        // Check for duplicate name in a case-insensitive manner
        const [rows] = await pool.execute(CheckDuplicateName, [shippingmethod, id]);
        const count = rows[0].count;

        if (count > 0) {
            return NextResponse.json({ error: 'Shipping method already exists' }, { status: 400 });
        }

        const [result] = await pool.execute(updateQuery, [shippingmethod, updatedby, id]);
        return NextResponse.json({ message: 'Shipping method updated successfully', result }, { status: 200 });
    } catch (error) {
        console.error('Error updating shipping method:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { id, deletedby } = await req.json();

    if (!id || !deletedby) {
        return NextResponse.json({ error: 'ID and deletedby are required' }, { status: 400 });
    }

    try {
        const deleteshippingmethods = `
            UPDATE shippingmethods
            SET activestatus = 0, deletedby = ?, deletedat = NOW()
            WHERE id = ?
        `;
        const [result] = await pool.execute(deleteshippingmethods, [deletedby, id]);

        return NextResponse.json({ message: 'Shipping method deleted successfully', result }, { status: 200 });
    } catch (error) {
        console.error('Error deleting shipping method:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
