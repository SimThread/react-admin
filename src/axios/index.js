/**
 * Created by hao.cheng on 2017/4/16.
 */
import axios from 'axios';
import { get, post, put, del } from './tools';
import {
    API_ROOT
} from '../config.js';
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
    url: `${API_ROOT}/auth/local`,
    data: data
});

export const getCaptcha = () => get({
    url: `${API_ROOT}/users/getCaptcha?${Math.random()}`
});

export const getMe = () => get({
    url: `${API_ROOT}/users/me`
});

export const getArticleList = (params) => get({
    url: `${API_ROOT}/article/getArticleList`,
    params: params,
});

export const getArticle = (params) => get({
    url: `${API_ROOT}/article/${params.id}/getArticle`,
});

export const addAricle = (data) => post({
    url: `${API_ROOT}/article/addArticle`,
    data,
})

export const updateArticle = (data) => put({
    url: `${API_ROOT}/article/${data._id}/updateArticle`,
    data: data
});

export const deleteArticle = (params) => del({
    url: `${API_ROOT}/article/${params.id}`,
});

export const getTagCatList = () => get({
    url: `${API_ROOT}/tags/getTagCatList`
})

export const updateTagCat = (data) => put({
    url: `${API_ROOT}/tags/${data._id}/updateTagCat`,
    data: data,
});

export const deleteTagCat = (params) => del({
    url: `${API_ROOT}/tags/${params.id}`
});

export const getTagList = (params) => get({
    url: `${API_ROOT}/tags/${params._id}/getTagList`
});

export const updateTag = (data) => put({
    url: `${API_ROOT}/tags/${data._id}/updateTag`,
    data,
});

export const addTag = (data) => post({
    url: `${API_ROOT}/tags/addTag`,
    data,
});

export const deleteTag = (data) => del({
    url: `${API_ROOT}/tags/${data._id}/deleteTag`,
});