export default {
    menus: [ // 菜单相关路由
        {
            key: '/app/article', title: '文章管理', icon: 'book',
            subs: [
                { key: '/app/article/article-list', title: '文章列表', component: 'ArticleList' },
                {
                    key: '/app/article/article-add',
                    title: '文章添加',
                    component: 'ArticleAdd'
                }
            ]
        },
        {
            key: '/app/tag', title: '标签管理', icon: 'tags',
            subs: [
                {
                    key: '/app/tag/tags-manage',
                    title: '标签列表',
                    component: 'TagsManage'
                },
            ]
        },
    ],
    others: [
        {
            key: '/app/article/article-edit/:id',
            title: '文章编辑',
            component: 'ArticleEdit'
        },
        {
            key: '/app/tag/tags-list/:id',
            title: '标签列表',
            component: 'TagsList'
        },
    ] // 非菜单相关路由
}