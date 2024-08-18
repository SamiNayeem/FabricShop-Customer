import { NextRequest, NextResponse } from "next/server";
const pool = require('@/config/db');

type UserRequest = {
    userid: number;
    products?: { productid: number, quantity: number }[];
    cartDetailId?: number;
    newQuantity?: number;
};

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userid = searchParams.get('userid');

        if (!userid) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const getCartInfo = `CALL GetUserCart(?)`;
        const [result] = await pool.execute(getCartInfo, [userid]);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching cart information:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { userid, products } = await req.json() as UserRequest;

    if (!userid || !products || !Array.isArray(products) || products.length === 0) {
        return NextResponse.json({ error: 'UserId and Products are required' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        let cartMasterId;
        const [cartMasterRows] = await connection.query(
            'SELECT id FROM cartmaster WHERE userid = ?',
            [userid]
        );

        if (cartMasterRows.length === 0) {
            const createCartMasterQuery = `
                INSERT INTO cartmaster (UserId, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy)
                VALUES (?, NOW(), ?, NOW(), ?)
            `;
            const createCartMasterValues = [userid, userid, userid];
            const [createCartMasterResult] = await connection.query(createCartMasterQuery, createCartMasterValues);
            cartMasterId = createCartMasterResult.insertId;
        } else {
            cartMasterId = cartMasterRows[0].id;
        }

        const insertPromises = products.map(async (product) => {
            const { productid, quantity } = product;
            const insertCartDetailQuery = `
                INSERT INTO cartdetails (CartMasterId, ProductMasterId, Quantity, TotalPrice, CreatedAt, CreatedBy)
                VALUES (?, ?, ?, 
                    (SELECT price * ? FROM productdetails WHERE ProductMasterId = ?), 
                    NOW(), ?)
            `;
            const insertCartDetailValues = [cartMasterId, productid, quantity, quantity, productid, userid];
            const [insertCartDetailResult] = await connection.query(insertCartDetailQuery, insertCartDetailValues);
            return insertCartDetailResult.insertId;
        });

        const cartDetailIds = await Promise.all(insertPromises);

        await connection.commit();
        return NextResponse.json({ message: 'Products added to cart successfully', cartDetailIds }, { status: 200 });
    } catch (error) {
        await connection.rollback();
        console.error('Error adding products to cart:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        connection.release();
    }
}

export async function PUT(req: NextRequest) {
    const { userid, cartDetailId, newQuantity } = await req.json() as UserRequest;

    if (!userid || !cartDetailId || !newQuantity) {
        return NextResponse.json({ error: 'UserId, CartDetailId, and NewQuantity are required' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [cartDetailRows] = await connection.query(
            'SELECT * FROM cartdetails WHERE id = ? AND CartMasterId IN (SELECT id FROM cartmaster WHERE userid = ?)',
            [cartDetailId, userid]
        );

        if (cartDetailRows.length === 0) {
            await connection.rollback();
            return NextResponse.json({ message: 'Cart detail not found for the user' }, { status: 404 });
        }

        const productid = cartDetailRows[0].ProductMasterId;

        const [priceRows] = await connection.query(
            'SELECT price FROM productdetails WHERE ProductMasterId = ?',
            [productid]
        );

        if (priceRows.length === 0) {
            await connection.rollback();
            return NextResponse.json({ message: 'Product price not found' }, { status: 404 });
        }

        const price = priceRows[0].price;
        const totalPrice = price * newQuantity;

        const updateCartDetailQuery = `
            UPDATE cartdetails
            SET Quantity = ?, TotalPrice = ?, UpdatedAt = NOW()
            WHERE id = ?
        `;
        const updateCartDetailValues = [newQuantity, totalPrice, cartDetailId];

        await connection.query(updateCartDetailQuery, updateCartDetailValues);

        await connection.commit();
        return NextResponse.json({ message: 'Cart product updated successfully' }, { status: 200 });
    } catch (error) {
        await connection.rollback();
        console.error('Error updating cart product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        connection.release();
    }
}

export async function DELETE(req: NextRequest) {
    const { userid, cartDetailId } = await req.json() as UserRequest;

    if (!userid || !cartDetailId) {
        return NextResponse.json({ error: 'UserId and CartDetailId are required' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [cartDetailRows] = await connection.query(
            'SELECT * FROM cartdetails WHERE id = ? AND CartMasterId IN (SELECT id FROM cartmaster WHERE userid = ?)',
            [cartDetailId, userid]
        );

        if (cartDetailRows.length === 0) {
            await connection.rollback();
            return NextResponse.json({ message: 'Cart detail not found for the user' }, { status: 404 });
        }

        await connection.query('DELETE FROM cartdetails WHERE id = ?', [cartDetailId]);

        await connection.commit();
        return NextResponse.json({ message: 'Cart product deleted successfully' }, { status: 200 });
    } catch (error) {
        await connection.rollback();
        console.error('Error deleting product from cart:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        connection.release();
    }
}
