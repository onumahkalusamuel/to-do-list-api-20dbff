export interface IArticle {
    id: number;
    title: string;
    content: string;
    author: string;
    tag?: string;
    createdAt?: string;
    updatedAt?: string;
}
