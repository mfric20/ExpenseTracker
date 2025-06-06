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

Please provide a detailed analysis and advice based on the expense data. Format your response using markdown with the following structure:

## Summary
[Brief overview of the analysis]

## Spending Patterns
- Use bullet points for key patterns
- **Bold** important numbers and percentages
- Include specific examples from the data

## Areas of Concern
- List any concerning spending patterns
- **Highlight** specific amounts that need attention
- Explain why these are concerning

## Recommendations
1. Number your recommendations
2. Make them specific and actionable
3. Include concrete numbers where relevant

## Additional Insights
- Add any other relevant observations
- Use **bold** for emphasis on important points
- Include specific examples from the data

Keep the tone constructive and helpful. Use proper markdown formatting for better readability.`;

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