import { ChatMessageItem } from "../_types";


export const ChatMessageListMock: ChatMessageItem[] = [
    {
        id: "1",
        role: "user",
        content: "Hello",
        timestamp: new Date().toISOString(),
    },
    {
        id: "2",
        role: "assistant",
        content: "Hi fsdsdsde erzrzrzrzrz zrzrzr zrz rzrzrzr rzr zrzrz rzr zr zrz zezez zezezeze zez ezez. zeze ezez ezz ez \n\n drer  zezee zezdze ez e ez ez e ze zez e ze",
        timestamp: new Date().toISOString(),
    },
    {
        id: "3",
        role: "user",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci, voluptatibus!",
        timestamp: new Date().toISOString(),
    },
    {
        id: "4",
        role: "assistant",
        content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, quod.",
        timestamp: new Date().toISOString(),
    },
    {
        id: "5",
        role: "user",
        content: "Hello",
        timestamp: new Date().toISOString(),
    },
    {
        id: "6",
        role: "assistant",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci, voluptatibus!",
        timestamp: new Date().toISOString(),
    }
]