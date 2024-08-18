import { error } from 'console';
import type { NextApiRequest, NextApiResponse } from 'next';
const pool = require('@/config/db')
const databaseConnection = require('@/config/dbconnect')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // view all the FAQ information
    if (req.method === 'GET') {
        try {
            // Process a GET request
            const GetFAQInfo = "SELECT questions, answers, createdat, createdby, updatedat, updatedby FROM faq WHERE activestatus = 1";
            const [result] = await pool.execute(GetFAQInfo);
            console.log([result])
            // debugger;
            res.status(200).json([result]);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
        // Add another FAQ
    } else if (req.method === 'POST') {
        const InsertFAQInfo = `
            INSERT INTO faq (questions, answers, createdby, createdat)
            VALUES (?, ?, ?, NOW())
        `;

        const CheckDuplicateName = `
            SELECT COUNT(*) AS count FROM faq WHERE LOWER(questions) = LOWER(?) AND activestatus = 1
        `;
        
        const { question, answer, createdby } = req.body;

        try {
            // Check for duplicate name in a case-insensitive manner
            const [rows] = await pool.execute(CheckDuplicateName, [question]);
            const count = rows[0].count;
            
            if (count > 0) {
                return res.status(400).json({ error: 'question already exists' });
            }
            const result = await pool.execute(InsertFAQInfo, [question, answer, createdby]);
            res.status(200).json({ message: 'FAQ added successfully', result });
            console.log("Inserted Successfully");
        } catch (error) {
            console.error('Error inserting FAQ:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

        // update FAQ information
    } else if (req.method === 'PUT'){
        try {
            const updateQuery = `
                UPDATE faq
                SET questions = ?, answers = ?, updatedby = ?, updatedat = NOW()
                WHERE id = ${req.body.id}
            `;

            const CheckDuplicateName = `
            SELECT COUNT(*) AS count FROM faq WHERE LOWER(questions) = LOWER(?) AND activestatus = 1
        `;


            const { question, answer, updatedby} = req.body;

            // Check for duplicate name in a case-insensitive manner
            const [rows] = await pool.execute(CheckDuplicateName, [question]);
            const count = rows[0].count;
            
            if (count > 0) {
                return res.status(400).json({ error: 'question already exists' });
            }

            const result = await pool.execute(updateQuery, [ question, answer, updatedby]);

            res.status(200).json(result);

        }catch{
            res.status(500).json({ error: 'Internal Server Error' });
            console.error(error)
        }
    }else if(req.method === 'DELETE'){

        try{
            const deleteFAQ = `
            UPDATE faq
            SET activestatus = 0
            WHERE id = ${req.body.id}
        `
        const { deletedby } = req.body;
        const [result] = await pool.execute(deleteFAQ, [deletedby]);

        res.status(200).json([result]);
        }catch{
            res.status(500).json({ error: 'Internal Server Error' });
            console.error(error)
        }
        
    }
}