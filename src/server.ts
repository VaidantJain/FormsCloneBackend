import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

app.use(bodyParser.json());
const dbPath = path.resolve(__dirname, 'db.json');

interface Submission {
    name: string;
    email: string;
    phoneNumber: string;
    gitHubRepo: string;
    elapsedTime: string;
}

const readFromDb = (): Submission[] => {
    if (fs.existsSync(dbPath)) {
        const data = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(data);
    }
    return [];
};

const writeToDb = (data: Submission[]) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

let submissions: Submission[] = readFromDb();

app.get('/ping', (req: Request, res: Response) => {
    res.json({ status: 'True' });
});

app.post('/submit', (req, res) => {
    const formData: Submission = req.body;
    submissions.push(formData);
    writeToDb(submissions);
    console.log('Form Data Received:', formData);
    res.send('Form received successfully!');
});

app.get('/read', (req, res) => {
    const data = readFromDb();
    res.json(data);
});

app.put('/update', (req: Request, res: Response) => {
    const { index, submission } = req.body;

    if (typeof index !== 'number' || index < 0 || index >= submissions.length) {
        res.status(400).send('Invalid index');
        return;
    }

    const existingSubmission = submissions[index];
    const updatedSubmission = { ...existingSubmission, ...submission };

    submissions[index] = updatedSubmission;
    writeToDb(submissions);
    console.log("Updated Record: ", updatedSubmission)
    res.json({ status: 'Update successful', updatedSubmission });
});

app.delete('/delete', (req, res) => {
    const index: number = req.body.index;
    if (index >= 0 && index < submissions.length) {
        const deletedSubmission = submissions.splice(index, 1)[0];
        writeToDb(submissions);
        console.log('Deleted Submission:', deletedSubmission);
    } else {
        res.status(400).send('Invalid index');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
