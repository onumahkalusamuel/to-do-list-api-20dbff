import BaseService from "./base.service.ts";
import {ITodoList} from "../interfaces";

export const apiGetTodoLists = async (): Promise<ITodoList[]> => {
    return (await BaseService.get('/todo-list')).data;
}

export const apiGetTodoList = async (id: number) => {
    return (await BaseService.get(`/todo-list/${id}`)).data;
};

export const apiCreateTodoList = async (formData: object) => {
    return (await BaseService.post('/todo-list', formData)).data;
}

export const apiUpdateTodoList = async (id: number, formData: object) => {
    return (await BaseService.put(`/todo-list/${id}`, formData)).data;
}

export const apiDeleteTodoList = async (id: number) => {
    return (await BaseService.delete(`/todo-list/${id}`)).data;
}

export const apiCreateTodoListItem = async (id: number, formData: object) => {
    return (await BaseService.post(`/todo-list/${id}/todo-items`, formData)).data;
}

export const apiUpdateTodoListItem = async (id: number,item_id:number, formData: object) => {
    return (await BaseService.put(`/todo-list/${id}/todo-items/${item_id}`, formData)).data;
}

export const apiDeleteTodoListItem = async (id: number, item_id: number) => {
    return (await BaseService.delete(`/todo-list/${id}/todo-items/${item_id}`)).data;
}

export const apiToggleTodoListItem = async (id: number, item_id: number) => {
    return (await BaseService.put(`/todo-list/${id}/todo-items/${item_id}/toggle`, {})).data
}
