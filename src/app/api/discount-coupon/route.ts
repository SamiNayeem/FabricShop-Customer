import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/config/db');

export async function POST(req: NextRequest) {
    try {
        const { userid, couponcode } = await req.json();

        if (!userid || !couponcode) {
            return NextResponse.json({ error: 'User ID and Coupon Code are required' }, { status: 400 });
        }

        // Query to check if the coupon is valid
        const checkCouponQuery = `
            SELECT discountpercentage 
            FROM discountcoupon 
            WHERE LOWER(couponcode) = LOWER(?) AND activestatus = 1
        `;

        const [couponRows] = await pool.execute(checkCouponQuery, [couponcode]);
        console.log(couponcode)

        if (couponRows.length === 0) {
            return NextResponse.json({ error: 'Invalid or inactive coupon code' }, { status: 400 });
        }

        const discountpercentage = couponRows[0].discountpercentage;

        // Calculate the discount and return the response
        return NextResponse.json({ message: 'Coupon applied successfully', discountpercentage }, { status: 200 });
    } catch (error) {
        console.error('Error applying coupon:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
