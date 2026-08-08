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
import { ArrowUpIcon, Bot, Maximize2, MessageCircle, MessageCircleDashedIcon, Minimize, Minimize2, X } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card"
import { MessageScroller, MessageScrollerContent, MessageScrollerProvider, MessageScrollerViewport } from "@/components/ui/message-scroller"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group"

export function ChatPanel() {

    const { isOpen, toggle, close } = useChatPanel()
    const { messages, input, setInput, send, isPending, isEnabled, canSend } = useAnalyseChat()


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

                            <button type="button" className="pointer-cursor p-2 hover:bg-[var(--color-surface-muted)] transition-colors rounded-full" onClick={open} aria-label="Fermer la discussion">
                                <X size={14} />
                            </button>


                        </div>
                    }
                />

                <CardContent className="w-[18vw] relative  flex flex-col gap-4" >
                    <MessageList />
                </CardContent>
                <CardFooter className="flex-col gap-2 border-0">
                    <form onSubmit={(e) => {
                        e.preventDefault()

                    }}
                        className="w-full"  >

                        <InputGroup className="py-1.5">

                            <InputGroupTextarea placeholder="Posez une question..." />
                            <InputGroupAddon align="block-end" className="py-1.5" >

                                <InputGroupButton type="submit" variant="primary" size="sm" className="ml-auto rounded-full p-1 size-8">
                                    <ArrowUpIcon className="size-5" />
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
            <EmptyTitle>Morning, shadcn!</EmptyTitle>
            <EmptyDescription>
                What are we working on today? Press send to start a new
                conversation
            </EmptyDescription>
        </EmptyHeader>
    </Empty>
)

export const MessageList = () => (
    <MessageScroller>
        {/* TODO: RENDER MESSAGES */}
        <MessageScrollerViewport>
            <MessageScrollerContent
                aria-busy={false}
                className="p-(--card-spacing)"
            >


            </MessageScrollerContent>

        </MessageScrollerViewport>
    </MessageScroller>
)