import Vue from 'vue'
import Router from 'vue-router'
// import Index from '../views/Index'
import Discover from '../views/Discover'
import Register from '../views/Register'
import Login from '../views/Login'
import PersonInfo from '../views/PersonInfo'
import SinglePic from '../views/SinglePic'
import PhotoDetails from '../views/PhotoDetails'
import PersonPage from '../views/PersonPage'
import Manager from '../views/Manager'
import BgPic from '@/components/BgPic'

Vue.use(Router)
//  将引入的vue-router注册成Vue插件
// 引入的vue-router是一个构造函数，我们通过传递一份儿路由配置清单给这个构造函数，得到一个router实例
// 将这个router实例注入到Vue根组件实例中

//  重写路由的push方法; 解决，相同路由跳转时，报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => err)
}
const router = new Router({
  model: 'history',
  routes: [
    {
      path: '/',
      name: 'Index', // 路由名称
      component: Discover
    }, {
      path: '/register',
      name: 'Register', // 路由名称
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/personpage',
      name: 'PersonPage',
      component: PersonPage,
      meta: {
        requiresAuth: true // 添加该字段，表示进入这个路由是需要登录的
      }
    }, {
      path: '/community/discover',
      name: 'Discover',
      component: Discover
    }, {
      path: '/community/personinfo',
      name: 'PersonInfo',
      component: PersonInfo,
      meta: {
        requiresAuth: true
      }
    }, {
      path: '/upload/single_pic',
      name: 'SinglePic',
      component: SinglePic
    }, {
      path: '/upload/single_pic_edit',
      name: 'SinglePicEdit',
      component: SinglePic
    }, {
      path: '/community/photo-details',
      name: 'PhotoDetails',
      component: PhotoDetails
    }, {
      path: '/bgpic',
      name: 'BgPic',
      component: BgPic
    }, {
      path: '/manager',
      name: 'Manager',
      component: Manager,
      redirect: '/manager/user_management',
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/manager/user_management',
          name: 'user_management',
          component: () => import('@/components/UserManagement')
        }, {
          path: '/manager/pic_review',
          name: 'pic_review',
          component: () => import('@/components/PicReview')
        }, {
          path: '/manager/customer_service',
          name: 'customer_service',
          component: () => import('@/components/Server')
        }
      ]
    }, {
      path: '/client',
      name: 'Communication',
      component: () => import('@/components/Communication')
    }, {
      path: '/person_action',
      name: 'PersonAction',
      component: () => import('../views/PersonAction')
    }, {
      path: '/community/album',
      name: 'Album',
      component: () => import('../views/Album')
    }
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  // 只要存在requiresAuth字段就会返回true
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('token')) {
      next()
    } else {
      // eslint-disable-next-line object-curly-spacing
      next({ path: '/login', query: { redirect: to.fullPath } })
    }
  } else {
    next()
  }
})
export default router
