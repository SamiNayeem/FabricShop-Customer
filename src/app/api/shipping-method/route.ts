import { error } from 'console';
import type { NextApiRequest, NextApiResponse } from 'next';
const pool = require('@/config/db')
const databaseConnection = require('@/config/dbconnect')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // view all the shippingmethods information
    if (req.method === 'GET') {
        try {
            // Process a GET request
            const GetShippingMethodsInfo = "SELECT shippingmethod, createdat, createdby, updatedat, updatedby FROM shippingmethods WHERE activestatus = 1";
            const [result] = await pool.execute(GetShippingMethodsInfo);
            console.log([result])
            // debugger;
            res.status(200).json([result]);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
        // Add another shippingmethods
    } else if (req.method === 'POST') {
        const InsertShippingMethodsInfo = `
            INSERT INTO shippingmethods (shippingmethod, createdby, createdat)
            VALUES (?, ?, NOW())
        `;

        const CheckDuplicateName = `
            SELECT COUNT(*) AS count FROM categories WHERE LOWER(shippingmethod) = LOWER(?) AND activestatus = 1
        `;
        
        const { shippingmethod, createdby } = req.body;

        try {

            // Check for duplicate name in a case-insensitive manner
            const [rows] = await pool.execute(CheckDuplicateName, [shippingmethod]);
            const count = rows[0].count;
            
            if (count > 0) {
                return res.status(400).json({ error: 'Shipping method already exists' });
            }
            const result = await pool.execute(InsertShippingMethodsInfo, [shippingmethod, createdby]);
            res.status(200).json({ message: 'shippingmethods added successfully', result });
            console.log("Inserted Successfully");
        } catch (error) {
            console.error('Error inserting shippingmethods:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

        // update shippingmethods information
    } else if (req.method === 'PUT'){
        try {
            const updateQuery = `
                UPDATE shippingmethods
                SET shippingmethod = ?, updatedby = ?, updatedat = NOW()
                WHERE id = ${req.body.id}
            `;
            const CheckDuplicateName = `
            SELECT COUNT(*) AS count FROM categories WHERE LOWER(shippingmethod) = LOWER(?) AND activestatus = 1
        `;
            const { shippingmethod, updatedby} = req.body;

            // Check for duplicate name in a case-insensitive manner
            const [rows] = await pool.execute(CheckDuplicateName, [shippingmethod]);
            const count = rows[0].count;
            
            if (count > 0) {
                return res.status(400).json({ error: 'Shipping method already exists' });
            }
            const result = await pool.execute(updateQuery, [ shippingmethod, updatedby]);

            res.status(200).json(result);

        }catch{
            res.status(500).json({ error: 'Internal Server Error' });
            console.error(error)
        }
    }else if(req.method === 'DELETE'){

        try{
            const deleteshippingmethods = `
            UPDATE shippingmethods
            SET activestatus = 0
            WHERE id = ${req.body.id}
        `
        const { deletedby } = req.body;
        const [result] = await pool.execute(deleteshippingmethods, [deletedby]);

        res.status(200).json([result]);
        }catch{
            res.status(500).json({ error: 'Internal Server Error' });
            console.error(error)
        }
        
    }
}