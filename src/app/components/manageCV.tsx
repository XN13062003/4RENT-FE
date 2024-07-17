'use client'
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Descriptions } from 'antd';
import {
    Button,
    message,
    Popover,
    Tabs,
    Upload,
    Card,
} from 'antd';
import type { UploadProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UploadFile } from 'antd/es/upload/interface';
import axios from 'axios'
import http from '../utils/http';


const ManageCV = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const accessToken = localStorage.getItem('refreshToken')

    const queryClient = useQueryClient()
    const linkCV = useQuery({
        queryKey: ['cv'],
        queryFn: async () => {
            try {
                const response = await http.getWithAutoRefreshToken('/api/manageCv/getNameCv', { useAccessToken: true });
                let name = response.name;
                if (name == '') {
                    name = 'Bạn cần upload file'
                }
                setFileList([{
                    uid: '-1',
                    name: name,
                }])
                return response
            }
            catch (err) {
                console.log('>>> check error: ', err)
            }
        }
    })

    const handleShowCV = async () => {
        try {
            const response = await http.getWithAutoRefreshToken('/api/manageCv/getUrlCv', { useAccessToken: true })
            console.log(response)
            const fileLink = response.url
            window.open(fileLink, '_blank');
        }
        catch (err) {
            message.error('Bạn cần Upload File')
        }
    }
    const handleChange: UploadProps['onChange'] = (info) => {
        let newFileList = [...info.fileList];

        newFileList = newFileList.slice(-1);
        setFileList(newFileList);
    };
    const customRequest = async ({ file, onSuccess, onError, onProgress }: any) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post('http://localhost:6868/api/manageCv', formData, {
                headers: {
                "Authorization": `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status) {
                queryClient.invalidateQueries({ queryKey: ['cv'] })
                message.success('Upload file thành công!')
                onSuccess();
            } else {
                onError(new Error('Failed to upload file'));
            }
        } catch (error) {
            console.log('>>> check error: ', error)
            onError(error);
        }
    }
    const beforeUpload = (file: any) => {
        const isPDF = file.type === 'application/pdf';
        if (!isPDF) {
            message.error('Bạn chỉ có thể upload file PDF');
        }
        return isPDF || Upload.LIST_IGNORE;
    }
    return (
        <div className='mb-10 mt-5'>
            <Card className='border-black'>
                <p className='font-bold text-3xl mb-5'>Quản lý CV</p>
                <p className='mb-5 text-base'>Tải CV của bạn bên dưới để có thể sử dụng xuyên suốt quá trình tìm việc</p>
                <div className="border border-solid border-gray-600 p-4 mb-5">
                    <div className='mb-4'>
                        <Upload
                            customRequest={customRequest}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            fileList={fileList}
                            showUploadList={true}
                        >
                            <Button type="primary" htmlType="submit" className='bg-red-600' icon={<UploadOutlined />}>Choose PDF file</Button>
                        </Upload>
                    </div>
                    <div>
                        <Button type="primary" htmlType="submit" className='bg-blue-600' onClick={handleShowCV}>Xem CV</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default ManageCV

// import { useState } from 'react';

// const ManageCV = () => {
//     const [selectedFile, setSelectedFile] = useState(null);

//     const handleFileChange = (event: any) => {
//         setSelectedFile(event.target.files[0]);
//     };

//     const handleUpload = async () => {
//         try {
//             const formData = new FormData();
//             if (selectedFile){
//                 formData.append('file', selectedFile);

//                 await http.axiosClient.post('/api/manageCv', formData, {
//                     headers: {
//                     'Content-Type': 'multipart/form-data',
//                     },
//                 });
//             }

//             alert('File uploaded successfully!');
//         } catch (error) {
//             console.error('Error uploading file:', error);
//             alert('Error uploading file!');
//         }
//     };

//   return (
//     <div>
//       <input type="file" accept=".pdf" onChange={handleFileChange} />
//       <button onClick={handleUpload} disabled={!selectedFile}>
//         Upload
//       </button>
//     </div>
//   );
// };

// export default ManageCV;