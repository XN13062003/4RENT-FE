'use client'
import { UserOutlined, DownOutlined } from '@ant-design/icons'
import { MenuProps, message, } from 'antd';
import { Menu, Button, Popover } from 'antd';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import http from '../utils/http';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { useGetListBusiness } from "../../service/business.service";
import { useGetListProvinces } from "../../service/provinces.service";
// import { useGetListRecruitmentPost } from "../../service/recruitmentPost.service";
import { useGetListSkills } from "../../service/skill.service";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const Header = () => {
  const [user, setUser] = useState<any>(null)
  const router = useRouter();

  const { data: provincesData } = useGetListProvinces();
  const { data: skillsData } = useGetListSkills();
  // const { data: levelData } = useGetListRecruitmentPost();
  const { data: businessData } = useGetListBusiness();

  const employerItems: MenuProps['items'] = [
    {
      label: 'All Jobs',
      key: 'All Job',
      children: [
        {
          label: "Việc làm IT theo kĩ năng",
          key: "job by skills",
          children: skillsData?.map((skill: any) => ({
            label: skill.name,
            key: skill.name,
          }))
        },
        {
          label: "Việc làm IT theo cấp bậc",
          key: "job by Title",
          // children: levelData?.filter((item: any) => item.level)?.map((role: any) => ({
          //   label: role.level,
          //   key: role.level,
          // }))
        },
        {
          label: "Việc làm IT theo công ty",
          key: "job by company",
          children: businessData?.map((role: any) => ({
            label: role.businessName,
            key: role.businessName,
          }))
        },
        {
          label: "Việc làm IT theo thành phố",
          key: "job by cities",
          children: provincesData?.data.map((item) => ({
            label: item.name,
            key: item.name,
          })),
        },
      ],
    },
    {
      label: 'Top Công ty IT',
      key: 'app',
      children: [
        {
          label: 'Công ty tốt nhất',
          key: 'best companies',
          children: [
            {
              label: 'Công ty 1',
              key: 'company 1'
            },
            {
              label: 'Công ty 2',
              key: 'company 2'
            }
          ]
        },
        {
          label: 'Review công ty',
          key: 'review'
        }
      ]
    },
    {
      label: "Đơn ứng tuyển",
      key: `application`,
      children: [
        {
          label: (
            <div onClick={() => router.push('/pendingApplications')}>
              Đang chờ
            </div>
          ),
          key: "application:1"
        },
        {
          label: (
            <div onClick={() => router.push('/acceptedApplications')}>
              Đã duyệt
            </div>
          ),
          key: "application:2"
        }
      ]
    }
  ];

  const employeeItems: MenuProps['items'] = [
    {
      label: 'All Jobs',
      key: 'All Job',
      children: [
        {
          label: "Việc làm IT theo kĩ năng",
          key: "job by skills",
          children: skillsData?.map((skill: any) => ({
            label: skill.name,
            key: skill.name,
          }))
        },
        {
          label: "Việc làm IT theo cấp bậc",
          key: "job by Title",
          // children: levelData?.filter((item: any) => item.level)?.map((role: any) => ({
          //   label: role.level,
          //   key: role.level,
          // }))
        },
        {
          label: "Việc làm IT theo công ty",
          key: "job by company",
          children: businessData?.map((role: any) => ({
            label: role.businessName,
            key: role.businessName,
          }))
        },
        {
          label: "Việc làm IT theo thành phố",
          key: "job by cities",
          children: provincesData?.data.map((item) => ({
            label: item.name,
            key: item.name,
          })),
        },
      ],
    },
    {
      label: 'Top Công ty IT',
      key: 'app',
      children: [
        {
          label: 'Công ty tốt nhất',
          key: 'best companies',
          children: [
            {
              label: 'Công ty 1',
              key: 'company 1'
            },
            {
              label: 'Công ty 2',
              key: 'company 2'
            }
          ]
        },
        {
          label: 'Review công ty',
          key: 'review'
        }
      ]
    },
  ];

  const verifyLogin = useQuery({
    queryKey: ['verify'],
    queryFn: async () => {
      try {
        const user = await http.getWithAutoRefreshToken('http://localhost:6868/api/users/me', { useAccessToken: true })
        setUser(user)
        return user
      } catch (error) {
        //@ts-ignore
        if (error.response && error.response.status === 403) {
          message.error('Tài khoản đã bị khoá')
          localStorage.clear()
          sessionStorage.clear()
          router.push('/login')
          return
        }
        console.log(error)
        return
      }
    }

  })

  const handleLogout = async () => {
    try {
      await http.getWithAutoRefreshToken('/api/auth/logout', { useAccessToken: true })
      sessionStorage.clear()
      localStorage.clear()
      setUser(null)
      message.success('Đăng xuất thành công')
      router.push('/')
    } catch (error) {
      sessionStorage.clear()
      localStorage.clear()
      message.success('Đăng xuất thành công')
      router.push('/')
    }
  }

  const employerContent = (
    <div className='min-w-14 cursor-pointer'>
      <div className='py-2 ' onClick={() => router.push('/post')}>
        Tuyển dụng
      </div>
      <div className='py-2'>
        <button className='text-black' onClick={handleLogout} style={{ color: 'black' }}>
          Đăng xuất
        </button>

      </div>
    </div>
  )

  const employeeContent = (
    <div className='min-w-14 cursor-pointer'>
      <div className='py-2' onClick={() => router.push('/candidateProfile')}>
        Hồ sơ
      </div>
      <div className='py-2' onClick={() => router.push('/manageApplication')}>
        Việc làm của tôi
      </div>
      <div className='py-2'>
        <button className='text-black' onClick={handleLogout} style={{ color: 'black' }}>
          Đăng xuất
        </button>
      </div>
    </div>
  )

  const handleLoginClick = () => {
    router.push('/login');
  };
  const handleRegisterClick = () => {
    router.push('/signup');
  };

  return (
    <div className="header min-h-[88px] border-b border-b-gray-800 fixed z-10 top-0 left-0 right-0">
      <div className="container min-h-[88px] mx-auto flex items-center">
        <div onClick={() => router.push('/')} className='cursor-pointer'>
          <p className="text-white text-3xl font-bold">Hust<span className="text-[#f0101a]">CV</span></p>

        </div>
        <div className='ml-48 flex-1'>
          <div className='flex items-center gap-6 '>
            {user?.role_id === 1 ?
              (
                <Menu className='bg-transparent min-w-[400px] text-xl text-[#a6a6a6]' mode="horizontal" selectedKeys={[]} items={employerItems} /*onClick={onNavigate}*/ />
              ) :
              (
                <Menu className='bg-transparent min-w-[400px] text-xl text-[#a6a6a6]' mode="horizontal" selectedKeys={[]} items={employeeItems} /*onClick={onNavigate}*/ />
              )}
          </div>
        </div>
        {user ? (
          <Popover content={user.role_id === 2 ? employeeContent : employerContent} style={{ width: 100 }} trigger="click" placement="bottom">
            <div className='pr-28 cursor-pointer text-[#a6a6a6] hover:text-white' ><UserOutlined className='mr-4' />{user.username}<DownOutlined className='ml-4 opacity-70' /></div>
          </Popover>
        ) : (
          <div className='pr-14'>
            <button className='text-[#a6a6a6] hover:text-white' onClick={handleLoginClick}>
              Đăng nhập
            </button>
            <span className='text-[#a6a6a6] mx-2'>/</span>
            <button className='text-[#a6a6a6] hover:text-white' onClick={handleRegisterClick}>
              Đăng ký
            </button>
          </div>
        )}
      </div>
    </div>)
}

export default Header