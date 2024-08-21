import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/config/db');

export async function GET(req: NextRequest) {
    try {
        const GetPaymentMethodInfo = `
            SELECT id, paymentmethod AS name 
            FROM paymentmethods 
            WHERE activestatus = 1
        `;
        const [result] = await pool.execute(GetPaymentMethodInfo);
        console.log(result);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { paymentmethod, createdby } = await req.json();

    if (!paymentmethod || !createdby) {
        return NextResponse.json({ error: 'Payment method and createdby are required' }, { status: 400 });
    }

    const InsertPaymentMethodInfo = `
        INSERT INTO paymentmethods (paymentmethod, createdby, createdat)
        VALUES (?, ?, NOW())
    `;

    const CheckDuplicateName = `
        SELECT COUNT(*) AS count 
        FROM paymentmethods 
        WHERE LOWER(paymentmethod) = LOWER(?) AND activestatus = 1
    `;

    try {
        const [rows] = await pool.execute(CheckDuplicateName, [paymentmethod]);
        const count = rows[0].count;
        
        if (count > 0) {
            return NextResponse.json({ error: 'Payment method already exists' }, { status: 400 });
        }

        const [result] = await pool.execute(InsertPaymentMethodInfo, [paymentmethod, createdby]);
        return NextResponse.json({ message: 'Payment method added successfully', result }, { status: 200 });
    } catch (error) {
        console.error('Error inserting payment method:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const { paymentmethod, updatedby, id } = await req.json();

    if (!paymentmethod || !updatedby || !id) {
        return NextResponse.json({ error: 'Payment method, updatedby, and ID are required' }, { status: 400 });
    }

    const updateQuery = `
        UPDATE paymentmethods
        SET paymentmethod = ?, updatedby = ?, updatedat = NOW()
        WHERE id = ?
    `;

    const CheckDuplicateName = `
        SELECT COUNT(*) AS count 
        FROM paymentmethods 
        WHERE LOWER(paymentmethod) = LOWER(?) AND activestatus = 1 AND id != ?
    `;

    try {
        const [rows] = await pool.execute(CheckDuplicateName, [paymentmethod, id]);
        const count = rows[0].count;

        if (count > 0) {
            return NextResponse.json({ error: 'Payment method already exists' }, { status: 400 });
        }

        const [result] = await pool.execute(updateQuery, [paymentmethod, updatedby, id]);
        return NextResponse.json({ message: 'Payment method updated successfully', result }, { status: 200 });
    } catch (error) {
        console.error('Error updating payment method:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { id, deletedby } = await req.json();

    if (!id || !deletedby) {
        return NextResponse.json({ error: 'ID and deletedby are required' }, { status: 400 });
    }

    try {
        const deletePaymentMethod = `
            UPDATE paymentmethods
            SET activestatus = 0, deletedby = ?, deletedat = NOW()
            WHERE id = ?
        `;
        const [result] = await pool.execute(deletePaymentMethod, [deletedby, id]);

        return NextResponse.json({ message: 'Payment method deleted successfully', result }, { status: 200 });
    } catch (error) {
        console.error('Error deleting payment method:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}