"use client";
import {
  useApplyRecruitment,
  useGetDetailRecruitmentPost,
} from "../../../service/recruitmentPost.service";
import { useMutation } from "@tanstack/react-query";
import { Badge, Button, Form, message, Space, UploadProps, Checkbox, Radio } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { UploadOutlined } from '@ant-design/icons';
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import http from "@/app/utils/http";
// import UploadFileInput from "../../components/UploadFileInput";
import { Upload } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import Login from "@/app/components/login";
import Signup from "@/app/components/signup";
import ForgetPassword from "@/app/components/forgetPassword";
const PostDetail = () => {
    const dummyRequest = ({file, onSuccess }: { file: any, onSuccess: (response: string) => void })=> {
        setTimeout(() => {
          onSuccess("ok");
        }, 0);
      };
  const [form] = useForm();
  const path = usePathname();
  const [idPost, setIdPost] = useState(Number(path.split("/")[2]));
  const [isUpload, setUpload] = useState(false)
  const { data: recruitmentPostData } = useGetDetailRecruitmentPost(
    idPost || NaN
  );
  const [isEmployee, setRole] = useState(0)
  const [value, setValue] = useState(0);
  const router = useRouter();
  const onChange = (e: any) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
    setUpload(e.target.value);
  };
  const getFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  useEffect(() => {
    setIdPost(Number(path.split("/")[2]));
    const role = localStorage.getItem("role");
    if (role){
      if (role == '2'){
        setRole(2);
      }
      else{
        setRole(1);
      }
    }
  }, [path]);
  async function handleApplication(value: any) {
    try{
      message.loading({content: "Đang gửi", duration: 0, key: 1});
      if (isUpload){
        console.log(value)
        const data = new FormData();
        data.append("fileCV", value.fileCV[0].originFileObj);
        const body = {
           recruitmentPost_id: Number(idPost) as number,
           content: value.content as string,
           CV: value.CV as string,
           fileCV: data.get("fileCV"),
        };
        console.log(body)
        await http.postWithAutoRefreshTokenMultipart("/api/application/upload", body, {useAccessToken: true});
        message.destroy(1);
        message.success("Đã gửi đơn")
      }
      else{
        const body = {
          recruitmentPost_id: idPost,
          content: value.content,
        }
        try{
          await http.postWithAutoRefreshToken("/api/application/available", body, {useAccessToken: true});
          message.destroy(1);
          message.success("Đã gửi đơn");
        }
        catch(e:any){
          if (e.response.status == 404){
            message.destroy(1);
            message.error("Người dùng chưa tạo đơn trên hệ thống")
          }
          else{
            throw e;
        }
      }
    }
  }
  catch(e){
    console.log(e)
    message.destroy(1);
    message.error("Lỗi hệ thống")
  }
}
  if (!recruitmentPostData) return <></>;
  if (isEmployee == 0 || isEmployee == 1){
    return (
      <>
      <div className="min-h-[100vh] !text-black">
        <div className="search pt-16 mt-[88px]"></div>
        <div className="mt-10 px-10 mx-auto w-full">
        <h1 className="text-6xl font-bold">{recruitmentPostData.title}</h1>
        <div className="mt-3 flex justify-between items-center gap-5">
          <h2>Vị trí: {recruitmentPostData.level}</h2>
          <h2>Thành phố/Tỉnh: {recruitmentPostData.location}</h2>
        </div>
        <div className="mt-3 w-full flex justify-between items-start gap-5 border-t border-t-slate-400">
          <p>Mức lương: {recruitmentPostData.salary}</p>
          <div className="flex justify-center items-center gap-2">
            <p>Kỹ năng:</p>
            <Space>
              {recruitmentPostData?.skills.map((skill: any) => (
                <Badge
                  className="site-badge-count-109"
                  count={skill.name}
                  style={{ backgroundColor: "#52c41a" }}
                  key={skill.id}
                />
              ))}
            </Space>
          </div>
        </div>
        <p className="mt-3 w-full">Mô tả: {recruitmentPostData.describe}</p>
        <p className="mt-3 w-full">Yêu cầu: {recruitmentPostData.request}</p>
        {isEmployee == 0 ? (<Button className="mt-3" onClick={e => router.push("/signin")}>Đăng nhập để ứng tuyển</Button>) : <></>}
        </div>
        </div>
      </>
    )
  }
  return (
    <>
    <div className="min-h-[100vh] !text-black">
      <div className="search pt-16 mt-[88px]"></div>
      <div className="mt-10 px-10 mx-auto w-full">
        <h1 className="text-6xl font-bold">{recruitmentPostData.title}</h1>
        <div className="mt-3 flex justify-between items-center gap-5">
          <h2>Vị trí: {recruitmentPostData.level}</h2>
          <h2>Thành phố/Tỉnh: {recruitmentPostData.location}</h2>
        </div>
        <div className="mt-3 w-full flex justify-between items-start gap-5 border-t border-t-slate-400">
          <p>Mức lương: {recruitmentPostData.salary}</p>
          <div className="flex justify-center items-center gap-2">
            <p>Kỹ năng:</p>
            <Space>
              {recruitmentPostData?.skills.map((skill: any) => (
                <Badge
                  className="site-badge-count-109"
                  count={skill.name}
                  style={{ backgroundColor: "#52c41a" }}
                  key={skill.id}
                />
              ))}
            </Space>
          </div>
        </div>
        <p className="mt-3 w-full">Mô tả: {recruitmentPostData.describe}</p>
        <p className="mt-3 w-full">Yêu cầu: {recruitmentPostData.request}</p>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={handleApplication}
          autoComplete="off"
          layout="horizontal"
          className="w-full mt-10"
        >
          <Form.Item
            label="Thư xin việc:"
            name="content"
            className="flex flex-col"
          >
            <TextArea rows={4} count={{max: 500, show: true}} placeholder="Tối đa 500 ký tự" required/>
          </Form.Item>
          {/* <Form.Item label="File CV:  " name="CV" className="flex flex-col">
            <UploadFileInput onChange={props.onChange}/>
          </Form.Item> */}
          <Form.Item label="Lựa chọn CV">
          <Radio.Group onChange={onChange} value={value}>
              <Radio value={0}>Dùng file CV có sẵn</Radio>
              <Radio value={1}>Tải lên CV mới (.pdf)</Radio>
          </Radio.Group>
          </Form.Item>
          {/* getValueFromEvent={getFile} */}
          {!isUpload || <Form.Item label="Tải lên CV mới" name="fileCV" valuePropName="fileList" getValueFromEvent={getFile}>
            <Upload accept="application/pdf" maxCount={1} customRequest={dummyRequest}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
              {/* <button style={{ border: 0, background: 'none' }} type="button">
                <div style={{ marginTop: 8 }}>Upload</div>
              </button> */}
            </Upload>
          </Form.Item>}
          {/* <Form.Item label=""></Form.Item> */}
          <Form.Item style={{ textAlign: "center" }}>
            <Button htmlType="submit">Đăng ký</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
    </>
  );
};
export default PostDetail;
