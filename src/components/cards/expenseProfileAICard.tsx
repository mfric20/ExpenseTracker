import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface Props {
    id: string;
}

export default function ExpenseProfileAICard({ id }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [aiProvider, setAiProvider] = useState<"openai" | "ollama">("openai");
    const [model, setModel] = useState<string>("gpt-4o-mini");

    const expensesQuery = useQuery({
        queryKey: ["getExpenses", id],
        queryFn: async () => {
            const response = await axios.get(`/api/expenseProfile/${id}`);
            return response.data.expenses || [];
        },
    });

    const handleProviderChange = (value: "openai" | "ollama") => {
        setAiProvider(value);
        setModel(value === "openai" ? "gpt-4o-mini" : "llama3.3");
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [
            ...prev,
            { role: "user", content: userMessage },
        ]);
        setIsLoading(true);

        try {
            const response = await axios.post("/api/ai/analyze", {
                question: userMessage,
                expenses: expensesQuery.data,
                provider: aiProvider,
                model: model,
            });

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: response.data.answer },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry, I encountered an error while processing your request. Please try again.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full p-4">
            <div className="flex justify-end gap-4 mb-4">
                <Select value={aiProvider} onValueChange={handleProviderChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select AI provider" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="ollama">Ollama</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                        {aiProvider === "openai" ? (
                            <>
                                <SelectItem value="gpt-4o-mini">
                                    GPT-4o Mini
                                </SelectItem>
                                <SelectItem value="gpt-3.5-turbo">
                                    GPT-3.5 Turbo
                                </SelectItem>
                            </>
                        ) : (
                            <>
                                <SelectItem value="llama3.3">
                                    Llama 3.3
                                </SelectItem>
                                <SelectItem value="mistral">Mistral</SelectItem>
                            </>
                        )}
                    </SelectContent>
                </Select>
            </div>
            <ScrollArea className="flex-1 rounded-md border p-4 mb-4">
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                message.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg p-3 ${
                                    message.role === "user"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 dark:bg-gray-800"
                                }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                                Thinking...
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSendMessage();
                        }
                    }}
                    placeholder="Ask me anything about your expenses..."
                    className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={isLoading}>
                    Send
                </Button>
            </div>
        </div>
    );
}
