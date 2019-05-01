/**
 * Created by hao.cheng on 2017/4/16.
 */
import axios from 'axios';
import { get, post, put, del } from './tools';
import * as config from './config';

export const getBbcNews = () => get({ url: config.NEWS_BBC });

export const npmDependencies = () => axios.get('./npm.json').then(res => res.data).catch(err => console.log(err));

export const weibo = () => axios.get('./weibo.json').then(res => res.data).catch(err => console.log(err));

export const gitOauthLogin = () => get({ url: `${config.GIT_OAUTH}/authorize?client_id=792cdcd244e98dcd2dee&redirect_uri=http://localhost:3006/&scope=user&state=reactAdmin` });
export const gitOauthToken = code => post({ 
    url: `https://cors-anywhere.herokuapp.com/${config.GIT_OAUTH}/access_token`,
    data: {
        client_id: '792cdcd244e98dcd2dee',
        client_secret: '81c4ff9df390d482b7c8b214a55cf24bf1f53059',
        redirect_uri: 'http://localhost:3006/',
        state: 'reactAdmin',
        code,
    } 
});
// {headers: {Accept: 'application/json'}}
export const gitOauthInfo = access_token => get({ url: `${config.GIT_USER}access_token=${access_token}` });

// easy-mock数据交互
// 管理员权限获取
export const admin = () => get({ url: config.MOCK_AUTH_ADMIN });
// 访问权限获取
export const guest = () => get({ url: config.MOCK_AUTH_VISITOR });

export const user = (data) => post({
    url: '/auth/local',
    data: data
});

export const getCaptcha = () => get({
    url: '/users/getCaptcha?' + Math.random()
});

export const getMe = () => get({
    url: '/users/me'
});

export const getArticleList = (params) => get({
    url: '/article/getArticleList',
    params: params,
});

export const getArticle = (params) => get({
    url: `/article/${params.id}/getArticle`,
});

export const addAricle = (data) => post({
    url: `/article/addArticle`,
    data,
})

export const updateArticle = (data) => put({
    url: `/article/${data._id}/updateArticle`,
    data: data
});

export const deleteArticle = (params) => del({
    url: `/article/${params.id}`,
});

export const getTagCatList = () => get({
    url: '/tags/getTagCatList'
})

export const updateTagCat = (data) => put({
    url: `/tags/${data._id}/updateTagCat`,
    data: data,
});

export const deleteTagCat = (params) => del({
    url: `/tags/${params.id}`
});

export const getTagList = (params) => get({
    url: `/tags/${params._id}/getTagList`
});

export const updateTag = (data) => put({
    url: `/tags/${data._id}/updateTag`,
    data,
});

export const addTag = (data) => post({
    url: `/tags/addTag`,
    data,
});

export const deleteTag = (data) => del({
    url: `/tags/${data._id}/deleteTag`,
});