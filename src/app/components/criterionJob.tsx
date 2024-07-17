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
    Tabs,
    TabsProps,
    Space 
} from 'antd';
import { MoreOutlined, CheckOutlined, FireOutlined, ReadOutlined, FormOutlined, TagOutlined, EditOutlined, DeleteOutlined, UserOutlined, HomeOutlined, MoneyCollectOutlined, FieldTimeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { SelectProps, DatePickerProps } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import http from '../utils/http';
import SizeContext from 'antd/es/config-provider/SizeContext';
import { useGetListProvinces } from '@/service/provinces.service';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;


const CriterionJob = () => {
    const queryClient = useQueryClient()
    const { data: provincesData } = useGetListProvinces();

    const skillsResponse = useQuery({
        queryKey: ['skills'],
        queryFn: async () => {
            try {
                const response = await http.getWithAutoRefreshToken('/api/skills/getAllSkills', { useAccessToken: true })
                return response
            } catch (error) {
                console.log(error)
            }
        }
    })

    const options: SelectProps['options'] = [];

    skillsResponse?.data?.map((skill: any) => {
        options.push({
            label: skill.name,
            value: skill.id,
        })
    })

    const criterionJob = useQuery({
        queryKey: ['criterionJob'],
        queryFn: async () => {
            try {
                const response = await http.getWithAutoRefreshToken('/api/jobPreference/getAll', { useAccessToken: true })
                
                return response
            } catch (error) {

            }
        }
    })

    const editJobMutation = useMutation({
        mutationFn: async (values: any) => {

            const response = await http.postWithAutoRefreshToken('/api/jobPreference/add', values, { useAccessToken: true })
            return response
        },
        onSuccess: (data, variables, context) => {
            message.success('Cập nhật tiêu chí tìm việc thành công!')
            queryClient.invalidateQueries({ queryKey: ['criterionJob']})
        },
        onError: (error: any) => {
            message.error(error.response.data)
        }
    })

    const finishEditJob = (values: any) => {
        editJobMutation.mutate(values);
    }
    return(
        <>
            <div className="border border-solid border-gray-500 p-4 mb-5">
                {criterionJob?.data ? (
                    <Form
                        layout='vertical'
                        // labelCol={{ span: 8 }}
                        // wrapperCol={{ span: 16 }}
                        size='large'
                        style={{ maxWidth: 1000 }}
                        onFinish={(values :any) => finishEditJob(values)}
                    >
                        <Form.Item
                            label={<span style={{fontWeight: 'bold', fontSize: 25}}>Kỹ năng</span>}
                            name="skill"
                            initialValue={criterionJob?.data?.skills.map((skill: any) => {return { label: skill.name, value: skill.id}})}
                            rules={[{ required: true, message: 'Vui lòng nhập kỹ năng của bạn!' }]}
                        >
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Kỹ năng"
                            options={options}
                        />
                        </Form.Item>
                        <Form.Item 
                            label={<span style={{fontWeight: 'bold', fontSize: 25}}>Cấp độ công việc</span>}
                            name="jobLevel"
                            wrapperCol={{ offset: 1 }}
                            initialValue={criterionJob?.data?.jobLevel}
                            rules={[{ required: true, message: 'Vui lòng nhập cấp độ công việc của bạn' }]}
                        >
                            <Radio.Group>
                                <Space direction='vertical'>
                                    <Radio value="Intern">Intern</Radio>
                                    <Radio value="Fresher">Fresher</Radio>
                                    <Radio value="Junior">Junior</Radio>
                                    <Radio value="Senior">Senior</Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                        label={<span style={{fontWeight: 'bold', fontSize: 25}}>Mức lương</span>}
                            name='salary'
                            initialValue={criterionJob?.data?.salary}
                            rules={[{ required: true, message: 'Vui lòng nhập mức lương bạn muốn' }]}
                        >
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
                        label={<span style={{fontWeight: 'bold', fontSize: 25}}>Địa chỉ</span>}
                            name='address'
                            initialValue={criterionJob?.data?.address}
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                        >
                            <Select
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="Địa chỉ"
                                options={provincesData?.data?.map(province => {
                                    return {
                                        value: province.name,
                                        label: province.name
                                    }
                                })}
                            >
                            </Select>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                            <Button type="primary" htmlType="submit" className='bg-blue-600'>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                ):''
                }
            </div>
        </>
    )
}

export default CriterionJob