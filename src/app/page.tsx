'use client'
import Image from 'next/image'
import { Empty, Button, Card, Pagination, Select, Avatar } from "antd";
import { SearchOutlined } from '@ant-design/icons'
import { AreaChartOutlined, FireOutlined, CheckOutlined, ReadOutlined, FormOutlined, TagOutlined, UserOutlined, HomeOutlined, MoneyCollectOutlined, FieldTimeOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
} from 'antd';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import moment from 'moment'
import { useGetListProvinces } from "../service/provinces.service";
import {
  useGetListRecruitmentPost,
  useSearchRecruitmentPost,
} from "../service/recruitmentPost.service";
import { useGetListSkills } from "../service/skill.service";
import { IRecruitmentPost } from "../@types/recruitmentPost.type";

import http from "@/app/utils/http";
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  const [key, setKey] = useState("");
  const { data: provincesData, refetch } = useGetListProvinces();
  // const { data: recruitmentPostData } = useGetListRecruitmentPost();
  const [params, setParams] = useState<any>({})
  const [page, setPage] = useState(1)

  const { data: skillsData } = useGetListSkills();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const keyValue = params.get("key");
    setKey(keyValue || "");
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts-not-expired', { params: params }],
    queryFn: async () => {
      const data = await http.get('/api/recruitmentPosts/posts-not-expired', { params })
      return data
    }
  })

  const onFinish = (values: any) => {

    setParams(values)
  }

  const handlePageChange = (page: number, pageSize: number) => {
    console.log(page)
    const newParams = params
    if (newParams) {
      newParams._page = page
      setParams(newParams)
      setPage(page)
    } else {
      setParams({
        _page: page
      })
      setPage(page)
    }
  }

  return (
    <div className="min-h-[100vh]">
      <div className="search text-white pt-16 mt-[88px]">
        <div className="mx-40">
          <h2 className='text-3xl pb-8 font-bold'> Việc làm IT cho Developer &quot;Chất&quot;</h2>
          <div className="flex justify-center">
            <Form
              layout="inline"
              style={{}}
              className='w-800px'
              onFinish={onFinish}
            >
              <Form.Item name='location'>
                <Select
                  allowClear
                  style={{ height: '48px', width: '200px' }}
                  placeholder="Tất cả thành phố"
                  options={provincesData?.data?.map(province => {
                    return {
                      value: province.name,
                      label: province.name
                    }
                  })}
                >
                </Select>
              </Form.Item>
              <Form.Item name='level'>
                <Select
                  allowClear
                  style={{ height: '48px', width: '100px' }}
                  placeholder="Trình độ"
                >
                  <Select.Option value="Intern">Intern</Select.Option>
                  <Select.Option value="Fresher">Fresher</Select.Option>
                  <Select.Option value="Junior">Junior</Select.Option>
                  <Select.Option value="Senior">Senior</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name='skill'>
                <Select
                  allowClear
                  style={{ height: '48px', width: '100px' }}
                  placeholder="Kỹ năng"
                  options={
                    skillsData?.map((skill: any) => ({
                      label: skill.name,
                      value: skill.id,
                    }))
                  }
                >
                </Select>
              </Form.Item>
              <Form.Item name='salary'>
                <Select
                  allowClear
                  style={{ height: '48px', width: '250px' }}
                  placeholder="Mức lương"
                >
                  <Select.Option value="2.000.000 đ - 5.000.000 đ">2.000.000 đ - 5.000.000 đ</Select.Option>
                  <Select.Option value="5.000.000 đ - 10.000.000 đ">5.000.000 đ - 10.000.000 đ</Select.Option>
                  <Select.Option value="10.000.000 đ - 15.000.000 đ">10.000.000 đ - 15.000.000 đ</Select.Option>
                  <Select.Option value="15.000.000 đ - 25.000.000 đ">15.000.000 đ - 25.000.000 đ</Select.Option>
                  <Select.Option value="25.000.000 đ - 50.000.000 đ">25.000.000 đ - 50.000.000 đ</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name='form'>
                <Select
                  allowClear
                  style={{ height: '48px', width: '100%' }}
                  placeholder="Hình thức"
                >
                  <Select.Option value="Onsite"> Onsite </Select.Option>
                  <Select.Option value="Hybrid"> Hybrid </Select.Option>
                  <Select.Option value="Remote"> Remote </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button htmlType='submit' className='bg-[#ed1b2f] text-white items-center inline-flex border-none justify-center w-[100px] h-12 rounded-sm font-semibold text-lg'>
                  <SearchOutlined className='p-2' />
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className='mt-8 flex items-center pb-16'>
            <p className='text-white mr-4'>Mọi người đang tìm kiếm:</p>
            <div className='inline-flex'>
              <button className='bg-transparent rounded-full border border-gray-600 px-4 py-2 hover:bg-slate-600 mx-2'>Java</button>
              <button className='bg-transparent rounded-full border border-gray-600 px-4 py-2 hover:bg-slate-600 mx-2'>ReactJS</button>
              <button className='bg-transparent rounded-full border border-gray-600 px-4 py-2 hover:bg-slate-600 mx-2'>.NET</button>
              <button className='bg-transparent rounded-full border border-gray-600 px-4 py-2 hover:bg-slate-600 mx-2'>Tester</button>
              <button className='bg-transparent rounded-full border border-gray-600 px-4 py-2 hover:bg-slate-600 mx-2'>PHP</button>
              <button className='bg-transparent rounded-full border border-gray-600 px-4 py-2 hover:bg-slate-600 mx-2'>Business Analytic</button>
              <button className='bg-transparent rounded-full border border-gray-600 px-4 py-2 hover:bg-slate-600 mx-2'>NodeJS</button>
            </div>
          </div>
        </div>
      </div>
      {data ?
        (
          <>
            {data?.data?.count < 1 ? (
              <div className='mx-[300px] my-[80px]'>
                <div className='text-center text-black'>Oops... Không có công việc phù hợp với yêu cầu của bạn.</div>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            ) :
              (<div className='grid grid-cols-3 gap-4 mx-4 mt-4'>
                {data?.data?.posts?.map((post: any, index: number) => {
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
                          <Link href={`/post/${post.id}`}>Ứng tuyển</Link>
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
              </div>)}
            <div className='flex justify-center mb-4'>
              <Pagination
                // defaultCurrent={1}
                total={data?.data?.count}
                pageSize={6}
                current={page}
                onChange={(page, pageSize) => handlePageChange(page, pageSize)}
              />
            </div>
          </>
        )
        : ('Loading...')}
    </div>
  );
}

