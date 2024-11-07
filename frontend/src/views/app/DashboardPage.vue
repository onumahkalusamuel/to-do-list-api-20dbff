<script setup lang="ts">
import {onMounted} from "vue";
import {
  apiCreateTodoList,
  apiDeleteTodoList,
  apiGetTodoLists,
  apiUpdateTodoList
} from "../../services/todo-list.service.ts";
import {useTodoListStore} from "../../stores/todo-list.store.ts";
import PenIcon from "../../components/icons/PenIcon.vue";
import TrashIcon from "../../components/icons/TrashIcon.vue";

const todoList = useTodoListStore();
const deleteRecord = async (id: number) => {
  if (!confirm('This article will be deleted permanently. Continue?')) return;
  await apiDeleteTodoList(id);
  const index = todoList.todoList.findIndex(a => a.id === id);
  todoList.todoList.splice(index, 1);
}

const createTodoList = async () => {
  const title = prompt('Title:');
  if (!title) return;

  const create = await apiCreateTodoList({title});
  if (create.id) todoList.todoList.unshift(create)
  else alert(create.message);
}
const updateTodoList = async (id: number, title: string) => {
  const newTitle = prompt('Title:', title);
  if (!newTitle || newTitle === title) return;

  const update = await apiUpdateTodoList(id, {title: newTitle});
  if (update.id) {
    const index = todoList.todoList.findIndex(t => t.id === id);
    todoList.todoList[index].title = newTitle
  } else alert(update.message);
}

onMounted(async () => {
  todoList.todoList = await apiGetTodoLists()
})
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center">
      <h2>Todo List</h2>
      <div>
        <button @click="createTodoList">Create Todo List</button>
      </div>
    </div>
    <hr/>
    <table border="1" width="100%" cellpadding="10" cellspacing="1">
      <thead>
      <tr>
        <th>SN</th>
        <th style="width:70%">Title</th>
        <th>Actions</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="(td, i) in todoList.todoList" :key="td.id">
        <td>{{ i + 1 }}</td>
        <td>
          <router-link :to="{name: 'view-todo-list', params: {id: td.id}}">
            {{ td.title }}
          </router-link>
        </td>
        <td>
          <button @click="updateTodoList(td.id, td.title)" class="edit-button">
            <pen-icon/>
          </button>
          <button @click="deleteRecord(td.id)" class="delete-button">
            <trash-icon/>
          </button>
        </td>
      </tr>
      <tr v-if="!todoList?.todoList?.length">
        <td colspan="4">
          <div style="padding: 5px">No records found.</div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
