"use server";

import OpenAI from "openai"; // Default export from the new SDK.

// Initialize OpenAI with your API key
const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
});


// Function to call OpenAI API
export const getAnswerFromOpenAI = async (transcript) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: transcript }],
            max_tokens: 300,
            temperature: 0.7,
        });

        // Handle both new & old SDK response formats
        const content =
            response?.choices?.[0]?.message?.content ||
            response?.data?.choices?.[0]?.message?.content ||
            null;

        if (!content) {
            throw new Error("No content returned from OpenAI.");
        }

        return content.trim();
    } catch (error) {
        if (error.response) {
            console.error("OpenAI API Error:", error.response.status, error.response.data);
        } else {
            console.error("Error generating answer from OpenAI:", error.message);
        }
        return "Sorry, I couldn't generate a description right now.";
    }
};
