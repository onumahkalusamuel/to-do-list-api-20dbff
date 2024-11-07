import {defineStore} from 'pinia'
import {ITodoList} from "../interfaces";

export const useTodoListStore = defineStore('todoList', {
    state: () => ({todoList: [] as ITodoList[]}),
});
