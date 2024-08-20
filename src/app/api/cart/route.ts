import { NextRequest, NextResponse } from "next/server";
const pool = require('@/config/db');

type UserRequest = {
    userid: number;
    products?: { productid: number, quantity: number }[];
    cartDetailId?: number;
    newQuantity?: number;
};

// Fetch user cart details
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userid = searchParams.get('userid');

        if (!userid) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const getCartInfo = `CALL GetUserCart(?)`;
        const [resultSets] = await pool.query(getCartInfo, [userid]);
        const result = resultSets[0]; // Assuming the first result set is what you need

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching cart information:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
// Add product to cart
export async function POST(req: NextRequest) {
    try {
        const { userid, products } = await req.json() as UserRequest;

        if (!userid || !products || !Array.isArray(products) || products.length === 0) {
            return NextResponse.json({ error: 'UserId and Products are required' }, { status: 400 });
        }

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            let cartMasterId: number;
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

            const insertOrUpdatePromises = products.map(async (product) => {
                const { productid, quantity } = product;

                // Check if the product is already in the cart
                const [existingCartDetails] = await connection.query(
                    'SELECT id, Quantity FROM cartdetails WHERE CartMasterId = ? AND ProductMasterId = ?',
                    [cartMasterId, productid]
                );

                if (existingCartDetails.length > 0) {
                    // If the product is already in the cart, update the quantity
                    const existingQuantity = existingCartDetails[0].Quantity;
                    const newQuantity = existingQuantity + quantity;

                    const updateCartDetailQuery = `
                        UPDATE cartdetails
                        SET Quantity = ?, TotalPrice = (SELECT price * ? FROM productdetails WHERE ProductMasterId = ?), UpdatedAt = NOW()
                        WHERE id = ?
                    `;
                    const updateCartDetailValues = [newQuantity, newQuantity, productid, existingCartDetails[0].id];
                    await connection.query(updateCartDetailQuery, updateCartDetailValues);
                } else {
                    // If the product is not in the cart, insert it as a new item
                    const insertCartDetailQuery = `
                        INSERT INTO cartdetails (CartMasterId, ProductMasterId, Quantity, TotalPrice, CreatedAt, CreatedBy)
                        VALUES (?, ?, ?, 
                            (SELECT price * ? FROM productdetails WHERE ProductMasterId = ?), 
                            NOW(), ?)
                    `;
                    const insertCartDetailValues = [cartMasterId, productid, quantity, quantity, productid, userid];
                    await connection.query(insertCartDetailQuery, insertCartDetailValues);
                }
            });

            await Promise.all(insertOrUpdatePromises);

            await connection.commit();
            return NextResponse.json({ message: 'Products added to cart successfully' }, { status: 200 });
        } catch (error) {
            await connection.rollback();
            console.error('Error adding products to cart:', error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}



// Update product quantity in the cart
export async function PUT(req: NextRequest) {
    try {
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
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Delete a product from the cart
export async function DELETE(req: NextRequest) {
    try {
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
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
