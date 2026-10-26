import { createRouter, createWebHistory } from 'vue-router'
import {
  getCurrentUser,
  isAuthenticated,
  logout,
  refreshCurrentUser
} from '../services/auth'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import DeliveriesView from '../views/DeliveriesView.vue'
import NewDeliveryView from '../views/NewDeliveryView.vue'
import EditDeliveryView from '../views/EditDeliveryView.vue'
import DeliveryDetailView from '../views/DeliveryDetailView.vue'
import HistoryView from '../views/HistoryView.vue'
import UsersView from '../views/UsersView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },

  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      guest: true
    }
  },

  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/entregas',
    name: 'deliveries',
    component: DeliveriesView,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/entregas/nueva',
    name: 'new-delivery',
    component: NewDeliveryView,
    meta: {
      requiresAuth: true,
      roles: [
        'Coordinador logístico',
        'Administrador'
      ]
    }
  },

  {
    path: '/entregas/:id/editar',
    name: 'edit-delivery',
    component: EditDeliveryView,
    meta: {
      requiresAuth: true,
      roles: [
        'Coordinador logístico',
        'Administrador'
      ]
    }
  },

  {
    path: '/entregas/:id',
    name: 'delivery-detail',
    component: DeliveryDetailView,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/historial',
    name: 'history',
    component: HistoryView,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/usuarios',
    name: 'users',
    component: UsersView,
    meta: {
      requiresAuth: true,
      roles: [
        'Administrador'
      ]
    }
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async to => {
  if (to.meta.requiresAuth || (to.meta.guest && isAuthenticated())) {
    if (!isAuthenticated()) {
      return '/login'
    }

    try {
      await refreshCurrentUser()
    } catch (error) {
      // Una caída de red no invalida el token ni borra la sesión guardada.
      if (error.status === 401) logout()
      if (to.meta.guest) {
        if (error.status !== 401 && to.query.session !== 'unavailable') {
          return { path: '/login', query: { ...to.query, session: 'unavailable' }, replace: true }
        }
        return
      }
      return error.status === 401
        ? '/login'
        : { path: '/login', query: { session: 'unavailable' } }
    }
  }

  if (
    to.meta.guest &&
    isAuthenticated()
  ) {
    return '/dashboard'
  }

  if (to.meta.roles) {
    const user =
      getCurrentUser()

    if (
      !user ||
      !to.meta.roles.includes(
        user.role
      )
    ) {
      return '/dashboard'
    }
  }
})

export default router