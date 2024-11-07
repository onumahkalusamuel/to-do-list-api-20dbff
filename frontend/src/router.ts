import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import LoginPage from "./views/LoginPage.vue";
import RegisterPage from "./views/RegisterPage.vue";
import AppLayout from "./layouts/AppLayout.vue";
import DashboardPage from "./views/app/DashboardPage.vue";
import ViewTodoList from "./views/app/ViewTodoList.vue";

const routes: RouteRecordRaw[] = [
    {path: '/', component: LoginPage, name: 'login'},
    {path: '/register', component: RegisterPage, name: 'register'},
    {
        path: '/app',
        component: AppLayout,
        children: [
            {path: '', component: DashboardPage, name: 'dashboard'},
            {path: '/todo-list/:id', component: ViewTodoList, name: 'view-todo-list'},
        ],
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
