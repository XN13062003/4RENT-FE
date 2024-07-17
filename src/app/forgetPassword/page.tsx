'use client'
import React, { useState,FormEvent } from 'react';
import { Button, Input } from 'antd';
import { useRouter } from 'next/navigation';
import http from "@/app/utils/http";
import { message } from 'antd';
import {Form} from "react-bootstrap";

// Define the ForgetPassword component
const ForgetPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);

    const handleEmailBlur = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        setIsEmailValid(isValid);
    };
    // mât khẩu phải có ít nhất 8 ký tự, trong đó có ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 số, có ký tự đặc biệt
    const handlePasswordBlur = () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        const isValid = passwordRegex.test(newPassword);
        setIsPasswordValid(isValid);
    }
        const handleEmailSubmit = async () => {
        try {
            if (!email) {
                message.error('Vui lòng nhập email');

                return;
            }else{
                setError('');
            }
            setLoading(true);
            const response = await http.axiosClient.post('/api/auth/forgotPassword', { email });
            console.log(response.data?.statusCode);
            if (response.data?.statusCode === 200) {
                setLoading(false);
                message.success('Mã xác nhận đã được gửi đến email của bạn')
                sessionStorage.setItem('email', email);
                setError('');
                setStep(2);
            }
        } catch (error) {
            // @ts-ignore
            if(error.response && error.response.status === 400){
                setLoading(false);
                message.error('Email không tồn tại');
            }
            // @ts-ignore
            else if(error.response && error.response.status === 403){
                setLoading(false);
                message.error('Tài khoản đã bị khoá');
            }
            // @ts-ignore
            else if(error.response && error.response.status === 401){
                setLoading(false);
                message.error('Email không tồn tại');
            }
            else {
                setLoading(false);
                message.error('Hệ thống đang bận');
            }
        } finally {
            // Stop loading
            setLoading(false);
        }
    };
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (newPassword !== confirmNewPassword) {
            message.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }
    }
    // Function to handle verification code submission
    const handleVerificationCodeSubmit = async () => {
        try {
            if (!verificationCode) {
                message.error('Vui lòng nhập mã xác nhận');
                return;
            }else{
                setError('');
            }
            setLoading(true);
            let email = sessionStorage.getItem('email');
            const response = await http.axiosClient.post('/api/auth/checkCode', { email,verificationCode });
            console.log(response.data?.statusCode )
            if (response.data?.statusCode === 200) {
                message.success('Mã xác nhận chính xác bạn có thể đặt lại mật khẩu')
                setError('');
                setStep(3);
            }
        } catch (error) {
            // @ts-ignore
            if(error.response && error.response.status === 400){
                setLoading(false);
                message.error('Mã xác nhận không chính xác');
            } else {
                setLoading(false);
                message.error('Hệ thống đang bận');
            }
        } finally {
            // Stop loading
            setLoading(false);
        }
    };


    // Function to handle password submission
    const handlePasswordSubmit = async () => {
        try {
            if (!newPassword||!confirmNewPassword) {
                message.error('Vui lòng nhập đầy đủ thông tin');
                return;
            }
            if(newPassword === confirmNewPassword){
                setError('');
            }else{
                message.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
                return;
            }
            setLoading(true);
            let email = sessionStorage.getItem('email');
            const response = await http.axiosClient.put('/api/auth/resetPassword', {email, newPassword });
            if (response.data?.statusCode === 200) {
                sessionStorage.clear();
                message.success('Đặt lại mật khẩu thành công bạn có thể đăng nhập lại')
                setError('');
                router.push('/login');
            }
        } catch (error) {
            // @ts-ignore
            if(error.response && error.response.status === 400){
                setLoading(false);
                message.error('Vui lòng điền đúng định dạng mật khẩu');
            } else {
                setLoading(false);
                message.error('Hệ thống đang bận');
            }
        } finally {
            // Stop loading
            setLoading(false);
        }
    };
    const handleLogin = () => {
        router.push('/login');
    };

    // JSX structure for the ForgetPassword component
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
        }}>
            <div style={{
                border: '1px solid #ccc',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '400px',
                width: '100%',
                // background: 'linear-gradient(to bottom right, black 60%, #ff0000)'
                background: 'linear-gradient(269.85deg, #54151C 0%, #121212 54.89%)'
            }}>
                <p style={{
                    fontSize: 30, fontWeight: 'bold',
                    position: 'absolute', top: '100px', left: '100px'
                }}>
                    Chào mừng bạn đến với HustCv
                </p>
                <h2 style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold',color :'white'}}>Quên mật khẩu</h2>
                {step === 1 && (
                    <>

                        <label>

                            <p style={{color: 'white'}}> Địa chỉ Email:</p>
                            <Input
                                type="text"
                                value={email}
                                placeholder="Nhập email"
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={handleEmailBlur}
                                style={{marginBottom: '20px'}}
                            />
                            {!isEmailValid && <p style={{color: 'red'}}>Email không hợp lệ.</p>}
                        </label>
                        <div style={{display: 'flex', justifyContent: 'right', alignItems: 'center'}}>
                            <Button
                                type="primary"
                                onClick={handleEmailSubmit}
                                loading={loading}
                                style={{backgroundColor: '#FF0000', borderColor: '#ff0000', marginRight: '20px'}}
                            >
                                {loading ? 'Đang Gửi...' : 'Gửi'}
                            </Button>
                            <Button
                                type="primary"
                                onClick={handleLogin}
                                style={{backgroundColor: 'gray', borderColor: '#blue'}}
                            >
                                Huỷ
                            </Button>
                        </div>

                    </>
                )}

                {step === 2 && (
                    <>
                        <label>

                            <p style={{color: 'white', marginBottom: '8px'}}> Mã xác nhận:</p>
                            <Input
                                type="text"
                                value={verificationCode}
                                placeholder="Nhập mã xác nhận"
                                onChange={(e) => setVerificationCode(e.target.value)}
                                style={{marginBottom: '20px'}}
                            />
                        </label>
                        <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                            <Button
                                type="primary"
                                onClick={handleVerificationCodeSubmit}
                                loading={loading}
                                style={{backgroundColor: '#FF0000', borderColor: '#FF0000', marginRight: '20px'}}
                            >
                                {loading ? 'Đang Gửi...' : 'Gửi'}
                            </Button>
                            <Button
                                type="primary"
                                onClick={handleLogin}
                                style={{backgroundColor: 'gray', borderColor: '#blue'}}
                            >
                                Huỷ
                            </Button>
                        </div>


                    </>
                )}

                {step === 3 && (
                    <>
                        <label>

                            <p style={{color: 'white', marginBottom: '8px'}}> Mật khẩu mới:</p>
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                placeholder="Nhập mật khẩu mới"
                                onChange={(e) => setNewPassword(e.target.value)}
                                onBlur={handlePasswordBlur}
                            />
                            {!isPasswordValid && <p style={{color: 'red'}}>
                              Mật khẩu phải có ít nhất 8 ký tự, trong đó có ít nhất 1 chữ cái viết hoa, 1 chữ cái viết
                              thường, 1 số và 1 ký tự đặc biệt
                            </p>}
                        </label>
                        <label>

                            <p style={{color: 'white', marginBottom: '8px'}}> Nhập lại mật khẩu mới:</p>
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={confirmNewPassword}
                                placeholder="Nhập lại mật khẩu mới"
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                        </label>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label=" Hiển thị mật khẩu"
                                checked={showPassword}
                                onChange={(e) => setShowPassword(e.target.checked)}
                                style={{color: 'white'}}
                            />
                        </Form.Group>
                        <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                            <Button
                                type="primary"
                                onClick={handlePasswordSubmit}
                                loading={loading}
                                style={{backgroundColor: '#FF0000', borderColor: '#ff0000',marginRight: '20px'}}
                            >
                                {loading ? 'Đang Gửi...' : 'Gửi'}
                            </Button>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <Button
                                    type="primary"
                                    onClick={handleLogin}
                                    style={{backgroundColor: 'gray', borderColor: '#blue'}}
                                >
                                    Huỷ
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                {error && <p style={{color: 'red'}}>{error}</p>}
            </div>
        </div>
    );
};

// Export the ForgetPassword component
export default ForgetPassword;
