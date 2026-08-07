"use client"

import { Button } from "@/components/ui/Button"
import { Bot, BotMessageSquare, MessageCircle } from "lucide-react"

export const ChatBot = () => {

    return (
        <div className="absolute bottom-0 right-0 p-4  bg-primary">
            <Bot size={40} className="text-primary-light" variant="outline" />
        </div>
    )
}