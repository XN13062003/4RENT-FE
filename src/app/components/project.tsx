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
const { RangePicker } = DatePicker;



const Project = () => {
    const [isModalAddPrjOpen,setModalAddPrjOpen] = useState(false)
    const [isModalEditPrjOpen, setModalEditPrjOpen] = useState(false)
    const [isModalConfirmDeletePrjOpen, setModalConfirmDeletePrjOpen] = useState(false)
    const [disabledCheckboxPrj, setDisabledCheckboxPrj] = useState(false)
    const [deletePrj, setDeletePrj] = useState(null)
    const [editPrj, setEditPrj] = useState<any>({})

    const queryClient = useQueryClient()
    const project = useQuery({
        queryKey: ['project'],
        queryFn: async () => {
            try {
                const response = await http.getWithAutoRefreshToken('/api/profile/project/getAll', { useAccessToken: true })
                return response
            } catch (error) {

            }
        }
    })

    const addNewPrjMutation = useMutation({
        mutationFn: async (values: any) => {
            values.start = values.start.toISOString();
            if (values.end !== undefined && values.end !== null) {
                values.end = values.end.toISOString();
            }
            const name = values.nameProject + '*/' + values.start + '*/' + (values.isStillDo == true ? 'Hiện tại' : values.end)
            const data = await http.postWithAutoRefreshToken('/api/profile/project/add', {name: name}, { useAccessToken: true })
            return data
        },
        onSuccess: (data, variables, context) => {
            message.success('Thêm dự án thành công!')
            queryClient.invalidateQueries({ queryKey: ['project'] })
        },
        onError: (error: any) => {
            message.error(error.response.data)
        }
    })

    const deletePrjMutation = useMutation({
        mutationFn: async (id: any) => {
            const response = await http.deleteWithAutoRefreshToken('/api/profile/project/' + id, { useAccessToken: true })
            return response
        },
        onSuccess: (data, variables, context) => {
            message.success('Xóa dự án thành công!')
            queryClient.invalidateQueries({ queryKey: ['project']})
        },
        onError: (error: any) => {
            message.error(error.response.data)
        }
    })

    const editPrjMutation = useMutation({
        mutationFn: async ({ id, values }: any) => {
            values.start = values.start.toISOString();
            if (values.end !== null) {
                values.end = values.end.toISOString();
            }
            const name = values.nameProject + '*/' + values.start + '*/' + (values.isStillDo == true ? 'Hiện tại' : values.end)
            const response = await http.putWithAutoRefreshToken('/api/profile/project/' + id, {name: name}, { useAccessToken: true })
            return response
        },
        onSuccess: (data, variables, context) => {
            message.success('Cập nhật dự án thành công!')
            queryClient.invalidateQueries({ queryKey: ['project']})
        },
        onError: (error: any) => {
            message.error(error.response.data)
        }
    })

    const disabledDate = (current: any) => {
        // Can not select days before today and today
        return current && current > moment().endOf('month');
      };
    
    const showModalAddPrj = () => {
        setDisabledCheckboxPrj(false)
        setModalAddPrjOpen(true);
    }
    const cancelModalAddPrj = () => {
        setModalAddPrjOpen(false);
    }
    const onChangeCheckBoxPrj = (checked: any) => {
        setDisabledCheckboxPrj(checked)
    }
    const finishAddPrj = (values: any) => {
        setModalAddPrjOpen(false);
        addNewPrjMutation.mutate(values);
    }

    const cancelModalConfirmDelete = () => {
        setDeletePrj(null)
        setModalConfirmDeletePrjOpen(false);
    }

    const handleDeletePrj = (idPrj: any) => {
        setDeletePrj(idPrj)
        setModalConfirmDeletePrjOpen(true);
    }
    const finishDeletePrj = () => {
        deletePrjMutation.mutate(deletePrj);
        cancelModalConfirmDelete();
    }
    const cancelModalEditPrj = () => {
        setModalEditPrjOpen(false);
    }

    const handleEditPrj = (infoPrj: any) => {
        if (infoPrj.name.split('*/')[2] == 'Hiện tại'){
            setDisabledCheckboxPrj(true);
        }
        else {
            setDisabledCheckboxPrj(false);
        }
        setEditPrj(infoPrj);
        setModalEditPrjOpen(true);
    }

    const finishEditPrj = (values: any) => {
        let id = editPrj.id
        editPrjMutation.mutate({id, values});
        cancelModalEditPrj();
    }
    return(
        <>
            <div>
                <div>
                    <Modal title="Thêm dự án"
                        open={isModalAddPrjOpen}
                        onCancel={cancelModalAddPrj}
                        footer={null}
                    >
                        <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            initialValues={{ isStillDo: false }}
                            onFinish={finishAddPrj}
                        >
                            <Form.Item
                                label="Tên dự án"
                                name="nameProject"
                                rules={[{ required: true, message: 'Vui lòng nhập tên dự án của bạn!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="isStillDo"
                                valuePropName='checked'
                                wrapperCol={{ offset: 8, span: 16 }}
                            >
                                <Checkbox onChange={(e: any) => {onChangeCheckBoxPrj(e.target.checked)}} >Đang làm</Checkbox>
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
                                rules={[{ required: !disabledCheckboxPrj, message: 'Vui lòng chọn mốc thời gian'}]}
                            >
                                <DatePicker picker="month" disabled={disabledCheckboxPrj} disabledDate={disabledDate}/>
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
                        open={isModalConfirmDeletePrjOpen}
                        onCancel={cancelModalConfirmDelete}
                        footer={[
                            <Button onClick={finishDeletePrj} type="primary" htmlType="submit" className='bg-red-600'>Xóa</Button>
                        ]}
                    >
                        <p>Bạn chắc chắn xóa ?</p>
                    </Modal>
                </div>
                <div>
                    {isModalEditPrjOpen ? 
                    (<Modal
                        title="Sửa"
                        open={isModalEditPrjOpen}
                        onCancel={cancelModalEditPrj}
                        footer={null}
                    >
                        <Form
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            onFinish={(values :any) => finishEditPrj(values)}
                        >
                            <Form.Item
                                label="Tên dự án"
                                name="nameProject"
                                initialValue={editPrj?.name?.split('*/')[0]}
                                rules={[{ required: true, message: 'Vui lòng nhập tên dự án của bạn!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="isStillDo"
                                valuePropName='checked'
                                initialValue={editPrj?.name?.split('*/')[2] == 'Hiện tại' ? true : false}
                                wrapperCol={{ offset: 8, span: 16 }}
                            >
                                <Checkbox onChange={(e: any) => onChangeCheckBoxPrj(e.target.checked)} >Đang làm</Checkbox>
                            </Form.Item>
                            <Form.Item
                                label="Từ"
                                name="start"
                                initialValue={dayjs(moment(editPrj?.name?.split('*/')[1]).format('MM/YYYY'), 'MM/YYYY')}
                                rules={[{ required: true, message: 'Vui lòng chọn mốc thời gian'}]}
                            >
                                <DatePicker picker="month" disabledDate={disabledDate}/>
                            </Form.Item>
                            <Form.Item
                                label="Đến"
                                name="end"
                                initialValue={dayjs(moment(editPrj.name.split('*/')[2] != 'Hiện tại' ? editPrj.name.split('*/')[3] : undefined).format('MM/YYYY'), 'MM/YYYY')}
                                rules={[{ required: !disabledCheckboxPrj, message: 'Vui lòng chọn mốc thời gian'}]}
                            >
                                <DatePicker picker="month" disabled={disabledCheckboxPrj} disabledDate={disabledDate}/>
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
                                <p className='font-bold text-3xl'>Dự án</p>
                            </>
                        }
                        extra={
                            <>
                                <div className='mb-4 mt-2'>
                                    <a onClick={() => showModalAddPrj()}><PlusCircleOutlined className='mr-4 text-2xl' style={{ color: 'red' }} /></a>
                                </div>
                            </>
                        }
                    style={{ border: '2px solid darkred' }}
                    className='w-full mb-4 border-black'
                    >
                        {project?.data?.map((info: any) => {
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
                                            <a onClick={() => handleEditPrj(info)}><EditOutlined className='mr-8' style={{ color: 'blue' }} /></a>
                                            <a onClick={() => handleDeletePrj(info.id)}><DeleteOutlined className='' /></a>
                                        </>
                                    }
                                >
                                    <p className='my-3 text-base'>{moment(info.name.split('*/')[1]).format('MM/YYYY') + ' - ' + (info.name.split('*/')[2] == 'Hiện tại' ? 'Hiện tại' : moment(info.name.split('*/')[3]).format('MM/YYYY')) }</p>
                                </Card>
                            )
                        })}
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Project