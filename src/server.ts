import express, {Request,Response} from 'express';
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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
