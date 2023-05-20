export default [
  {
    menu_id: 1,
    title: 'articleManagement',
    path: '/articleManagement',
    key: 'articleManagement',
    parentKey: '',
    icon: 'icon_edit',
    keepAlive: 'false',
    order: 1
  },
  {
    menu_id: 11,
    title: 'articleClassification',
    path: '/articleClassification',
    key: 'articleClassification',
    parentKey: 'articleManagement',
    icon: '',
    keepAlive: 'false',
    order: 1
  },
  {
    menu_id: 12,
    title: 'article',
    path: '/article',
    key: 'article',
    parentKey: 'articleManagement',
    icon: '',
    keepAlive: 'false',
    order: 2
  },
  {
    menu_id: 13,
    title: 'updateArticle',
    path: '/updateArticle',
    key: 'updateArticle',
    parentKey: 'articleManagement',
    icon: '',
    hidden: true,
    keepAlive: 'false',
    order: 3
  },
  {
    menu_id: 2,
    title: 'userManagement',
    path: '/userManagement',
    key: 'userManagement',
    parentKey: '',
    icon: 'icon_infopersonal',
    keepAlive: 'false',
    order: 2
  }
]
