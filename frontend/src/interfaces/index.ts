export interface ITodoList {
    id: number;
    title: string;
    createdAt?: string;
    items?: ITodoListItem[],
}

export interface ITodoListItem {
    id: number;
    listId: number;
    content: string;
    done?: boolean;
}
