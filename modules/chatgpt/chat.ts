import { appendFileSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import openai from "./utils/openai.js";
import { ChatCompletionRequestMessage } from "openai";
import VectorDatabase from "./utils/vector.db.js";
import embedFilesInSubdirectorySync from './bin/embed.all.files.in.dir.js';
import readAllFiles from './bin/readFilesInSubdirectorySync.js'

const devMode = false;
// const devMode = true;

const vectorDb = new VectorDatabase("chat");
function saveToDisk(input: string, output: string) {
    const id = Date.now();
    console.log("New Chat Completion: " + id);
    console.log(output);
    appendFileSync(join(import.meta.url, "messages", "index.md"), `\n{"${id}":"${input}"}`);
    writeFileSync(join(import.meta.url, "messages", `${id}.md`), output);
    appendFileSync(join(import.meta.url, "public", "log.md"), `
    # New Chat Convrsation
    ${"`"}${input}${"`"}
    ${"```"}
    ${output}
    ${"```"}
    ---
    `, "utf-8");
    // vectorDb.createDoc(output);
    // vectorDb.save()
}
export default async function chat(input: string, dir?: string) {

    // dir && embedFilesInSubdirectorySync(dir);
    try {
        console.log("Starting Chat Bot");
        const initMessages: ChatCompletionRequestMessage[] = [
            { role: "system", content: readAllFiles("./src") },
            // { role: "system", content: JSON.stringify(await vectorDb.getSimiliar(input,3)) },
            { role: "system", content: readFileSync(join("./init", "system.txt"), "utf-8") },
            { role: "assistant", content: readFileSync(join("./init", "assistant.txt"), "utf-8") }
        ]
        // console.log(initMessages)
        // if (devMode) {
        //     const similar = await vectorDb.getSimiliar(input, 3);
        //     console.log("similar");
        //     console.log(similar);
        //     const chatCompletion: any = { data: { choices: [{ message: { content: "Dev Mode is on\n" + JSON.stringify(similar) } }] } }
        //     console.log(chatCompletion.data.choices[0].message?.content);
        //     return chatCompletion.data.choices[0].message?.content;
        // }
        const chatCompletion: any = await openai.createChatCompletion({
            user: "chat_gpt",
            model: "gpt-4",
            messages: initMessages.concat({ role: "user", content: input }),
        }).catch((reason) => {
            console.log("error in chat completion");
            console.log(reason?.response?.statusText);
            return reason;
        });
        if (chatCompletion) {
            console.log(chatCompletion)
            console.log(chatCompletion.usage)
            if(chatCompletion.data?.error) throw new Error(chatCompletion.data.error);           
            saveToDisk(input, chatCompletion.data.choices[0].message?.content)
            return chatCompletion.data.choices[0].message?.content;
        }
        return console.log("Not Executed")
    } catch (error) {
        console.error(error);
        return error;
    }
}