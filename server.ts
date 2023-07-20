
import { ethers, JsonRpcProvider } from 'ethers';
import express from 'express';
import multer from 'multer'; // for handling multipart/form-data, which is used for file upload.
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { marked } from 'marked';
import VectorDatabase from './utils/vector.db';
import chat from './chat';
const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' }); // Configuring where to store uploaded files
// Initialize the provider and signer for ethers
let provider = new JsonRpcProvider(); // Replace with your own Ethereum node address
let signer = new ethers.Wallet('8749502e8a208d9442d2f044760a01d48b5de5a5edfd1e66eed3ef25ce78473a', provider); // Replace with your wallet's private key
// let signer = await provider.getSigner() // Replace with your wallet's private key
console.log(signer)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const vectorDB = new VectorDatabase("chat");

const chatHistory: { role: "user" | "system" | "assistant", content: string }[] = JSON.parse(readFileSync(path.join(__dirname, "messages", "chat_history.json"), "utf-8"))
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
    const output = await chat(req.body.message)
    vectorDB.createDoc(output)
    chatHistory.push({
        "role": "assistant",
        "content": output
    });
    writeFileSync(path.join(__dirname, "messages", "chat_history.json"), JSON.stringify(chatHistory));
    const html = marked.parse(output);
    res.json({ response: html })
})
// Initialize the assetNFT Contract
let assetNFTContract = new ethers.Contract('0xf88c693c388504dA565adc23A3871d82E02c3ca3', [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_vtcAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "assetToOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "assets",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "securityDeposit",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "repairCost",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalLossCost",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "metadataHash",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isRented",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "ownerAssetCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "vtc",
    "outputs": [
      {
        "internalType": "contract VertCoin",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_securityDeposit",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_repairCost",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_totalLossCost",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_metadataHash",
        "type": "string"
      }
    ],
    "name": "createAsset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_assetId",
        "type": "uint256"
      }
    ],
    "name": "rentAsset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_assetId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_repairCost",
        "type": "uint256"
      }
    ],
    "name": "returnAsset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_assetId",
        "type": "uint256"
      }
    ],
    "name": "purchaseAsset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_assetId",
        "type": "uint256"
      }
    ],
    "name": "getAssetMetadata",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
], signer);
app.post('/assetNFT/mint', async (req, res) => {
  const { assetId, to } = req.body;
  try {
    const tx = await assetNFTContract.registerAsset(assetId, to);
    const receipt = await tx.wait();
    res.json({ receipt });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/assetNFT/register', async (req, res) => {
  const { assetId, name, summary, description, value, datasheet } = req.body;
  try {
    const tx = await assetNFTContract.registerAsset(assetId, name, summary, description, value, datasheet);
    const receipt = await tx.wait();
    res.json({ receipt });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/assetNFT/:tokenId', async (req, res) => {
  const tokenId = req.params.tokenId;
  try {
    const asset = await assetNFTContract.tokenURI(tokenId);
    res.json({ asset });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/assetNFT/transfer', async (req, res) => {
  const { tokenId, to } = req.body;
  try {
    const tx = await assetNFTContract.safeTransferFrom(await signer.getAddress(), to, tokenId);
    const receipt = await tx.wait();
    res.json({ receipt });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/upload', upload.single('image'), (req: any, res: any) => {
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, './uploads/image.png');

  if (path.extname(req.file.originalname).toLowerCase() === '.png') {
    writeFileSync(targetPath, readFileSync(tempPath, 'binary'));
    res.status(200).json({ message: 'File uploaded successfully' });
  } else {
    res.status(403).json({ error: 'Only .png files are allowed' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});