import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import DashboardHome from '../components/DashboardHome.vue'
import UserList from '../views/UserList.vue'
import AddUser from '../views/AddUser.vue'
import EditUser from '../views/EditUser.vue'
import RoleManagement from '../views/RoleManagement.vue'
import AddRole from '../views/AddRole.vue'
import EditRole from '../views/EditRole.vue'
import PermissionManagement from '../views/PermissionManagement.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: DashboardHome
      },
      {        path: 'users',               name: 'UserList',           component: UserList      },      
      {        path: 'users/add',           name: 'AddUser',            component: AddUser      },
      {        path: 'users/edit/:id',      name: 'EditUser',           component: EditUser      },
      {        path: 'roles',               name: 'RoleManagement',     component: RoleManagement      },
      {        path: 'roles/add',           name: 'AddRole',            component: AddRole      },
      {        path: 'roles/edit/:id',      name: 'EditRole',           component: EditRole      },
      {
        path: 'permissions',
        name: 'PermissionManagement',
        component: PermissionManagement
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  // 检查是否需要登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 这里可以检查本地存储中的token
    const token = localStorage.getItem('token')
    if (!token) {
      next({ name: 'Login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router