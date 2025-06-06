import { useQuery, useMutation } from "@tanstack/react-query";
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
import ReactMarkdown from "react-markdown";

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
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-4 ${
                            message.role === "user" ? "text-right" : "text-left"
                        }`}
                    >
                        <div
                            className={`inline-block rounded-lg p-3 ${
                                message.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                            }`}
                        >
                            {message.role === "assistant" ? (
                                <div
                                    className="prose prose-sm dark:prose-invert max-w-none
                                    [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:text-foreground
                                    [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:mb-3 [&>h2]:text-foreground
                                    [&>h3]:text-base [&>h3]:font-semibold [&>h3]:mb-2 [&>h3]:text-foreground
                                    [&>p]:mb-3 [&>p]:text-foreground/90 [&>p]:leading-relaxed
                                    [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul]:space-y-1
                                    [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>ol]:space-y-1
                                    [&>li]:text-foreground/90
                                    [&>strong]:font-semibold [&>strong]:text-foreground
                                    [&>hr]:my-4 [&>hr]:border-border"
                                >
                                    <ReactMarkdown>
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                message.content
                            )}
                        </div>
                    </div>
                ))}
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
