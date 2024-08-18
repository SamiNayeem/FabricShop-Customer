import type { NextApiRequest, NextApiResponse } from 'next';
const pool = require('@/config/db')
const databaseConnection = require('@/config/dbconnect')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // view all the Brand information
    if (req.method === 'GET') {
        try {
            // Process a GET request to fetch payment information by userid
            const { userid } = req.body;
            const GetPaymentStatusInfo = "SELECT paymentdate, paymentmethodid, transactionid, ordermasterid, paymentstatusid FROM paymentinformations WHERE userid = ?";
            
            const [result] = await pool.execute(GetPaymentStatusInfo, [userid]); 
            console.log(result); 
            
            res.status(200).json(result); 
        } catch (error) {
            console.error("Error retrieving payment information:", error); // Log the actual error message
            res.status(500).json({ error: 'Internal Server Error' });
        }

        // update Brand information
    } else if (req.method === 'PUT'){
        try {
            const updateQuery = `
                UPDATE paymentinformations
                SET paymentstatusid = ?, updatedby = ?, updatedat = NOW()
                WHERE id = ${req.body.id}
            `;
            const { paymentstatusid, updatedby} = req.body;
            const result = await pool.execute(updateQuery, [ paymentstatusid, updatedby]);

            res.status(200).json(result);

        }catch{
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}