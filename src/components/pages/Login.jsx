/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { PwaInstaller } from '../widget';
import { connectAlita } from '@/reducer';
import { saveCookie } from '../../utils/authService'
import {
    API_ROOT
} from '../../config.js';

const FormItem = Form.Item;

class Login extends React.Component {
    componentDidMount() {
        const { setAlitaState } = this.props;
        setAlitaState({ stateName: 'auth', data: null });
        setAlitaState({ stateName: 'captcha', data: { data: `${API_ROOT}/users/getCaptcha?${Math.random()}` } });
    }
    componentDidUpdate(prevProps) { // React 16.3+弃用componentWillReceiveProps
        const { userInfo = {}, history } = this.props;
        if (userInfo && userInfo.nickname) { // 判断是否登陆
            localStorage.setItem('user', JSON.stringify(userInfo));
            history.push('/app/dashboard/index');
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                try {
                    const { setAlitaState } = this.props;
                    // if (values.userName === 'admin' && values.password === 'admin') setAlitaState({ funcName: 'admin', stateName: 'auth' });
                    // if (values.userName === 'guest' && values.password === 'guest') setAlitaState({ funcName: 'guest', stateName: 'auth' });
                    const res = await setAlitaState({ funcName: 'user', stateName: 'auth', params: { email: values.userName, password: values.password, captcha: values.captcha } });
                    const { token } = res.data;
                    saveCookie('token', token);

                    setAlitaState({ funcName: 'getMe', stateName: 'userInfo' });
                } catch(error) {
                    console.log("error:", error);
                }
            }
        });
    };
    gitHub = () => {
        window.location.href = 'https://github.com/login/oauth/authorize?client_id=792cdcd244e98dcd2dee&redirect_uri=http://localhost:3006/&scope=user&state=reactAdmin';
    };
    getCaptchaUrl = () => {
        const { setAlitaState } = this.props;
        setAlitaState({ stateName: 'captcha', data: { data: `${API_ROOT}/users/getCaptcha?${Math.random()}` } });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const { captcha = { data: null } } = this.props;
        return (
            <div className="login">
                <div className="login-form" >
                    <div className="login-logo">
                        <span>React Admin</span>
                        <PwaInstaller />
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="管理员输入admin, 游客输入guest" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="管理员输入admin, 游客输入guest" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('captcha', {
                                rules: [{ required: true, message: '请输入验证码！' }],
                            })(
                                <Input type="text" style={{ width: '98px' }} placeholder="请输入验证码" />
                            )}
                            <span onClick={this.getCaptchaUrl}>
                                <img src={captcha.data} alt="验证码" />
                            </span>
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住我</Checkbox>
                            )}
                            <span className="login-form-forgot" href="" style={{float: 'right'}}>忘记密码</span>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                            <p style={{display: 'flex', justifyContent: 'space-between'}}>
                                <span >或 现在就去注册!</span>
                                <span onClick={this.gitHub} ><Icon type="github" />(第三方登录)</span>
                            </p>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default connectAlita(['auth', 'captcha', 'userInfo'])(Form.create()(Login));