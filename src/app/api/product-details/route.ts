import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/config/db');

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    console.log(id)

    if (!id) {

        return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
        
    }

    try {
        const [rows] = await pool.query(`
            SELECT 
                pm.id AS ProductMasterId, 
                pd.id AS ProductDetailsId,
                pm.name, 
                pm.code,
                pm.description, 
                pd.costprice,
                pd.price, 
                c.name AS colorName, 
                c.hexcode AS hexcode,
                b.name AS brandName, 
                i.url AS imageUrl, 
                s.name AS sizeName,
                pi.quantity 
            FROM productmaster pm
            JOIN productdetails pd ON pm.id = pd.productmasterid
            JOIN brands b ON pd.brandid = b.id
            JOIN colors c ON pd.colorid = c.id
            JOIN sizes s ON pd.sizeid = s.id
            LEFT JOIN images i ON pm.id = i.productmasterid
            LEFT JOIN productinventory pi ON pd.id = pi.productdetailsid
            WHERE pm.activestatus = 1 AND pm.id = ?
        `, [id]);

        if (rows.length === 0) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        const product = {
            ProductMasterId: rows[0].ProductMasterId,
            ProductDetailsId: rows[0].ProductDetailsId,
            name: rows[0].name,
            code: rows[0].code,
            description: rows[0].description,
            costprice: rows[0].costprice,
            price: rows[0].price,
            brandName: rows[0].brandName,
            quantity: rows[0].quantity,
            colorName: rows[0].colorName,
            imageUrls: rows.map((row: any) => row.imageUrl).filter((url: string | null) => url !== null),
            sizeName: rows[0].sizeName,
            hexcode: rows[0].hexcode
        };

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error('Error fetching product data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


