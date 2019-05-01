/**
 * Created by 叶子 on 2017/7/30.
 * http通用工具函数
 */
import service from '@/utils/api.js';
import { message } from 'antd';

/**
 * 公用get请求
 * @param url       接口地址
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const get = ({url, params, msg = '接口异常', headers}) => {
return service({
        method: 'get',
        url,
        params,
        headers
    }).then(res => res.data).catch(err => {
    //    message.warn(err.response.data.error_msg);
        message.warn(msg);
    });
}

/**
 * 公用post请求
 * @param url       接口地址
 * @param data      接口参数
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const post = ({url, data, msg = '接口异常', headers}) =>
    service.post(url, data, headers).then(res => res.data).catch(err => {
        // message.warn(err.response.data.error_msg);
        message.warn(msg);
    });

/**
 * 公用post请求
 * @param url       接口地址
 * @param data      接口参数
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const put = ({
        url,
        data,
        msg = '接口异常',
        headers
    }) =>
    service.put(url, data, headers).then(res => res.data).catch(err => {
        // message.warn(err.response.data.error_msg);
        message.warn(msg);
    });

export const del = ({
        url,
        data,
        msg = '接口异常',
        headers
    }) =>
    service.delete(url, data, headers).then(res => res.data).catch(err => {
        // message.warn(err.response.data.error_msg);
        message.warn(msg);
    });