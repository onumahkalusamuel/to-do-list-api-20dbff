<template>
  <div style="display: flex; justify-content: space-between; align-items: center">
    <h2>{{ todoList.title }}</h2>
    <div>
      <button @click="router.push({name: 'dashboard'})">&leftarrow; Todo Lists</button>
    </div>
  </div>
  <hr/>
  <div style="display: flex; justify-content: space-between; align-items: center">
    <h4>Todo Items</h4>
    <div>
      <button @click="addTodoItem">Add item</button>
    </div>
  </div>
  <table width="100%" border="1">
    <tbody>
    <tr v-for="todoItem in todoList.items" :key="todoItem.id">
      <td>
        <input type="checkbox" :checked="todoItem.done" @change="toggleItem(todoItem.id)"/>
      </td>
      <td style="width: 70%">
        <div style="padding: 15px" v-html="todoItem.content"
             :style="todoItem.done?'text-decoration: line-through;color: green;':''"></div>
      </td>
      <td>
        <button @click="updateTodoItem(todoItem.id, todoItem.content)" class="edit-button">
          <pen-icon/>
        </button>
        <button @click="deleteTodoItem(todoItem.id)" title="delete" class="delete-button">
          <trash-icon/>
        </button>
      </td>
    </tr>
    <tr v-if="!todoList?.items?.length">
      <td colspan="3">
        <div style="padding: 5px">No records found</div>
      </td>
    </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {ITodoList} from "../../interfaces";
import {
  apiCreateTodoListItem,
  apiDeleteTodoListItem,
  apiGetTodoList, apiToggleTodoListItem, apiUpdateTodoListItem
} from "../../services/todo-list.service.ts";
import TrashIcon from "../../components/icons/TrashIcon.vue";
import PenIcon from "../../components/icons/PenIcon.vue";

const router = useRouter();

const {id} = useRoute().params;
const todoList = ref({} as ITodoList);
const toggleItem = async (itemId: number) => {
  await apiToggleTodoListItem(parseInt(id as string), itemId);
  const index = todoList.value.items?.findIndex(t => t.id == itemId);
  if (index && todoList.value.items) {
    todoList.value.items[index].done = !todoList.value.items[index].done;
  } else {
    todoList.value = await apiGetTodoList(id as unknown as number);
  }
}

const deleteTodoItem = async (itemId: number) => {
  await apiDeleteTodoListItem(parseInt(id as string), itemId);
  todoList.value.items?.splice(todoList.value.items?.findIndex(t => t.id == itemId), 1)
}

const updateTodoItem = async (itemId: number, content: string) => {
  const newContent = prompt('Content:', content);
  if (!newContent || newContent === content) return;

  const update = await apiUpdateTodoListItem(parseInt(id as string), itemId, {content});
  if (update.id) {
    const index = todoList.value.items?.findIndex(t => t.id === itemId);
    if (index && todoList.value.items) todoList.value.items[index].content = newContent
  } else alert(update.message);
}

const addTodoItem = async () => {
  const content = prompt('Content:');
  if (!content) return;

  const create = await apiCreateTodoListItem(parseInt(id as string), {content});
  if (!todoList.value.items?.length) todoList.value.items = [];
  if (create.id) todoList.value.items?.unshift(create)
  else alert(create.message);
}

onMounted(async () => {
  todoList.value = await apiGetTodoList(id as unknown as number);
})
</script>
