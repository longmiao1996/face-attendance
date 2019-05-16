import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import Meeting from '@/components/Meeting'
import Person from '@/components/Person'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      redirect: '/person',
      component: HomePage,
      children:[
        {
          path: '/meeting',
          name: 'Meeting',
          component: Meeting
        },
        {
          path: '/person',
          name: 'Person',
          component: Person
        }
      ]
    },
  ]
})
