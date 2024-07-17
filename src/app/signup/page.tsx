'use client';

import React, { useState } from 'react';
import {Button, Input, Select} from 'antd';
import { useRouter } from 'next/navigation';
import http from "@/app/utils/http";
import { message ,DatePicker} from 'antd';
import {Form} from "react-bootstrap";
import {useGetListProvinces} from "@/service/provinces.service";

const Signup: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [isEmployerOption, setIsEmployerOption] = useState(false);
    const [businessName, setBusinessName] = useState('');
    const [businessAddress, setBusinessAddress] = useState(null);
    const [businessWebsite, setBusinessWebsite] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter();

    const handleIsEmployerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsEmployerOption(event.target.checked);
    };

    const handleEmailBlur = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        setIsEmailValid(isValid);
    };
    // mật khẩu phải có ít nhất 8 ký tự, trong đó có ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 số,có ký tự đặc biệt
    const handlePasswordBlur = () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        const isValid = passwordRegex.test(password);
        setIsPasswordValid(isValid);
    };
    const { data: provincesData } = useGetListProvinces();
    console.log('>>>  check:', provincesData)
    const handlePhoneBlur = () => {
        const phoneRegex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        const isValid = phoneRegex.test(phoneNumber);
        setIsPhoneValid(isValid);
    };
    const handleSignup = async () => {
        let response = null ;
        try {
            if (!email || !password || !username|| !phoneNumber|| !birthDay|| !confirmPass) {
                message.error('Vui lòng nhập đầy đủ thông tin');
                setLoading(false);
                return;
            }
            if(password !== confirmPass){
                message.error('Mật khẩu không khớp');
                setLoading(false);
                return;
            }
            if(birthDay>new Date().toISOString().slice(0, 10)){
                message.error('Ngày sinh không hợp lệ');
                setLoading(false);
                return;
            }
            setLoading(true);
            let role_id = 2; // Default role for job seeker
            let business_id = null;
            if (isEmployerOption) {
                if (!businessName || !businessAddress || !businessWebsite) {
                    message.error('Vui lòng nhập đầy đủ thông tin công ty');
                    setLoading(false);
                    return;
                }
                role_id = 1;
                try {
                    const businessResponse = await http.axiosClient.post('/api/business', {
                        businessName,
                        businessAddress,
                        businessWebsite,
                    });
                    business_id = businessResponse.data?.id;
                } catch (businessError) {
                        message.error('Đã xảy ra lỗi khi tạo công ty');
                        setLoading(false);
                }
            }
            try {
            const response = await http.axiosClient.post('/api/users', {
                    username,
                    email,
                    password,
                    phoneNumber,
                    birthDay,
                    role_id,
                    business_id,
                });
                    message.success('Đăng ký thành công xin mời đăng nhập');
                    router.push('/login');
                    setLoading(false);
            } catch (error) {
                //@ts-ignore
                if (error.response && error.response.status === 401) {
                    setLoading(false);
                    message.error('Email đã tồn tại');
                }// @ts-ignore
                else if (error.response && error.response.status === 400) {
                    message.error('Vui lòng nhập đầy đủ thông tin');
                    setLoading(false);
                } else {
                    setLoading(false);
                    message.error('Hệ thống đang bận');
                }
            }
        } catch (e) {
            // @ts-ignore
            setLoading(false);
        }finally {
            // Stop loading
            setLoading(false);
        }
    };
    const handleLogin = () => {
        router.push('/login');
    };
    return (

        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '150vh',
        }}>
            <p style={{
                fontSize: 30, fontWeight: 'bold',
                position: 'absolute', top: '100px', left: '100px'
            }}>
                Chào mừng bạn đến với HustCv
            </p>
            <div style={{
                border: '1px solid #ccc',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '400px',
                width: '100%',
                // background: 'linear-gradient(to bottom right, black 80%, #ff0000)'
                background: 'linear-gradient(269.85deg, #54151C 0%, #121212 54.89%)'

            }}>
                <h2 style={{textAlign: 'center', fontSize: 25, fontWeight: 'bold', color: 'white'}}>Đăng Ký</h2>
                <label>

                    <p style={{color: 'white', marginBottom: '8px'}}> Họ và tên:</p>
                    <Input
                        type="text"
                        value={username}
                        placeholder="Nhập họ và tên"
                        onChange={(e) => setUsername(e.target.value)}
                        style={{marginBottom: '20px'}}
                    />
                </label>
                <br/>
                <label>
                    <p style={{color: 'white', marginBottom: '8px'}}> Địa chỉ Email:</p>
                    <Input
                        type="text"
                        value={email}
                        placeholder="Nhập email"
                        onChange={(e) => setEmail(e.target.value)}
                        style={{marginBottom: '20px'}}
                        onBlur={handleEmailBlur}
                    />
                    {!isEmailValid && <p style={{color: 'red'}}>Email không hợp lệ.</p>}
                </label>
                <br/>
                <label>

                    <p style={{color: 'white', marginBottom: '8px'}}> Mật khẩu:</p>
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        placeholder="Nhập mật khẩu"
                        onChange={(e) => setPassword(e.target.value)}
                        style={{marginBottom: '20px'}}
                        onBlur={handlePasswordBlur}
                    />
                    {!isPasswordValid && <p style={{color: 'red'}}>
                      Mật khẩu phải có ít nhất 8 ký tự, trong đó có ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường ,
                      1 số và 1 ký tự đặc biệt
                    </p>}
                </label>
                <label>
                    <p style={{color: 'white', marginBottom: '8px'}}> Nhập lại mật khẩu:</p>
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={confirmPass}
                        placeholder="Nhập lại mật khẩu"
                        onChange={(e) => setConfirmPass(e.target.value)}
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
                <label>
                    <p style={{color: 'white', marginBottom: '8px'}}> Số điện thoại:</p>
                    <Input
                        type="text"
                        value={phoneNumber}
                        placeholder="Nhập số điện thoại"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        style={{marginBottom: '20px'}}
                        onBlur={handlePhoneBlur}
                    />
                    {!isPhoneValid && <p style={{color: 'red'}}>Số điện thoại không hợp lệ.</p>}
                </label>
                <br/>
                {/*<label>*/}
                {/*    Ngày sinh:*/}
                {/*    <Input*/}
                {/*        type="text"*/}
                {/*        value={birthDay}*/}
                {/*        placeholder="Nhập ngày sinh"*/}
                {/*        onChange={(e) => setBirthDay(e.target.value)}*/}
                {/*        style={{ marginBottom: '20px' }}*/}
                {/*    />*/}
                {/*</label>*/}
                <label style={{marginBottom: '12px'}}>
                    <p style={{color: 'white', marginBottom: '8px'}}>Ngày sinh:</p>
                    <DatePicker onChange={(date, dateString) => setBirthDay(dateString)}/>
                </label>
                <br/>
                {/* Employer option */}
                <div style={{marginBottom: '20px', marginTop: '20px'}}>
                    <label style={{color: 'white'}}>
                        Bạn có phải nhà tuyển dụng không?
                        <input
                            type="checkbox"
                            checked={isEmployerOption}
                            onChange={handleIsEmployerChange}
                            style={{marginLeft: '5px'}}
                        />
                    </label>

                </div>

                {/* Render additional fields if isEmployerOption is true */}
                {isEmployerOption && (
                    <>
                        <label>
                            <p style={{color: 'white', marginBottom: '8px'}}>Tên công ty:</p>
                            <Input
                                type="text"
                                value={businessName}
                                placeholder="Nhập tên công ty"
                                onChange={(e) => setBusinessName(e.target.value)}
                                style={{marginBottom: '20px'}}
                            />
                        </label>
                        <br/>
                        <label>
                            <p style={{color: 'white', marginBottom: '8px'}}> Địa chỉ công ty:</p>
                            <Select
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="Địa chỉ công ty"
                                options={provincesData?.data?.map(province => {
                                    return {
                                        value: province.name,
                                        label: province.name
                                    }
                                })}
                                value={businessAddress}
                                onChange={(value) => setBusinessAddress(value)}
                            >
                            </Select>
                        </label>
                        <br/>
                        <label>
                            <p style={{color: 'white', marginBottom: '8px'}}> Website công ty:</p>
                            <Input
                                type="text"
                                value={businessWebsite}
                                placeholder="Nhập website công ty"
                                onChange={(e) => setBusinessWebsite(e.target.value)}
                                style={{marginBottom: '20px'}}
                            />
                        </label>
                        <br/>
                    </>
                )}
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                    <Button
                        type="primary"
                        onClick={handleSignup}
                        loading={loading}
                        style={{backgroundColor: '#FF0000', borderColor: '#ff0000'}}
                    >
                        {loading ? 'Đang đăng kí...' : 'Đăng kí'}
                    </Button>
                    <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
                        <Button
                            type="primary"
                            onClick={handleLogin}
                            style={{backgroundColor: 'Gray', borderColor: '#blue'}}
                        >
                            Huỷ
                        </Button>
                    </div>
                </div>
                {error && <p style={{color: '#ff0000'}}>{error}</p>}
            </div>
        </div>
    );

};

export default Signup;
