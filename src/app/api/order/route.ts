import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/config/db');

type CheckoutRequest = {
    userId: number;
    paymentMethodId: number;
    shippingMethodId: number;
    address: string;
};

export async function POST(req: NextRequest) {
    const connection = await pool.getConnection();

    try {
        const { userId, paymentMethodId, shippingMethodId, address } = await req.json() as CheckoutRequest;

        // Validate the required fields
        if (!userId || !paymentMethodId || !shippingMethodId || !address) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        console.log('UserId:', userId, 'PaymentMethodId:', paymentMethodId, 'ShippingMethodId:', shippingMethodId, 'Address:', address);

        // Start transaction
        await connection.beginTransaction();

        // Fetch cart master record
        const [cartMaster] = await connection.query(
            'SELECT id FROM cartmaster WHERE userid = ?',
            [userId]
        );

        if (cartMaster.length === 0) {
            await connection.rollback();
            return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
        }

        const cartId = cartMaster[0].id;

        // Fetch cart details
        const [cartDetails] = await connection.query(
            'SELECT * FROM cartdetails WHERE CartMasterId = ?',
            [cartId]
        );

        if (cartDetails.length === 0) {
            await connection.rollback();
            return NextResponse.json({ message: 'Cart is empty' }, { status: 404 });
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
        for (const product of cartDetails) {
            const { ProductMasterId, ProductDetailsId, Quantity, TotalPrice } = product;
            const insertOrderDetailsQuery = `
                INSERT INTO orderdetails (OrderMasterId, ProductMasterId, ProductDetailsId, Quantity, TotalPrice)
                VALUES (?, ?, ?, ?, ?)
            `;
            await connection.query(insertOrderDetailsQuery, [orderMasterId, ProductMasterId, ProductDetailsId, Quantity, TotalPrice]);
        }

        // Determine payment status ID based on payment method ID
        const paymentStatusId = paymentMethodId === 1 ? 2 : 1; // Assuming ID 1 is for "Cash on Delivery"

        // Insert payment information
        const insertPaymentInfoQuery = `
            INSERT INTO paymentinformations (UserId, PaymentMethodId, OrderMasterId, PaymentStatusId, PaymentDate)
            VALUES (?, ?, ?, ?, NOW())
        `;
        await connection.query(insertPaymentInfoQuery, [userId, paymentMethodId, orderMasterId, paymentStatusId]);

        // Insert shipping information
        const insertShippingInfoQuery = `
            INSERT INTO shippinginformations (OrderMasterId, ShippingMethodId, shippingaddress)
            VALUES (?, ?, ?)
        `;
        await connection.query(insertShippingInfoQuery, [orderMasterId, shippingMethodId, address]);

        // Clear the cart
        await connection.query('DELETE FROM cartdetails WHERE CartMasterId = ?', [cartId]);
        await connection.query('DELETE FROM cartmaster WHERE id = ?', [cartId]);

        // Commit transaction
        await connection.commit();

        // Redirect to dashboard after successful checkout
        return NextResponse.json({ message: 'Checkout successful', redirect: '/dashboard' }, { status: 200 });

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