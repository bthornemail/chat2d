import express from 'express';
import path from 'path';
import chat from './chat';
import { marked } from 'marked';
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.post("/chat", async (req, res) => {
    marked.setOptions({
        mangle: false,
        headerIds: false,
    });
    const html = marked.parse(await chat(req.body.message));
    res.json({ response:  html})
})
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});