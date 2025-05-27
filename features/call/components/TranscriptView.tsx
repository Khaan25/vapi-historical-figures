"use client";

import { cn } from "@/lib/utils";
import { Message, MessageTypeEnum, TranscriptMessage } from "@/types/conversation.type";
import { useEffect, useRef } from "react";

interface TranscriptViewProps {
  messages: Message[];
  activeTranscript: TranscriptMessage | null;
}

export function TranscriptView({ messages, activeTranscript }: TranscriptViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTranscript]);

  // Filter out empty messages and those without content/transcript
  const filteredMessages = messages.filter((message) => {
    if (message.type === MessageTypeEnum.TRANSCRIPT) {
      return message.transcript && message.transcript.trim() !== "";
    }
    return message.content && message.content.trim() !== "";
  });

  return (
    <div className="relative w-full rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <h2 className="text-sm font-medium">Live Transcript</h2>
        </div>
      </div>

      <div className="flex flex-col space-y-4 p-4 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {filteredMessages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "group flex items-start space-x-2 relative",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">AI</span>
              </div>
            )}
            <div
              className={cn(
                "relative flex flex-col max-w-[80%] space-y-2",
                message.role === "user" ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "rounded-2xl px-4 py-2 inline-block break-words",
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                )}
              >
                <p className="text-sm">
                  {message.type === MessageTypeEnum.TRANSCRIPT
                    ? message.transcript
                    : message.content}
                </p>
              </div>
            </div>
            {message.role === "user" && (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">You</span>
              </div>
            )}
          </div>
        ))}

        {activeTranscript && activeTranscript.transcript.trim() !== "" && (
          <div className="group flex items-start space-x-2 justify-start">
            <div className="h-8 w-8 rounded-full bg-blue-600/50 flex items-center justify-center">
              <span className="text-sm font-medium text-white">AI</span>
            </div>
            <div className="relative flex flex-col max-w-[80%] space-y-2 items-start">
              <div className="rounded-2xl px-4 py-2 inline-block break-words bg-gray-100/80">
                {/* <div className="flex items-center gap-2 mb-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600/40 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-600/40 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-600/40 animate-bounce"></div>
                  </div>
                </div> */}
                <p className="text-sm text-gray-900">{activeTranscript.transcript}</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
