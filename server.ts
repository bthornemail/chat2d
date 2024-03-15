
import { ethers, JsonRpcProvider } from 'ethers';
import express from 'express';
import multer from 'multer'; // for handling multipart/form-data, which is used for file upload.
import { readFileSync, writeFileSync } from 'fs';
import path, { join } from 'path';
import { marked } from 'marked';
// import VectorDatabase from './bin/vector.db.js';
// import chat from './modules/chatgpt/chat.js';
import __get_dirname from './bin/__dirname.js';
import { toString } from '../marketplace2d/components/service.board/public/modules/multiformats/src/bytes';
const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' }); // Configuring where to store uploaded files
// Initialize the provider and signer for ethers
let provider = new JsonRpcProvider(); // Replace with your own Ethereum node address
let signer = new ethers.Wallet('8749502e8a208d9442d2f044760a01d48b5de5a5edfd1e66eed3ef25ce78473a', provider); // Replace with your wallet's private key
// let signer = await provider.getSigner() // Replace with your wallet's private key
console.log(signer)
app.use(express.static(__get_dirname(import.meta.url, 'public')));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// const vectorDB = new VectorDatabase("chat");

const chatHistory: { role: "user" | "system" | "assistant", content: string }[] = []// = JSON.parse(readFileSync(__get_dirname(import.meta.url, join("messages","chat_history.json")), "utf-8"))
app.get("/chat", async (req, res) => {
    marked.setOptions({
        mangle: false,
        headerIds: false,
    });
    res.json({ chat_history: chatHistory })
})
app.post("/chat", async (req, res) => {
    marked.setOptions({
        mangle: false,
        headerIds: false,
    });
    chatHistory.push({
        "role": "user",
        "content": req.body.message
    });
    const output = await (async (message)=>message.toString())(req.body.message)
    // vectorDB.createDoc(output)
    console.log(output)
    chatHistory.push({
        "role": "assistant",
        "content": output
    });
    writeFileSync(__get_dirname(import.meta.url, "messages/chat_history.json"), JSON.stringify(chatHistory));
    const html = marked.parse(output);
    console.log(html)
    res.json({ response: {
      "role": "assistant",
      "content": output
  }, chatHistory,
      message:  {role: 'assistant', content: output} })
})

// app.post('/upload', <any>upload.single('image'), (req: any, res: any) => {
//   const tempPath = req.file.path;
//   const targetPath = path.join(__dirname, './uploads/image.png');

//   if (path.extname(req.file.originalname).toLowerCase() === '.png') {
//     writeFileSync(targetPath, readFileSync(tempPath, 'binary'));
//     res.status(200).json({ message: 'File uploaded successfully' });
//   } else {
//     res.status(403).json({ error: 'Only .png files are allowed' });
//   }
// });
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});