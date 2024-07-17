'use client'
import React, { useState } from 'react';
import dayjs from 'dayjs';
import Education from './education'
import Project from './project';
import { Descriptions } from 'antd';
import {
    Button,
    Modal,
    DatePicker,
    Form,
    Input,
    Checkbox,
    Radio,
    Select,
    message,
    Card,
    Popover,
    Avatar,
    Tabs,
    TabsProps
} from 'antd';
import { MoreOutlined, CheckOutlined, FireOutlined, ReadOutlined, FormOutlined, TagOutlined, EditOutlined, DeleteOutlined, UserOutlined, HomeOutlined, MoneyCollectOutlined, FieldTimeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { SelectProps, DatePickerProps } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import http from '../utils/http';
import moment from 'moment'
import { userInfo } from 'os';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

const userInfor = () => {
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    // const [birthDay, setBirthDay] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPhoneValid, setIsPhoneValid] = useState(true);

    const [isModalEditInforOpen, setModalEditInforOpen] = useState(false)
    const [editInfor, setEditInfor] = useState<any>({})
    const queryClient = useQueryClient()
    const userInfor = useQuery({
        queryKey: ['userInfor'],
        queryFn: async () => {
            try {
                const response = await http.getWithAutoRefreshToken('/api/profile/userInfor', { useAccessToken: true });
                return response
            }
            catch (error){

            }
        }
    })
    
    const editInforMutation = useMutation({
        mutationFn: async ({id, values}: any) => {
            values.birth = values.birth.toISOString()
            if(values.birth>new Date().toISOString().slice(0, 10)){
                throw new Error('Ngày sinh không hợp lệ')
            }
            const infor = values.name + '*/' + values.email + '*/' + values.birth + '*/' + values.phone + (values.gender != undefined ? ('*/' + values.gender) : '');
            const response = await http.putWithAutoRefreshToken('api/profile/userInfor/' + id, {infor: infor}, { useAccessToken: true })
            return response;
        },
        onSuccess: (data, variables, context) => {
            message.success('Cập nhật thông tin thành công!');
            queryClient.invalidateQueries({ queryKey: ['userInfor']})
        },
        onError: (error: any) => {
            message.error(error.message)
        }
    })

    const handlePhoneBlur = () => {
        const phoneRegex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        const isValid = phoneRegex.test(phoneNumber);
        setIsPhoneValid(isValid);
    };

    const handleEmailBlur = () => {
        const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
        const isValid = emailRegex.test(email);
        setIsEmailValid(isValid);
    };
    
    const showModalEditInfor = (infor: any) => {
        setEditInfor(infor)
        setModalEditInforOpen(true)
    }
    const cancelModalEditInfor = () => {
        setIsEmailValid(true);
        setIsPhoneValid(true);
        setModalEditInforOpen(false)
    }
    const finishEditInfor = (values: any) => {
        if (isPhoneValid && isEmailValid) {
            let id = editInfor.id
            editInforMutation.mutate({id, values})
            cancelModalEditInfor()
        }
    }
    // if (userInfor.isLoading) {
    //     return<>
    //         <div className="text-center h-screen">
    //             <h1 className="text-3xl text-gray-800 font-semibold">
    //                 Loading...
    //             </h1>
    //         </div>
    //     </>
    // }
    // else
    return(
        <>
            <div key={'user-infor'}>
                <Card
                    title={
                        <>
                            <p className='font-bold text-3xl'>Thông tin</p>
                        </>
                    }
                    extra={
                        <>
                            <div className='mb-4 mt-2'>
                                <a onClick={() => showModalEditInfor(userInfor?.data)}><EditOutlined className='mr-4 text-2xl' style={{ color: 'blue' }}/></a>
                            </div>
                        </>
                    }
                    className='w-full mb-4'
                    style={{ border: '2px solid darkred' }}
                >
                    <Descriptions column={2} contentStyle={{fontSize: 16}} labelStyle={{fontSize: 16}}>
                        <Descriptions.Item label="Họ tên">{userInfor?.data?.profile.split('*/')[0]}</Descriptions.Item>
                        <Descriptions.Item label="Email">{userInfor?.data?.profile.split('*/')[1]}</Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh">{moment(userInfor?.data?.profile.split('*/')[2]).format('DD/MM/YYYY')}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">{userInfor?.data?.profile.split('*/')[3]}</Descriptions.Item>
                        <Descriptions.Item label="Giới tính">{userInfor?.data?.profile.split('*/')[4]}</Descriptions.Item>
                    </Descriptions>
                </Card>
                <div>
                    {isModalEditInforOpen ? 
                    (<Modal
                        title="Sửa"
                        open={isModalEditInforOpen}
                        onCancel={cancelModalEditInfor}
                        footer={null}
                    >
                        <Form
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            onFinish={(values :any) => finishEditInfor(values)}
                        >
                            <Form.Item
                                label="Họ tên"
                                name="name"
                                initialValue={editInfor?.profile?.split('*/')[0]}
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên'}]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Email"
                                name="email"
                                initialValue={editInfor?.profile?.split('*/')[1]}
                                rules={[{ required: true, message: 'Vui lòng nhập email'}]}
                            >
                                <Input
                                    // // type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={handleEmailBlur}
                                />
                                {!isEmailValid && <p style={{color: 'red'}}>Email không hợp lệ.</p>}
                            </Form.Item>
                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                initialValue={editInfor?.profile?.split('*/')[3]}
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại'}]}
                            >
                                <Input
                                    // type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    onBlur={handlePhoneBlur}
                                />
                                {!isPhoneValid && <p style={{color: 'red'}}>Số điện thoại không hợp lệ.</p>}
                            </Form.Item>
                            <Form.Item
                                label="Ngày sinh"
                                name="birth"
                                initialValue={dayjs(moment(editInfor?.profile?.split('*/')[2]).format('DD/MM/YYYY'), 'DD/MM/YYYY')}
                                rules={[{ required: true, message: 'Vui lòng nhập ngày sinh'}]}
                            >
                                <DatePicker/>
                            </Form.Item>
                            <Form.Item
                                label="Giới tính"
                                name="gender"
                                initialValue={editInfor?.profile?.split('*/')[4]}
                            >
                                    <Select
                                    style={{ width: 120 }}
                                    options={[
                                        { value: 'Nam', label: 'Nam' },
                                        { value: 'Nữ', label: 'Nữ' },
                                        { value: 'Khác', label: 'Khác' },
                                    ]}
                                    />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit" className='bg-blue-600'>
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>) : ''}  
                </div>
            </div>
        </>
    )
}

export default userInfor