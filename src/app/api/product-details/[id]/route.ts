import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/config/db');

export async function PUT(req: NextRequest, { params }: { params: { id: number } }) {
    const productId = params.id;

    // Parse the incoming request body
    const {
        name, code, description, updatedby,
        categoryid, colorid, sizeid, brandid,
        imageurl, costprice, price, quantity
    } = await req.json();

    // Log received data for debugging
    console.log('Received Data:', {
        productId, name, code, description, updatedby,
        categoryid, colorid, sizeid, brandid,
        imageurl, costprice, price, quantity
    });

    // Validate required fields
    if (!productId || !name || !code || !description || updatedby === undefined || 
        !categoryid || !colorid || !sizeid || !brandid || costprice === undefined || 
        price === undefined) {
        return NextResponse.json({ message: 'All required fields must be provided' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Deactivate the current product in productmaster
        const deactivateProduct = await connection.execute(
            `UPDATE productmaster SET activestatus = 0 WHERE id = ?`,
            [productId]
        );

        // Insert into productmaster with updated data
        const [productMasterResult] = await connection.execute(
            `INSERT INTO productmaster (name, code, description, createdby, createdat) VALUES (?, ?, ?, ?, NOW())`,
            [name, code, description, updatedby]
        );

        // Ensure productMasterResult has insertId
        if (!productMasterResult || !productMasterResult.insertId) {
            throw new Error('Failed to insert into productmaster');
        }

        const newProductMasterId = productMasterResult.insertId;

        // Insert into productdetails with updated data
        const [productDetailsResult] = await connection.execute(
            `INSERT INTO productdetails (productmasterid, categoryid, colorid, sizeid, brandid, createdby, createdat, price, costprice) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
            [newProductMasterId, categoryid, colorid, sizeid, brandid, updatedby, price, costprice]
        );

        // Ensure productDetailsResult has insertId
        if (!productDetailsResult || !productDetailsResult.insertId) {
            throw new Error('Failed to insert into productdetails');
        }

        const newProductDetailsId = productDetailsResult.insertId;

        // Insert images with updated data
        if (imageurl && imageurl.length > 0) {
            const insertImages = `INSERT INTO images (url, productmasterid, productdetailsid, createdby, createdat) VALUES (?, ?, ?, ?, NOW())`;
            for (const url of imageurl) {
                await connection.execute(insertImages, [url, newProductMasterId, newProductDetailsId, updatedby]);
            }
        }

        // Insert quantity into productinventory
        if (quantity !== undefined) {
            await connection.execute(
                `INSERT INTO productinventory (productdetailsid, quantity, createdby, createdat) VALUES (?, ?, ?, NOW())`,
                [newProductDetailsId, quantity, updatedby]
            );
        }

        await connection.commit();
        return NextResponse.json({ message: 'Product updated successfully' }, { status: 200 });
    } catch (error) {
        await connection.rollback();
        console.error('Error updating product:',);
        return NextResponse.json({ message: 'Error updating product'}, { status: 500 });
    } finally {
        connection.release();
    }
}
