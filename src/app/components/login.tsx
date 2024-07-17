'use client';

import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { useRouter } from 'next/navigation';
import http from "@/app/utils/http";
import { useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import {Form} from "react-bootstrap";

const Login = ({onSignup, onLogin, onForget}: {onSignup: any, onLogin: any, onForget: any}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter();
    const [isEmailValid, setIsEmailValid] = useState(true);
    const queryClient = useQueryClient()
    const handleForgotPassword = () => {
        onForget(true);
        onLogin(false);
        onSignup(false);
    };

    const handleRegister = () => {
        onSignup(true);
        onLogin(false);
        onForget(false);
    };

    const handleEmailBlur = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        setIsEmailValid(isValid);
    };
    const handleLogin = async () => {
          let response;
        try {
            if (!email||!password) {
                message.error('Vui lòng nhập đầy đủ thông tin');
                return;
            }else{
                setError('');
            }
            setLoading(true);
            response = await http.axiosClient.post('/api/auth/login', {email, password});
            if (response.data?.statusCode === 200) {
                localStorage.setItem('accessToken', response.data?.resBody?.accessToken);
                localStorage.setItem('refreshToken', response.data?.resBody?.refreshToken);
                localStorage.setItem('role', response.data?.resBody?.userData?.role_id);
                setLoginAttempts(0);
                setLoading(false);
                message.success('Đăng nhập thành công!')
                router.back();
                queryClient.invalidateQueries({queryKey: ['verify']})
            }
        } catch (error) {
            //@ts-ignore
            if(error.response && error.response.status === 403){
                setLoading(false);
                message.error("Tài khoản đã bị khoá")
            }
            //@ts-ignore
             else if (error.response && error.response.status === 400) {
            setLoading(false);
            message.error("Tài khoản không tồn tại")
           } // @ts-ignore
             else if (error.response && error.response.status === 401) {
            setLoading(false);
            message.error("Mật khẩu không chính xác")
                 setLoginAttempts((prevAttempts) => prevAttempts + 1);
                if (loginAttempts + 1 === 5) {
                     const changePassword = window.confirm(
                         'Bạn có muốn đổi mật khẩu không?'
                     );
                     if (changePassword) {
                         onForget(true);
                         onLogin(false);
                         onSignup(false);
                     }
                     setLoginAttempts(0);
                 }

             } else {
            setLoading(false);
            message.error("Hệ thống đang bận")
        }
    }
    };
    return (
    <>
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
        }}>
            <p style={{fontSize: 30, fontWeight: 'bold',
                position: 'absolute', top: '100px', left: '100px'
                 }}>
                Chào mừng bạn đến với HustCv
            </p>
            <div style={{
                border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '400px', width: '100%',
                //xét màu trắng
                background: 'linear-gradient(to bottom right, black 70%, #ff0000)'
            }}>
                <h2 style={{
                    textAlign: 'center', fontSize: 25, fontWeight: 'bold'
                    // xét màu trắng
                    , color: '#fff'
                }}>Đăng Nhập</h2>
                <label>
                    <p style={{color: 'white', marginBottom: '8px'}}> Địa chỉ Email:</p>
                    <Input
                        type="text"
                        value={email}
                        placeholder="Nhập email"
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleEmailBlur}
                    />
                    {!isEmailValid && <p style={{color: 'red'}}>Email không hợp lệ.</p>}
                </label>
                <br/>
                <label>
                <p style={{color: 'white', marginBottom: '8px'}}>Mật khẩu :</p>
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        placeholder="Nhập mật khẩu"
                        onChange={(e) => setPassword(e.target.value)}
                        style={{marginBottom: '20px'}}
                    />
                </label>
                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label=" Hiển thị mật khẩu"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                        style={{ color: 'white' }}
                    />
                </Form.Group>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                    <Button
                        type="primary"
                        onClick={handleLogin}
                        loading={loading}
                        style={{backgroundColor: '#FF0000', borderColor: '#ff0000'}}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                    </Button>
                    <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
                        <div
                            style={{
                                color: 'black',
                                cursor: 'pointer'
                            }}
                            onClick={handleForgotPassword}
                        >
                            <p style={{color: 'white', marginBottom: '8px'}}> Quên mật khẩu?</p>

                        </div>
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    margin: '5px 0',
                    color: 'black',
                    cursor: 'pointer'
                }}>
                    <div>
                        <a style={{color: 'white', marginBottom: '8px', marginRight: '8px'}}>Bạn chưa có tài khoản?</a>
                        <span onClick={handleRegister} style={{cursor: 'pointer', color: 'white', marginBottom: '8px'}}>Đăng kí ngay</span>
                    </div>
                </div>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </div>
        </div>
    </>
    );
};

export default Login;
