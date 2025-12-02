import { GoogleGenAI } from "@google/genai";

console.log("SDK Imported");
try {
    const client = new GoogleGenAI({ apiKey: "dummy" });
    console.log("Client keys:", Object.keys(client));

    // Check for 'chats' property
    if (client.chats) {
        console.log("client.chats exists");
    } else {
        console.log("client.chats DOES NOT exist");
    }

    // Check for 'models' property
    if (client.models) {
        console.log("client.models exists");
    }

    // Check for 'getGenerativeModel' (old SDK)
    if (client.getGenerativeModel) {
        console.log("client.getGenerativeModel exists (Old SDK pattern?)");
    }

} catch (e) {
    console.error("Error instantiating:", e);
}
