import { error } from 'console';
import type { NextApiRequest, NextApiResponse } from 'next';
const pool = require('@/config/db')
const databaseConnection = require('@/config/dbconnect')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // view all the discountcoupon information
    if (req.method === 'GET') {
        try {
            // Process a GET request
            const GetDiscountCouponInfo = "SELECT couponcode, discountpercentage, createdat, createdby, updatedat, updatedby FROM discountcoupon WHERE activestatus = 1";
            const [result] = await pool.execute(GetDiscountCouponInfo);
            console.log([result])
            // debugger;
            res.status(200).json([result]);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
        // Add nother discountcoupon
    } else if (req.method === 'POST') {
        const InsertDiscountCouponInfo = `
            INSERT INTO discountcoupon (couponcode, discountpercentage CreatedBy, CreatedAt)
            VALUES (?, ?,, ? NOW())
        `;
        
        const CheckDuplicateName = `
            SELECT COUNT(*) AS count FROM discountcoupon WHERE LOWER(couponcode) = LOWER(?) AND activestatus = 1
        `;

        const { code, discountpercentage, createdby } = req.body;

        try {
            // Check for duplicate name in a case-insensitive manner
            const [rows] = await pool.execute(CheckDuplicateName, [code]);
            const count = rows[0].count;
            
            if (count > 0) {
                return res.status(400).json({ error: 'Coupon code already exists' });
            }
            const result = await pool.execute(InsertDiscountCouponInfo, [code, discountpercentage, createdby]);
            res.status(200).json({ message: 'coupon added successfully', result });
            console.log("Inserted Successfully");
        } catch (error) {
            console.error('Error inserting discountcoupon:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

        // update discountcoupon information
    } else if (req.method === 'PUT'){
        try {
            const updateQuery = `
                UPDATE discountcoupon
                SET couponcode = ?, discountpercentage= ?, updatedby = ?, updatedat = NOW()
                WHERE id = ${req.body.id}
            `;

            const CheckDuplicateName = `
            SELECT COUNT(*) AS count FROM discountcoupon WHERE LOWER(couponcode) = LOWER(?) AND activestatus = 1
        `;


            const { discountcoupon, discountpercentage, updatedby} = req.body;

            // Check for duplicate name in a case-insensitive manner
            const [rows] = await pool.execute(CheckDuplicateName, [discountcoupon]);
            const count = rows[0].count;
            
            if (count > 0) {
                return res.status(400).json({ error: 'Coupon code already exists' });
            }

            const result = await pool.execute(updateQuery, [ discountcoupon, discountpercentage,updatedby]);

            res.status(200).json(result);

        }catch{
            res.status(500).json({ error: 'Internal Server Error'});
            console.error(error)
        }
    }else if(req.method === 'DELETE'){

        try{
            const deleteCoupon = `
            UPDATE discountcoupon
            SET activestatus = 0, deletedby = ?, deletedat = NOW()
            WHERE id = ${req.body.id}
        `
        const { deletedby } = req.body;
        const [result] = await pool.execute(deleteCoupon, [deletedby]);

        res.status(200).json([result]);
        }catch{
            res.status(500).json({ error: 'Internal Server Error' });
        }
        
    }
}