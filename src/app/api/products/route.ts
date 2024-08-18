import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/config/db');


type ProductDescription = {
    name: string;
    code: string;
    description: string;
    createdby?: number;
    categoryid: number;
    colorid: number;
    sizeid: number;
    brandid: number;
    imageurl?: string[];
    quantity?: number;
    searchkey?: string;
    sorttype?: string;
    productmasterid?: number;
    productdetailsid?: number;
    updatedby?: number;
    deletedby?: number;
    costprice: number;
    price: number;
}


export async function POST(req: NextRequest) {
    const {
        name, code, description, createdby,
        categoryid, colorid, sizeid, brandid,
        imageurl, costprice, price, quantity
    } = await req.json();

    if (!name || !code || !description || createdby === undefined || !categoryid || !colorid || !sizeid || !brandid || costprice === undefined || price === undefined) {
        return NextResponse.json({ message: 'All required fields must be provided' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Insert into productmaster
        const [productMasterResult] = await connection.execute(
            `INSERT INTO productmaster (name, code, description, createdby, createdat) VALUES (?, ?, ?, ?, NOW())`,
            [name, code, description, createdby]
        );
        const productMasterId = productMasterResult.insertId;

        // Insert into productdetails
        const [productDetailsResult] = await connection.execute(
            `INSERT INTO productdetails (productmasterid, categoryid, colorid, sizeid, brandid, createdby, createdat, price, costprice) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
            [productMasterId, categoryid, colorid, sizeid, brandid, createdby, price, costprice]
        );
        const productDetailsId = productDetailsResult.insertId;

        // Insert images with their file paths
        if (imageurl && imageurl.length > 0) {
            const insertImages = `INSERT INTO images (url, productmasterid, productdetailsid, createdby, createdat) VALUES (?, ?, ?, ?, NOW())`;
            for (const url of imageurl) {
                await connection.execute(insertImages, [url, productMasterId, productDetailsId, createdby]);
            }
        }

        // Insert quantity (if provided)
        if (quantity !== undefined) {
            await connection.execute(
                `INSERT INTO productinventory (productdetailsid, quantity, createdby, createdat) VALUES (?, ?, ?, NOW())`,
                [productDetailsId, quantity, createdby]
            );
        }

        await connection.commit();
        return NextResponse.json({ message: 'Product created successfully' }, { status: 200 });
    } catch (error) {
        await connection.rollback();
        console.error('Error adding product:', error);
        return NextResponse.json({ message: 'Error adding product' }, { status: 500 });
    } finally {
        connection.release();
    }
}


// Handle GET requests
export async function GET(req: NextRequest) {
    const search = req.nextUrl.searchParams.get('search') || "";

    try {
        let query = `
            SELECT pm.id AS ProductMasterId, pm.name, pm.description, pd.price, s.name as sizename, 
                   b.name AS brandname, i.url AS imageurl, pi.quantity
            FROM productmaster pm
            JOIN productdetails pd ON pm.id = pd.productmasterid
            JOIN brands b ON pd.brandid = b.id
            JOIN sizes s ON pd.sizeid = s.id
            LEFT JOIN images i ON pm.id = i.productmasterid
            LEFT JOIN productinventory pi ON pd.id = pi.productdetailsid
            WHERE pm.activestatus = 1
        `;

        const queryParams: any[] = [];

        if (search) {
            query += ` AND (LOWER(pm.name) LIKE ? OR LOWER(pm.code) LIKE ? OR LOWER(b.name) LIKE ?)`;
            const searchQuery = `%${search.toLowerCase()}%`;
            queryParams.push(searchQuery, searchQuery, searchQuery);
        }

        const [rows] = await pool.query(query, queryParams);

        const productsMap = new Map();

        rows.forEach((row: any) => {
            const productMasterId = row.ProductMasterId;

            if (!productsMap.has(productMasterId)) {
                productsMap.set(productMasterId, {
                    ProductMasterId: productMasterId,
                    Name: row.name,
                    Description: row.description,
                    sizename: row.sizename,
                    Price: row.price,
                    BrandName: row.brandname,
                    Quantity: row.quantity,
                    ImageUrl: row.imageurl ? [row.imageurl] : [],
                });
            } else {
                const product = productsMap.get(productMasterId);
                if (row.imageurl) {
                    product.ImageUrl.push(row.imageurl);
                }
            }
        });

        const processedProductData = Array.from(productsMap.values());
        return NextResponse.json({ products: processedProductData }, { status: 200 });
    } catch (error) {
        console.error('Error fetching product data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


/// Handle PUT requests
export async function PUT(req: NextRequest) {
    const {
        productmasterid, productdetailsid,
        name, code, description, updatedby,
        categoryid, colorid, sizeid, brandid,
        quantity, price
    } = await req.json() as ProductDescription;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const checkActiveStatus = `
            SELECT 
                (SELECT COUNT(*) FROM categories WHERE id = ? AND activestatus = 1) AS categoryActive,
                (SELECT COUNT(*) FROM colors WHERE id = ? AND activestatus = 1) AS colorActive,
                (SELECT COUNT(*) FROM sizes WHERE id = ? AND activestatus = 1) AS sizeActive,
                (SELECT COUNT(*) FROM brands WHERE id = ? AND activestatus = 1) AS brandActive
        `;
        const [activeStatusResult] = await connection.execute(checkActiveStatus, [categoryid, colorid, sizeid, brandid]);
        const { categoryActive, colorActive, sizeActive, brandActive } = activeStatusResult[0];

        if (!categoryActive || !colorActive || !sizeActive || !brandActive) {
            await connection.rollback();
            return NextResponse.json(
                { message: 'One or more related entities are not active' },
                { status: 400 }
            );
        }

        const updateProductMaster = `
            UPDATE productmaster
            SET name = ?, code = ?, description = ?, updatedby = ?, updatedat = NOW()
            WHERE id = ?
        `;
        await connection.execute(updateProductMaster, [name, code, description, updatedby, productmasterid]);

        const updateProductDetails = `
            UPDATE productdetails
            SET categoryid = ?, colorid = ?, sizeid = ?, brandid = ?, updatedby = ?, updatedat = NOW(), price = ?
            WHERE id = ?
        `;
        await connection.execute(updateProductDetails, [categoryid, colorid, sizeid, brandid, updatedby, price, productdetailsid]);

        if (quantity !== undefined) {
            const updateQuantity = `
                UPDATE productinventory
                SET quantity = ?, updatedby = ?, updatedat = NOW()
                WHERE productdetailsid = ?
            `;
            await connection.execute(updateQuantity, [quantity, updatedby, productdetailsid]);
        }

        await connection.commit();
        return NextResponse.json(
            { message: 'Product updated successfully' },
            { status: 200 }
        );
    } catch (error) {
        await connection.rollback();
        console.error('Error updating product:', error);
        return NextResponse.json(
            { message: 'Error updating product' },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}

// Handle DELETE requests
export async function DELETE(req: NextRequest) {
    try {
        const { productmasterid, deletedby } = await req.json() as ProductDescription;

        if (!productmasterid || !deletedby) {
            console.log("Product ID or deleted by user ID is missing");
            return NextResponse.json({ message: 'Product ID and deleted by user ID are required' }, { status: 400 });
        }

        const deleteProduct = `
            UPDATE productmaster
            SET activestatus = 0, deletedby = ?, deletedat = NOW()
            WHERE id = ?
        `;

        await pool.execute(deleteProduct, [deletedby, productmasterid]);

        console.log(`Product with ID ${productmasterid} deleted by user ${deletedby}`);
        return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ message: 'Error deleting product' }, { status: 500 });
    }
}