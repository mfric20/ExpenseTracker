import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { question, expenses, provider, model } = await req.json();

        const expensesData = expenses.map((expense: any) => ({
            name: expense.name,
            amount: expense.amount,
            type: expense.typeName,
            date: expense.createdAt,
        }));

        const prompt = `You are a financial advisor analyzing expense data. Here is the user's question: "${question}"

Here is the user's expense data:
${JSON.stringify(expensesData, null, 2)}

Please provide a detailed analysis and advice based on the expense data. Focus on:
1. Identifying spending patterns
2. Highlighting areas of concern
3. Providing specific recommendations
4. Using the actual numbers from the data
5. Being constructive and helpful

Format your response in a clear, easy-to-read way.`;

        let answer;
        if (provider === "openai") {
            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: model,
                max_tokens: 500,
                temperature: 0.7,
            });
            answer = completion.choices[0]?.message?.content ?? "No response generated";
        } else {
            const response = await fetch("http://localhost:11434/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: model,
                    prompt: prompt,
                    stream: false,
                }),
            });
            const data = await response.json();
            answer = data.response;
        }
        
        return NextResponse.json({
            answer,
        });
    } catch (error) {
        console.error("Error in AI analysis:", error);
        return NextResponse.json(
            { error: "Failed to analyze expenses" },
            { status: 500 }
        );
    }
} 