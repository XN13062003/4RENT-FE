'use client'
import React, { useState, useEffect  } from 'react';
import Education from '../components/education'
import Project from '../components/project';
import Certification from '../components/certification';
import UserInfor from '../components/userInfor'
import SkillProfile from '../components/skillProfile';
import ManageCV from '../components/manageCV';
import Experience from '../components/experience';
import CriterionJob from '../components/criterionJob'
import { Descriptions, Empty } from 'antd';
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
const { TextArea } = Input;
const { Option } = Select;
import { useRouter } from 'next/navigation'
import axios from 'axios';


const candidateProfile = () => {
    const [showContent, setShowContent] = useState(false);
    const router = useRouter();
    const isBrowser = typeof window !== 'undefined';
    let refreshToken: any;
    let role: any;
    if (isBrowser) {
        refreshToken = localStorage.getItem('refreshToken');
        role = localStorage.getItem('role');
        if (role != 2){
            router.push("/login");
       }
    }
    const handleMakeCV = async () => {
        // const fileCV = await http.getWithAutoRefreshToken('/api/profile/makeCV', { useAccessToken: true })
        const fileCV = await axios.get('http://localhost:6868/api/profile/makeCV', {
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`
            },
        });
        const blob = new Blob([fileCV.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }
    const profile1 = () => {
        return(
            <>
                <div className='mx-[300px]'>
                    <UserInfor></UserInfor>
                    <br></br>
                    <Education></Education>
                    <br></br>
                    <Experience></Experience>
                    <br></br>
                    <SkillProfile></SkillProfile>
                    <br></br>
                    <Project></Project>
                    <br></br>
                    <Certification></Certification>
                    <Button type="primary" className='bg-blue-600 mb-10' onClick={handleMakeCV}>Xem CV tạo từ hồ sơ</Button>
                </div >
            </>
        )
    }

    const manageCv = () => {
        return(
            <>
                <div className='mx-[300px]'>
                    <ManageCV></ManageCV>
                </div>
            </>
        )
    }

    const jobPreferences = () => {
        return(
            <>
                <div className='mx-[300px]'>
                    <CriterionJob></CriterionJob>
                </div>
            </>
        )
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);
    
    if (!showContent) {
        return(     
            <div className="text-center h-screen">
                <h1 className="text-3xl text-gray-800 font-semibold">
                    Loading...
                </h1>
            </div>
        )
    }
    
    return (
        <>
            <Tabs
                defaultActiveKey='1'
                size='large'
                tabBarStyle={{
                    marginRight: 50,
                    marginLeft: 50,
                }}
                tabBarGutter={50}
                items = {[
                    {
                        label: 'Profile',
                        key: '1',
                        children: profile1(),
                    },
                    {
                        label: 'Manage CVs',
                        key: '2',
                        children: manageCv()
                    },
                    {
                        label: 'Job Preferences',
                        key: '3',
                        children: jobPreferences()
                    },
                ]}
            />
        </>
    )
}

export default candidateProfile