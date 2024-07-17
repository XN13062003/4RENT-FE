'use client'
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Descriptions } from 'antd';
import {
    Button,
    Modal,
    DatePicker,
    Form,
    Input,
    Checkbox,
    Radio,
    // GetProps,
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
import { IPost } from '../shared/recruitmentPost.type';
import http from '../utils/http';
import moment from 'moment'
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
// type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;


const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];

const Experience = () => {
    const [isModalAddExpOpen,setModalAddExpOpen] = useState(false)
    const [isModalEditExpOpen, setModalEditExpOpen] = useState(false)
    const [isModalConfirmDeleteExpOpen, setModalConfirmDeleteExpOpen] = useState(false)
    const [disabledCheckboxExp, setDisabledCheckboxExp] = useState(false)
    const [deleteExp, setDeleteExp] = useState(null)
    const [editExp, setEditExp] = useState<any>({})

    const queryClient = useQueryClient()
    const experience = useQuery({
        queryKey: ['experience'],
        queryFn: async () => {
            const userId = await localStorage.getItem('userId');
            try {
                const response = await http.getWithAutoRefreshToken('/api/profile/experience/getAll', { useAccessToken: true })
                return response
            } catch (error) {

            }
        }
    })

    const addNewExpMutation = useMutation({
        mutationFn: async (values: any) => {
            values.start = values.start.toISOString();
            if (values.end !== undefined) {
                values.end = values.end.toISOString();
            }
            const name = values.firms + '*/' + values.jobs + '*/' + values.start + '*/' + (values.isStillDo == true ? 'Hiện tại' : values.end)
            const data = await http.postWithAutoRefreshToken('/api/profile/experience/add', {name: name}, { useAccessToken: true })
            return data
        },
        onSuccess: (data, variables, context) => {
            message.success('Thêm kinh nghiệm thành công!')
            queryClient.invalidateQueries({ queryKey: ['experience'] })
        },
        onError: (error: any) => {
            message.error(error.response.data)
        }
    })

    const deleteExpMutation = useMutation({
        mutationFn: async (id: any) => {
            const response = await http.deleteWithAutoRefreshToken('/api/profile/experience/' + id, { useAccessToken: true })
            return response
        },
        onSuccess: (data, variables, context) => {
            message.success('Xóa kinh nghiệm thành công!')
            queryClient.invalidateQueries({ queryKey: ['experience']})
        },
        onError: (error: any) => {
            message.error(error.response.data)
        }
    })

    const editExpMutation = useMutation({
        mutationFn: async ({ id, values }: any) => {
            values.start = values.start.toISOString();
            if (values.end !== null && values.end !== null) {
                values.end = values.end.toISOString();
            }
            const name = values.firms + '*/' + values.jobs + '*/' + values.start + '*/' + (values.isStillDo == true ? 'Hiện tại' : values.end)
            const response = await http.putWithAutoRefreshToken('/api/profile/experience/' + id, {name: name}, { useAccessToken: true })
            return response
        },
        onSuccess: (data, variables, context) => {
            message.success('Cập nhật kinh nghiệm thành công!')
            queryClient.invalidateQueries({ queryKey: ['experience']})
        },
        onError: (error: any) => {
            message.error(error.response.data)
        }
    })

    // const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    //     // Can not select days before today and today
    //     return current && current < dayjs().endOf('day');
    //   };
    const disabledDate = (current: any) => {
        // Can not select days before today and today
        return current && current > moment().endOf('month');
      };

    const showModalAddExp = () => {
        setDisabledCheckboxExp(false)
        setModalAddExpOpen(true);
    }
    const cancelModalAddExp = () => {
        setModalAddExpOpen(false);
    }
    const onChangeCheckBoxExp = (checked: any) => {
        setDisabledCheckboxExp(checked)
    }
    const finishAddExp = (values: any) => {
        setModalAddExpOpen(false);
        addNewExpMutation.mutate(values);
    }

    const cancelModalConfirmDelete = () => {
        setDeleteExp(null)
        setModalConfirmDeleteExpOpen(false);
    }

    const handleDeleteExp = (idExp: any) => {
        setDeleteExp(idExp)
        setModalConfirmDeleteExpOpen(true);
    }
    const finishDeleteExp = () => {
        deleteExpMutation.mutate(deleteExp);
        cancelModalConfirmDelete();
    }
    const cancelModalEditExp = () => {
        setModalEditExpOpen(false);
    }

    const handleEditExp = (infoExp: any) => {
        if (infoExp.name.split('*/')[3] == 'Hiện tại'){
            setDisabledCheckboxExp(true)
        }
        else {
            setDisabledCheckboxExp(false)
        }
        setEditExp(infoExp);
        setModalEditExpOpen(true);
    }

    const finishEditExp = (values: any) => {
        let id = editExp.id
        editExpMutation.mutate({id, values});
        cancelModalEditExp();
    }
    return(
        <>
            <div>
                <div>
                    <Modal title="Thêm kinh nghiệm"
                        open={isModalAddExpOpen}
                        onCancel={cancelModalAddExp}
                        footer={null}
                    >
                        <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            initialValues={{ isStillDo: false }}
                            onFinish={finishAddExp}
                        >
                            <Form.Item
                                label="Công ty"
                                name="firms"
                                rules={[{ required: true, message: 'Vui lòng nhập tên Công ty của bạn!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="chức danh"
                                name="jobs"
                                rules={[{ required: true, message: 'Vui lòng nhập tên chức danh của bạn!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="isStillDo"
                                valuePropName='checked'
                                wrapperCol={{ offset: 8, span: 16 }}
                            >
                                <Checkbox onChange={(e: any) => {onChangeCheckBoxExp(e.target.checked)}} >Đang làm việc</Checkbox>
                            </Form.Item>
                            <Form.Item
                                label="Từ"
                                name="start"
                                rules={[{ required: true, message: 'Vui lòng chọn mốc thời gian'}]}
                            >
                                <DatePicker picker="month" disabledDate={disabledDate}/>
                            </Form.Item>
                            <Form.Item
                                label="Đến"
                                name="end"
                                rules={[{ required: !disabledCheckboxExp, message: 'Vui lòng chọn mốc thời gian'}]}
                            >
                                <DatePicker picker="month" disabled={disabledCheckboxExp} disabledDate={disabledDate}/>
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit" className='bg-blue-600'>
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
                <div>
                    <Modal title="Chú ý" 
                        open={isModalConfirmDeleteExpOpen}
                        onCancel={cancelModalConfirmDelete}
                        footer={[
                            <Button onClick={finishDeleteExp} type="primary" htmlType="submit" className='bg-red-600'>Xóa</Button>
                        ]}
                    >
                        <p>Bạn chắc chắn xóa ?</p>
                    </Modal>
                </div>
                <div>
                    {isModalEditExpOpen ? 
                    (<Modal
                        title="Sửa"
                        open={isModalEditExpOpen}
                        onCancel={cancelModalEditExp}
                        footer={null}
                    >
                        <Form
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            onFinish={(values :any) => finishEditExp(values)}
                        >
                            <Form.Item
                                label="Công ty"
                                name="firms"
                                initialValue={editExp?.name?.split('*/')[0]}
                                rules={[{ required: true, message: 'Vui lòng nhập tên Công ty của bạn!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="chức danh"
                                name="jobs"
                                initialValue={editExp?.name?.split('*/')[1]}
                                rules={[{ required: true, message: 'Vui lòng nhập tên chức danh của bạn!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="isStillDo"
                                valuePropName='checked'
                                initialValue={editExp?.name?.split('*/')[3] == 'Hiện tại' ? true : false}
                                wrapperCol={{ offset: 8, span: 16 }}
                            >
                                <Checkbox onChange={(e: any) => onChangeCheckBoxExp(e.target.checked)} >Đang làm việc</Checkbox>
                            </Form.Item>
                            <Form.Item
                                label="Từ"
                                name="start"
                                initialValue={dayjs(moment(editExp?.name?.split('*/')[2]).format('MM/YYYY'), 'MM/YYYY')}
                                rules={[{ required: true, message: 'Vui lòng chọn mốc thời gian'}]}
                            >
                                <DatePicker picker="month" disabledDate={disabledDate}/>
                            </Form.Item>
                            <Form.Item
                                label="Đến"
                                name="end"
                                initialValue={dayjs(moment(editExp.name.split('*/')[3] != 'Hiện tại' ? editExp.name.split('*/')[3] : undefined).format('MM/YYYY'), 'MM/YYYY')}
                                rules={[{ required: !disabledCheckboxExp, message: 'Vui lòng chọn mốc thời gian'}]}
                            >
                                <DatePicker picker="month" disabled={disabledCheckboxExp} disabledDate={disabledDate}/>
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit" className='bg-blue-600'>
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>) : ''}
                </div>
                <div>
                    <Card
                        title={
                            <>
                                <p className='font-bold text-3xl'>Kinh nghiệm</p>
                            </>
                        }
                        extra={
                            <>
                                <div className='mb-4 mt-2'>
                                    <a onClick={() => showModalAddExp()}><PlusCircleOutlined className='mr-4 text-2xl' style={{ color: 'red' }} /></a>
                                </div>
                            </>
                        }
                        className='w-full mb-4 border-black'
                        style={{ border: '2px solid darkred' }}
                    >
                        {experience?.data?.map((info: any) => {
                            return (
                                <Card
                                    key={info.id}
                                    title={
                                        <>
                                            <p className='font-bold text-xl'>{info.name.split('*/')[0]}</p>
                                        </>
                                    }
                                    extra={
                                        <>
                                            <a onClick={() => handleEditExp(info)}><EditOutlined className='mr-8' style={{ color: 'blue' }} /></a>
                                            <a onClick={() => handleDeleteExp(info.id)}><DeleteOutlined className='' /></a>
                                        </>
                                    }
                                >
                                    <p className='my-3 text-base'>{info.name.split('*/')[1]}</p>
                                    <p className='my-3 text-base'>{moment(info.name.split('*/')[2]).format('MM/YYYY') + ' - ' + (info.name.split('*/')[3] == 'Hiện tại' ? 'Hiện tại' : moment(info.name.split('*/')[3]).format('MM/YYYY')) }</p>
                                </Card>
                            )
                        })}
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Experience