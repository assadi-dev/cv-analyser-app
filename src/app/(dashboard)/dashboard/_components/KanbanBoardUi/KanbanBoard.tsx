
import {
    Kanban,
    KanbanBoard,
    KanbanColumn,
    KanbanColumnHandle,
    KanbanItem,
    KanbanItemHandle,
    KanbanOverlay,
} from "@/components/ui/kanban";
import React from "react";
import type { Candidature, CandidatureStatus } from "@/types";

interface KanbanBoardUiProps {
    candidatures: Candidature[];
    isLoading: boolean;
    onStatusChange: (id: string, status: CandidatureStatus) => void;
    onNewAnalysis: () => void;
}

const KanbanBoardUi = ({ candidatures, isLoading, onStatusChange, onNewAnalysis }: KanbanBoardUiProps) => {

    const [columns, setColumns] = React.useState({
        todo: [
            { id: 1, title: "Task 1" },
            { id: 2, title: "Task 2" },
        ],
        done: [
            { id: 3, title: "Task 3" },
        ],
    });

    return (<Kanban
        value={columns}
        onValueChange={setColumns}
        getItemValue={(item) => item.id}
        className="bg-accent-foreground"
    >
        <KanbanBoard className="bg-accent-foreground">
            {
                Object.entries(columns).map(([columnId, items]) => (
                    <KanbanColumn key={columnId} value={columnId} className="bg-red-100">
                        <KanbanOverlay>
                            <KanbanColumnHandle />
                            ddd
                            <KanbanItemHandle />
                        </KanbanOverlay>
                        {items.map((item) => (
                            <KanbanItem key={item.id} value={item.id}>
                                {item.title}
                            </KanbanItem>
                        ))}
                    </KanbanColumn>
                ))
            }
        </KanbanBoard>
    </Kanban>)
}

export default KanbanBoardUi