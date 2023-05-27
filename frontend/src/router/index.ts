import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  useRoute,
  useRouter,
} from 'vue-router'

import { ROUTE_NAMES } from '@/enums'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.main },
  },
  {
    path: '/main',
    name: ROUTE_NAMES.main,
    component: () => import('@/pages/MainPage.vue'),
  },
  {
    path: '/projects',
    name: ROUTE_NAMES.projects,
    component: () => import('@/pages/ProjectsPage.vue'),
  },
  {
    path: '/project/:id',
    name: ROUTE_NAMES.project,
    props: true,
    component: () => import('@/pages/ProjectItem/ProjectItemPage.vue'),
  },
  {
    path: '/nfts',
    name: ROUTE_NAMES.nfts,
    component: () => import('@/pages/MyNftsPage.vue'),
  },
  {
    path: '/nft/:address/:id',
    name: ROUTE_NAMES.nft,
    props: true,
    component: () => import('@/pages/NftItem/NftItemPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

export { router, useRouter, useRoute }
