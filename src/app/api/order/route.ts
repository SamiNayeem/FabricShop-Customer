import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/config/db');

type CheckoutRequest = {
    cartId: number;
    userId: number;
    paymentMethodId: number;
    transactionId?: string;
    shippingMethodId: number;
};

export async function POST(req: NextRequest) {
    const { cartId, userId, paymentMethodId, transactionId, shippingMethodId } = await req.json() as CheckoutRequest;

    if (!cartId || !userId || !paymentMethodId || !shippingMethodId) {
        return NextResponse.json({ message: 'Cart ID, User ID, Payment Method ID, and Shipping Method ID are required' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Fetch cart details
        const [cartDetails] = await connection.query(
            'SELECT * FROM cartdetails WHERE CartMasterId = ?',
            [cartId]
        );

        if (cartDetails.length === 0) {
            await connection.rollback();
            return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
        }

        // Calculate total amount from cart details
        const totalAmount = cartDetails.reduce((sum: number, product: any) => sum + product.TotalPrice, 0);

        // Generate a random order number
        const orderNumber = Math.floor(Math.random() * (99999999 - 100000 + 1)) + 100000;

        // Insert order master record
        const insertOrderMasterQuery = `
            INSERT INTO ordermaster (UserId, TotalAmount, OrderDate, OrderNumber, OrderStatusId)
            VALUES (?, ?, NOW(), ?, 2)
        `;
        const [orderMasterResult] = await connection.query(insertOrderMasterQuery, [userId, totalAmount, orderNumber]);
        const orderMasterId = orderMasterResult.insertId;

        // Insert order details records
        const insertOrderDetailsPromises = cartDetails.map((product: any) => {
            const { ProductMasterId, ProductDetailsId, Quantity, TotalPrice } = product;
            const insertOrderDetailsQuery = `
                INSERT INTO orderdetails (OrderMasterId, ProductMasterId, ProductDetailsId, Quantity, TotalPrice)
                VALUES (?, ?, ?, ?, ?)
            `;
            return connection.query(insertOrderDetailsQuery, [orderMasterId, ProductMasterId, ProductDetailsId, Quantity, TotalPrice]);
        });

        await Promise.all(insertOrderDetailsPromises);

        // Determine payment status ID based on payment method ID
        const paymentStatusId = paymentMethodId === 1 ? 2 : 1;

        // Insert payment information
        const insertPaymentInfoQuery = `
            INSERT INTO paymentinformations (UserId, PaymentMethodId, OrderMasterId, TransactionId, PaymentStatusId, PaymentDate)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        const insertPaymentInfoValues = [userId, paymentMethodId, orderMasterId, transactionId || null, paymentStatusId];
        await connection.query(insertPaymentInfoQuery, insertPaymentInfoValues);

        // Insert shipping information
        const insertShippingInfoQuery = `
            INSERT INTO shippinginformations (OrderMasterId, ShippingMethodId)
            VALUES (?, ?)
        `;
        await connection.query(insertShippingInfoQuery, [orderMasterId, shippingMethodId]);

        // Delete the cart and its details
        await connection.query('DELETE FROM cartdetails WHERE CartMasterId = ?', [cartId]);
        await connection.query('DELETE FROM cartmaster WHERE id = ?', [cartId]);

        await connection.commit();
        return NextResponse.json({ message: 'Checkout successful' }, { status: 200 });
    } catch (error) {
        await connection.rollback();
        console.error('Error during checkout:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        connection.release();
    }
}

export async function GET(req: NextRequest) {
    try {
        const getOrderInfo = 'CALL GetAllOrderInformation()';
        const [result] = await pool.execute(getOrderInfo);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching order information:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
