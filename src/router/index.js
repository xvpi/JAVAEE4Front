import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },

        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/index',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/index.vue'),
                    meta: { title: '首页' }
                },
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: { title: '自定义图标' }
                },

                {
                    path: '/BaseInfo',
                    component: () => import(/* webpackChunkName: "table" */ '../components/studentinfo/BaseInfo.vue'),
                    meta: { title: '学生信息' }
                },{
                    path: '/ClassInfo',
                    component: () => import(/* webpackChunkName: "table" */ '../components/studentinfo/ClassInfo.vue'),
                    meta: { title: '班级成绩信息',permission: true }
                },{
                    path: '/ClassInfoMakeup',
                    component: () => import(/* webpackChunkName: "table" */ '../components/studentinfo/ClassInfoMakeup.vue'),
                    meta: { title: '补考信息',permission: true }
                },
                {
                    path: '/StatusManagement',
                    component: () => import(/* webpackChunkName: "table" */ '../components/studentinfo/StatusManagement.vue'),
                    meta: { title: '学籍管理',permission: true }
                },{
                    path: '/SysLog',
                    component: () => import(/* webpackChunkName: "table" */ '../components/studentinfo/SysLog.vue'),
                    meta: { title: '系统日志'}
                },
                {

                    path: '/dorm',
                    component: () => import(/* webpackChunkName: "table" */ '../components/studentinfo/dorm.vue'),
                    meta: { title: '宿舍更换申请'}
                },
                {
                    path: '/leave',
                    component: () => import(/* webpackChunkName: "table" */ '../components/studentinfo/leave.vue'),
                    meta: { title: '请假离校审批'}
                },{
                    path: '/Notice',
                    component: () => import(/* webpackChunkName: "table" */ '../components/studentinfo/Notice.vue'),
                    meta: { title: '公告管理' }
                },{
                    path: '/RegisterManagement',
                    component: () => import(/* webpackChunkName: "table" */ '../components/studentinfo/RegisterManagement.vue'),
                    meta: { title: '报道管理' }
                },
                {
                    path: '/CarReservation',
                    component: () => import(/* webpackChunkName: "table" */ '../components/studentinfo/CarReservation.vue'),
                    meta: { title: '车辆预约' }
                },
                {
                    path: '/AnswerQuestions',
                    component: () => import(/* webpackChunkName: "table" */ '../components/studentinfo/AnswerQuestions.vue'),
                    meta: { title: '问题解答' }
                },
                {
                    path: '/mentalhealth',
                    component: () => import(/* webpackChunkName: "table" */ '../components/studentinfo/mentalhealth.vue'),
                    meta: { title: '心理健康' }
                },
                {
                    path: '/HistoryNotice',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/HistoryNotice.vue'),
                    meta: { title: '历史公告' }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: 'tab选项卡'}
                },
                {
                    path: '/ChatWindow',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/studentinfo/ChatWindow.vue'),
                    meta: { title: '聊天窗口'}
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: { title: '支持作者' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
