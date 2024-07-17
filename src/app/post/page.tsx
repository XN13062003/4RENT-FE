'use client'
import React, { useState } from 'react';
import {
    Button,
    Modal,
    DatePicker,
    Form,
    Input,
    Radio,
    Select,
    message,
    Card,
    Popover,
    Avatar,
} from 'antd';
import type { SelectProps } from 'antd';
import { MoreOutlined, AreaChartOutlined, FireOutlined, CheckOutlined, ReadOutlined, FormOutlined, TagOutlined, EditOutlined, DeleteOutlined, UserOutlined, HomeOutlined, MoneyCollectOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IPost } from '../shared/recruitmentPost.type';
import http from '../utils/http';
import moment from 'moment'
const { TextArea } = Input;
const { Option } = Select;
import { Empty } from 'antd';
import dayjs from 'dayjs';
import { useGetListProvinces } from '@/service/provinces.service';

const Post = () => {
    //hook
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [isModalEditOpen, setIsModalEditOpen] = useState(false)
    const [editPost, setEditPost] = useState<any>({})
    const [isAddNewLoading,setIsAddNewLoading] = useState(false)
    const [isEditLoading,setIsEditLoading] = useState(false)
    const [isDeleteLoading,setIsDeleteLoading] = useState(false)

    // Get QueryClient from the context
    const queryClient = useQueryClient()

    //api
    const { data: provincesData } = useGetListProvinces();

    const addNewPostMutation = useMutation({
        mutationFn: async (values: IPost) => {
            const data = await http.postWithAutoRefreshToken('/api/recruitmentPosts', values, { useAccessToken: true })
            return data
        },
        onSuccess: (data, variables, context) => {
            message.success('Đăng bài thành công!')
            setIsModalOpen(false)
            queryClient.invalidateQueries({ queryKey: ['recruitmentPosts'] })
        },
        onError: (error: any) => {
            message.error(error.response.data.message)
        }
    })

    const { data, isLoading, isError } = useQuery({
        queryKey: ['recruitmentPosts'],
        queryFn: async () => {
            try {
                const response = await http.getWithAutoRefreshToken('/api/recruitmentPosts', { useAccessToken: true })        //chỗ này cần sửa api cho bản thân
                return response
            } catch (error) {
                console.log(error)
            }
        }
    })

    const skillsResponse = useQuery({
        queryKey: ['skills'],
        queryFn: async () => {
            try {
                const response = await http.axiosClient.get('/api/skills/getAllSkills')
                return response.data
            } catch (error) {
                console.log(error)
            }
        }
    })


    const deletePostMutation = useMutation({
        mutationFn: async (id: any) => {
            const response = await http.deleteWithAutoRefreshToken('/api/recruitmentPosts/' + id, { useAccessToken: true })
            return response
        },
        onSuccess: (data, variables, context) => {
            message.success('Xoá bài đăng thành công')
            queryClient.invalidateQueries({ queryKey: ['recruitmentPosts'] })
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const updateMutation = useMutation({
        mutationFn: async ({ id, values }: any) => {
            const response = await http.putWithAutoRefreshToken('/api/recruitmentPosts/' + id, values, { useAccessToken: true })
            return response
        },
        onSuccess: (data, variables, context) => {
            message.success('Sửa bài đăng thành công')
            setIsModalEditOpen(false)
            queryClient.invalidateQueries({ queryKey: ['recruitmentPosts'] })
        },
        onError: (error) => {
            console.log(error)
        }
    })


    //component require
    const options: SelectProps['options'] = [];

    skillsResponse?.data?.map((skill: any) => {
        options.push({
            label: skill.name,
            value: skill.id,
        })
    })

    //logic
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        setIsDeleteLoading(true)
        deletePostMutation.mutate(deleteId)
        setIsModalConfirmOpen(false)
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = (values: any) => {
        setIsAddNewLoading(true)
        values.dateClose = values.dateClose.toISOString()
        addNewPostMutation.mutate(values)
    }

    const onFinishEdit = (id: any, values: any) => {
        setIsEditLoading(true)
        values.dateClose = values.dateClose.toISOString()
        updateMutation.mutate({ id, values })
    }

    const handleEdit = (post: any) => {

        setEditPost(post)
        setIsModalEditOpen(true)
    }

    const handleDelete = (id: any) => {
        setDeleteId(id)
        setIsModalConfirmOpen(true)
    }


    return (
        <>
            <div className="container mx-auto">
                <div >
                    <Button className='ml-[300px] my-5 bg-gradient-to-r from-[#121212] to-[#54151c]' type="primary" onClick={showModal}>
                        Đăng bài tuyển dụng mới
                    </Button>
                    <Modal title="Tạo bài đăng tuyển"
                        open={isModalOpen}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="back" onClick={handleCancel}>
                                Huỷ
                            </Button>
                        ]}
                    >
                        <Form
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            layout="horizontal"
                            style={{ maxWidth: 800 }}
                            className='w-800px'
                            onFinish={onFinish}

                        >
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập trường này'
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('title').length <= 100) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Giới hạn 100 ký tự.'));
                                        },
                                    })
                                ]}
                                label="Tiêu đề bài đăng"
                                name='title'
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập trường này'
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('describe').length <= 1000) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Giới hạn 1000 ký tự.'));
                                        },
                                    })
                                ]}
                                label="Mô tả bài đăng tuyển"
                                name='describe'>
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập trường này'
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('request').length <= 500) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Giới hạn 500 ký tự.'));
                                        },
                                    })
                                ]}
                                label="Yêu cầu"
                                name='request'>
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item rules={[{ required: true, message: 'Vui lòng nhập trường này' }]} label="Hình thức" name='form'>
                                <Radio.Group>
                                    <Radio value="Onsite"> Onsite </Radio>
                                    <Radio value="Hybrid"> Hybrid </Radio>
                                    <Radio value="Remote"> Remote </Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item rules={[{ required: true, message: 'Vui lòng nhập trường này' }]} label='Địa điểm' name='location'>
                                <Select
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Địa điểm"
                                    options={provincesData?.data?.map(province => {
                                        return {
                                            value: province.name,
                                            label: province.name
                                        }
                                    })}
                                >
                                </Select>
                            </Form.Item>
                            <Form.Item rules={[{ required: true, message: 'Vui lòng nhập trường này' }]} label='Trình độ' name='level'>
                                <Select
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Trình độ"
                                >
                                    <Option value="Intern">Intern</Option>
                                    <Option value="Fresher">Fresher</Option>
                                    <Option value="Junior">Junior</Option>
                                    <Option value="Senior">Senior</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item rules={[{ required: true, message: 'Vui lòng nhập trường này' }]} label='Kỹ năng' name='skill'>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Kỹ năng"
                                    options={options}
                                />
                            </Form.Item>
                            <Form.Item rules={[{ required: true, message: 'Vui lòng nhập trường này' }]} label='Mức lương' name='salary'>
                                <Select
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Mức lương"
                                >
                                    <Option value="2.000.000 đ - 5.000.000 đ">2.000.000 đ - 5.000.000 đ</Option>
                                    <Option value="5.000.000 đ - 10.000.000 đ">5.000.000 đ - 10.000.000 đ</Option>
                                    <Option value="10.000.000 đ - 15.000.000 đ">10.000.000 đ - 15.000.000 đ</Option>
                                    <Option value="15.000.000 đ - 25.000.000 đ">15.000.000 đ - 25.000.000 đ</Option>
                                    <Option value="25.000.000 đ - 50.000.000 đ">25.000.000 đ - 50.000.000 đ</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập trường này'
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('dateClose') >= new Date()) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Ngày kết thúc phải bắt đầu ít nhất từ ngày mai.'));
                                        },
                                    })
                                ]}
                                label="Ngày hết hạn"
                                name='dateClose'
                            >
                                <DatePicker format='DD/MM/YYYY' />
                            </Form.Item>
                            <Form.Item rules={[{ required: true, message: 'Vui lòng nhập trường này' }]} wrapperCol={{ offset: 10, span: 16 }}>
                                <Button loading={isAddNewLoading} className='bg-blue-600' type="primary" htmlType="submit">
                                    Đăng
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
                {data?.data?.length < 1 ? (
                    <div className='mx-[300px] my-[80px]'>
                        <div className='text-center text-black'>Bạn chưa đăng bài tuyển dụng nào</div>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                ) : (
                    <div className='mx-[300px]'>
                        {data?.data?.map((post: any, index: number) => {
                            return (
                                <Card
                                    key={post.id}
                                    title={
                                        <>
                                            <p><Avatar className='mr-4' size='large' icon={<UserOutlined />} />{post.user.username}</p>
                                        </>
                                    }
                                    extra={
                                        <div className='flex items-center text-lg'>
                                            <div>
                                                <a onClick={() => handleEdit(post)}><EditOutlined className='mr-4' /></a>
                                            </div>
                                            <div>
                                                <a onClick={() => handleDelete(post.id)}><DeleteOutlined className='mr-4' /></a>
                                            </div>
                                        </div>
                                    }
                                    className='w-full mb-4'
                                >
                                    <h3 className='font-bold text-lg'><TagOutlined className='mr-4' />{post.title}</h3>
                                    <p className='my-3'><FormOutlined className='mr-4' />{post.describe}</p>
                                    <div className='my-3'>
                                        <p><FireOutlined className='mr-4' />Yêu cầu: {post.request}</p>
                                    </div>
                                    <p className='my-3'><AreaChartOutlined className='mr-4' />Hình thức: {post.form}</p>
                                    <p className='my-3'><HomeOutlined className='mr-4' />Địa điểm: {post.location}</p>
                                    <p className='my-3'><CheckOutlined className='mr-4' />Trình độ: {post.level}</p>
                                    <div className='my-3'>
                                        <p><ReadOutlined className='mr-4' />Kĩ năng cần thiết: {post.skills?.map((skill: any) => skill.name).join(', ')}</p>
                                    </div>
                                    <p className='my-3'><MoneyCollectOutlined className='mr-4' />Mức lương: {post.salary}</p>
                                    <p className='my-3'><FieldTimeOutlined className='mr-4' />Ngày kết thúc: {moment(post.dateClose).format('DD/MM/YYYY')}</p>
                                </Card>
                            )
                        })}
                    </div >
                )}
                <div>
                    {isModalConfirmOpen ? (
                        <Modal
                            title="Chú ý"
                            open={isModalConfirmOpen}
                            onCancel={() => { setIsModalConfirmOpen(false) }}
                            footer={[
                                <Button key="back" onClick={() => setIsModalConfirmOpen(false)}>
                                    Huỷ
                                </Button>,
                                <Button loading={isDeleteLoading} danger key='ok' onClick={handleConfirm}>
                                    Xoá
                                </Button>
                            ]}
                        >
                            <p>Bạn có chắc muốn xoá bài viết này?</p>
                        </Modal>
                    ) : ''}
                </div>
                <div>
                    {isModalEditOpen ? (
                        <Modal title="Sửa bài đăng tuyển"
                            open={isModalEditOpen}
                            onCancel={() => { setIsModalEditOpen(false) }}
                            footer={[
                                <Button key="back" onClick={() => { setIsModalEditOpen(false) }}>
                                    Huỷ
                                </Button>
                            ]}
                        >
                            <Form
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                layout="horizontal"
                                style={{ maxWidth: 800 }}
                                className='w-800px'
                                onFinish={(values: any) => onFinishEdit(editPost.id, values)}
                            >
                                <Form.Item
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập trường này'
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('title').length <= 100) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Giới hạn 100 ký tự.'));
                                            },
                                        })
                                    ]}
                                    label="Tiêu đề bài đăng"
                                    name='title'
                                    initialValue={editPost.title}>
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập trường này'
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('describe').length <= 1000) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Giới hạn 1000 ký tự.'));
                                            },
                                        })
                                    ]}
                                    label="Mô tả bài đăng tuyển"
                                    name='describe'
                                    initialValue={editPost.describe}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>
                                <Form.Item
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập trường này'
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('request').length <= 500) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Giới hạn 500 ký tự.'));
                                            },
                                        })
                                    ]}
                                    label="Yêu cầu"
                                    name='request'
                                    initialValue={editPost.request}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>
                                <Form.Item rules={[{ required: true, message: 'Vui lòng nhập trường này' }]} label="Hình thức" name='form' initialValue={editPost.form}>
                                    <Radio.Group>
                                        <Radio value="Onsite"> Onsite </Radio>
                                        <Radio value="Hybrid"> Hybrid </Radio>
                                        <Radio value="Remote"> Remote </Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item rules={[{ required: true, message: 'Vui lòng nhập trường này' }]} label='Địa điểm' name='location' initialValue={editPost.location}>
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Địa điểm"
                                        options={provincesData?.data?.map(province => {
                                            return {
                                                value: province.name,
                                                label: province.name
                                            }
                                        })}
                                    >
                                    </Select>
                                </Form.Item>
                                <Form.Item rules={[{ required: true, message: 'Vui lòng nhập trường này' }]} label='Trình độ' name='level' initialValue={editPost.level}>
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Trình độ"
                                    >
                                        <Option value="Intern">Intern</Option>
                                        <Option value="Fresher">Fresher</Option>
                                        <Option value="Junior">Junior</Option>
                                        <Option value="Senior">Senior</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
                                    label='Kỹ năng' name='skill'
                                    initialValue={
                                        editPost.skills?.map((skill: any) => {
                                            return {
                                                label: skill.name,
                                                value: skill.id
                                            }
                                        })
                                    }
                                >
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Kỹ năng"
                                        options={options}
                                    />
                                </Form.Item>
                                <Form.Item rules={[{ required: true, message: 'Vui lòng nhập trường này' }]} label='Mức lương' name='salary' initialValue={editPost.salary}>
                                    <Select
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Mức lương"
                                    >
                                        <Option value="2.000.000 đ - 5.000.000 đ">2.000.000 đ - 5.000.000 đ</Option>
                                        <Option value="5.000.000 đ - 10.000.000 đ">5.000.000 đ - 10.000.000 đ</Option>
                                        <Option value="10.000.000 đ - 15.000.000 đ">10.000.000 đ - 15.000.000 đ</Option>
                                        <Option value="15.000.000 đ - 25.000.000 đ">15.000.000 đ - 25.000.000 đ</Option>
                                        <Option value="25.000.000 đ - 50.000.000 đ">25.000.000 đ - 50.000.000 đ</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập trường này'
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('dateClose') >= new Date()) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Ngày kết thúc phải bắt đầu ít nhất từ ngày mai.'));
                                            },
                                        })
                                    ]}
                                    label="Ngày hết hạn"
                                    name='dateClose'
                                    initialValue={dayjs(moment(editPost.dateClose).format('DD/MM/YYYY'), 'DD/MM/YYYY')}
                                >
                                    <DatePicker format='DD/MM/YYYY' />
                                </Form.Item>
                                <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                                    <Button loading={isEditLoading} className='bg-blue-600' type="primary" htmlType="submit">
                                        Lưu
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Modal>
                    ) : ''
                    }
                </div>
            </div >
        </>
    )
}

export default Post