import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/Button"
import { useChatPanel } from "../../_hooks/useChatPanel"
import { useAnalyseChat } from "../../_hooks/useAnalyseChat"
import { ArrowUpIcon, Bot, Maximize2, MessageCircle, MessageCircleDashedIcon, Minimize, Minimize2, Send, X } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card"
import { MessageScroller, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from "@/components/ui/message-scroller"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group"
import { motion } from "motion/react"
import { Message, MessageContent } from "@/components/ui/message"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { ChatMessageItem, AnalyseResult } from "../../_types"
import { ChatMessageListMock } from "../../_mocks/chatMessageMock"
import { useState } from "react"
import { Marker, MarkerContent } from "@/components/ui/marker"
import { PulsatingDots } from "@/components/loading-ui/pulsating-dots"
import { Recommendation } from "@/types"
import { useChatMessage } from "../../_hooks/useChatMessage"



interface ChatPanelProps {
    result: AnalyseResult | null
    recommendations: Recommendation[]
}
export function ChatPanel({ result }: ChatPanelProps) {

    const { isOpen, toggle, close } = useChatPanel()
    const { input, setInput, send, isPending, isEnabled, canSend } = useAnalyseChat()
    const chatMessage = useChatMessage()


    return (
        <MessageScrollerProvider>
            <Card className="flex flex-col h-full justify-between">
                <CardHeader
                    icon={<MessageCircle size={15} className="text-[var(--color-primary)]" />}
                    title="Assistant IA"
                    subtitle={isEnabled ? "À propos de votre analyse" : "Analyse requise"}
                    action={
                        <div className="flex gap-4">

                            <button type="button" className="pointer-cursor p-2 hover:bg-[var(--color-surface-muted)] transition-colors rounded-full" onClick={close} aria-label="Agrandir">
                                <Maximize2 size={14} />
                            </button>

                            <button type="button" className="pointer-cursor p-2 hover:bg-[var(--color-surface-muted)] transition-colors rounded-full" onClick={close} aria-label="Fermer la discussion">
                                <X size={14} />
                            </button>


                        </div>
                    }
                />

                <CardContent className="w-[18vw] overflow-hidden py-3 relative  flex flex-col gap-4 flex-1" >
                    {messages.length > 0 ? <MessageList messages={messages} isLoading={isLoading} /> : <EmptyMessage />}
                </CardContent>
                <CardFooter className="flex-col gap-2 border-0">
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        const message: ChatMessageItem = {
                            id: crypto.randomUUID(),
                            content: e.currentTarget["input"].value,
                            role: "user",
                            timestamp: new Date().toISOString(),
                        }
                        setMessage((prev) => [...prev, message])
                        setIsLoading(true);
                        e.currentTarget.reset();

                    }}
                        className="w-full"  >

                        <InputGroup className="py-1.5">

                            <InputGroupTextarea name="input" placeholder="Posez une question..." />
                            <InputGroupAddon align="block-end" className="py-1.5" >

                                <InputGroupButton type="submit" variant="primary" size="sm" className="ml-auto rounded-full p-1.5! size-6.5">
                                    <Send className="size-5" />
                                    <span className="sr-only">Send Message</span>
                                </InputGroupButton>
                            </InputGroupAddon>

                        </InputGroup>
                    </form>
                </CardFooter>
            </Card>
        </MessageScrollerProvider>
    )
}



const EmptyMessage = () => (
    <Empty className="h-full">
        <EmptyHeader>
            <EmptyMedia variant="icon">
                <MessageCircleDashedIcon />
            </EmptyMedia>
            <EmptyTitle>Aucune question</EmptyTitle>
            <EmptyDescription>
                Posez une question sur votre analyse et l'assistant IA vous répondra.
            </EmptyDescription>
        </EmptyHeader>
    </Empty>
)

type MessageListProps = {
    messages: ChatMessageItem[]
    isEnabled?: boolean
    isLoading?: boolean
}
export const MessageList = ({ messages, isEnabled, isLoading }: MessageListProps) => {







    return (<MessageScroller>
        <MessageScrollerViewport className="px-1">
            <MessageScrollerContent
                aria-busy={isEnabled}
                className="px-1"
            >
                {messages.map((message) => (
                    <MotionMessageContent key={message.id} message={message} />
                ))}

                {isLoading && <Marker role="status">
                    <MarkerContent className="shimmer">
                        <PulsatingDots className="size-8" />

                    </MarkerContent>
                </Marker>}

            </MessageScrollerContent>


        </MessageScrollerViewport>
    </MessageScroller>
    )
}




const MotionMessageScrollerItem = motion.create(MessageScrollerItem)



type MotionMessageContentProps = {
    message: ChatMessageItem
}
const MotionMessageContent = ({ message }: MotionMessageContentProps) => {

    const isUser = message.role === "user"

    return (
        <MotionMessageScrollerItem
            animate={{ opacity: 1, transform: "translateY(0)" }}
            initial={{ opacity: 0, transform: "translateY(20px)" }}
            exit={{ opacity: 0, transform: "translateY(20px)" }}
            transition={{ duration: 0.3 }}
            messageId={message.id}
            scrollAnchor={isUser}
        >
            <Message align={isUser ? "end" : "start"}>
                {
                    isUser ? (
                        <MessageContent className="w-full">
                            <Bubble variant={isUser ? "default" : "muted"}>
                                <BubbleContent className="whitespace-pre-wrap" >{message.content}</BubbleContent>
                            </Bubble>
                        </MessageContent>
                    ) : (

                        <MessageContent className="w-full">
                            <div className="w-full p-3 text-left"> {message.content}</div>
                        </MessageContent>

                    )
                }


            </Message>
        </MotionMessageScrollerItem>
    )
}


