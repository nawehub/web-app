'use client'

import React, { useState, useEffect, useCallback } from 'react';
import {Send, Lightbulb, User, Bot, Loader, Zap} from 'lucide-react';
import {Textarea} from "@/components/ui/textarea"; // Using lucide-react for icons

// Mock Constants and Types (in a real app, this would be Protobuf structures)
const MOCK_USER_ID = "entrepreneur-101";
const MOCK_API_URL = "http://localhost:9090/grpc/chat"; // In reality, this would be a gRPC endpoint

// Mock history structure matching the Protobuf/Gemini API Content format
const initialHistory = [
    { role: 'model', parts: [{ text: "Hello! I'm your AI Business Coach. What great idea are we exploring today, or what business challenge can I help you solve?" }] }
];

const CoachChat = () => {
    const [prompt, setPrompt] = useState('');
    const [history, setHistory] = useState(initialHistory);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Function to simulate the gRPC call (via REST for this web example)
    const callChatService = useCallback(async (newPrompt: any) => {
        setIsLoading(true);
        setError("");

        // Prepare the request payload structure (matching our gRPC/Protobuf definitions)
        const requestBody = {
            user_id: MOCK_USER_ID,
            new_prompt: newPrompt,
            history: history.map(h => ({
                role: h.role,
                parts: h.parts.map(p => ({ text: p.text }))
            })),
        };

        // Optimistically update the UI with the user's message
        const newUserTurn = { role: 'user', parts: [{ text: newPrompt }] };
        setHistory(prev => [...prev, newUserTurn]);

        // --- Mock API Call to the gRPC Backend (in a real app, this is a gRPC client call) ---
        // NOTE: We are mocking a successful response structure that would come from the Spring Boot service

        // Simulate the I/O-heavy call with a delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        let mockResponse;
        try {
            // Mocking the result of the backend processing the chat request
            const mockGeneratedText = "That's a fantastic starting point! To help you better, let's explore three key areas: market size, competitive landscape, and your unique value proposition. Which area should we focus on first? Or, would you like to brainstorm another idea?";

            const updatedHistoryFromBackend = [
                ...requestBody.history,
                newUserTurn,
                { role: 'model', parts: [{ text: mockGeneratedText }] }
            ];

            mockResponse = {
                response_text: mockGeneratedText,
                updated_history: updatedHistoryFromBackend,
            };

            // Update state with the definitive, complete history returned by the backend
            setHistory(mockResponse.updated_history);

        } catch (e) {
            console.error("Mock API Error:", e);
            setError("Failed to connect to the AI service. Please check your backend.");
            // Rollback the optimistic user message if error occurred
            setHistory(prev => prev.slice(0, prev.length - 1));
        } finally {
            setIsLoading(false);
        }
    }, [history]);

    // Handler for clicking a suggestion button
    const handleSuggestionClick = (suggestion: any) => {
        if (isLoading) return;
        callChatService(suggestion).then();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;
        const currentPrompt = prompt.trim();
        setPrompt('');
        callChatService(currentPrompt).then();
    };

    // Scroll to the latest message
    useEffect(() => {
        const chatWindow = document.getElementById('chat-window');
        if (chatWindow) {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }, [history]);

    // Render Logic for Chat Message
    // Takes an additional prop for handling clicks
    const ChatMessage = ({ message, onSuggestionClick }: any) => {
        const isUser = message.role === 'user';
        const icon = isUser ? <User size={18} className="text-white" /> : <Bot size={18} className="text-blue-500" />;
        const bgColor = isUser ? 'bg-indigo-600' : 'bg-white shadow-md';
        const textColor = isUser ? 'text-white' : 'text-gray-800';
        const alignment = isUser ? 'justify-end' : 'justify-start';

        return (
            <div className={`flex ${alignment} mb-4`}>
                <div className={`max-w-3/4 p-4 rounded-xl ${bgColor} ${textColor} transition-all duration-300`}>
                    <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${isUser ? 'bg-indigo-800' : 'bg-blue-100'}`}>
                            {icon}
                        </div>
                        <p className="flex-1 whitespace-pre-wrap">{message.parts[0].text}</p>
                    </div>

                    {/* NEW: Render Suggestions only for Model messages */}
                    {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200/50 space-y-2">
                            <p className="text-sm font-semibold text-gray-500 flex items-center">
                                <Zap size={14} className="mr-1 text-indigo-400" /> Quick Actions:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {message.suggestions.map((suggestion: any, idx: any) => (
                                    <button
                                        key={idx}
                                        onClick={() => onSuggestionClick(suggestion)}
                                        className="text-sm px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                                        disabled={isLoading}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans p-4 sm:p-8">
            <div className="max-w-4xl w-full mx-auto flex flex-col h-[90vh] rounded-2xl shadow-xl overflow-hidden bg-gray-100">

                {/* Header */}
                <header className="bg-white p-4 sm:p-6 border-b border-gray-200 flex items-center space-x-3">
                    <Lightbulb className="text-yellow-500 w-8 h-8"/>
                    <h1 className="text-2xl font-bold text-gray-800">AI Business Coach & Idea Generator</h1>
                </header>

                {/* Chat Window */}
                <div id="chat-window" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                    {history.map((msg, index) => (
                        <ChatMessage
                            key={index}
                            message={msg}
                            onSuggestionClick={handleSuggestionClick} // Pass handler
                        />
                    ))}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="flex justify-start mb-4">
                            <div className="max-w-3/4 p-4 rounded-xl bg-white shadow-md text-gray-800">
                                <div className="flex items-center space-x-2">
                                    <Loader className="w-5 h-5 text-blue-500 animate-spin" />
                                    <span>AI Coach is thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm transition-opacity duration-500">
                            {error}
                        </div>
                    )}
                </div>

                {/* Input Form */}
                <footer className="p-4 sm:p-6 bg-white border-t border-gray-200">
                    <form onSubmit={handleSubmit} className="flex space-x-3">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ask the coach for an idea, strategy, or challenge your business plan..."
                            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-150 shadow-inner"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center"
                            disabled={isLoading}
                        >
                            <Send size={24} />
                        </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        User ID: {MOCK_USER_ID}. Chat history is managed by sending all previous turns to the AI model.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default CoachChat;