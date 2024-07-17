"use client"
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter, usePathname } from 'next/navigation'
import axios from 'axios';
import Error from 'next/error';
import http from '@/app/utils/http';
interface Application {
    id: number;
    user: {
      username: string;
      email: string;
    };
    CV: string,
    content: string
}
export default function Applications() {
    async function processApplication(action: number) {
        try{
            let operate = "Accept";
            if (action == 1){
                operate = "Decline"
            }
            await http.putWithAutoRefreshToken(`/api/recruiterApplication/put${operate}Application/${path.split("/").pop()}`, {}, {useAccessToken: true})
            if (action){
              toast.success(`Từ chối thành công`)  
            }
            else{
              toast.success("Chấp nhận thành công")
            }
            
        }
        catch(e:any) {
            console.log(e)
            toast.error("Lỗi")
            
            
        }

    }
    const notifyCopy = () => toast.success("Copied");
    const Copy = (e: any) => {
        e.preventDefault();
        const email = e.target.getAttribute('data-value')
        navigator.clipboard.writeText(email);
    }
    const Accept = (e: any) => {
        e.preventDefault();
        const applicationId = e.target.getAttribute('data-id')
        // call api here
        processApplication(0);
    }
    const Decline = (e: any) => {
        e.preventDefault();
        const applicationId = e.target.getAttribute('data-id')
        // call api here
        processApplication(1);
    }
    const View = (e: any) => {
        e.preventDefault();
        const url = e.target.getAttribute("data-cv");
        window.open(url, '_blank').focus();
    }
    const [application, setApplication] = useState<Application | undefined>();
    const baseURL = "http://localhost:6868/api/recruiterApplication"
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<number>(200);
    const router = useRouter()
    const path = usePathname();
    let refreshToken:any;
    let accessToken:any;
    if (typeof window !== 'undefined') {
        // Perform localStorage action
        refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken){
                router.push("/login");
        }
        accessToken = localStorage.getItem('accessToken')
    }
    useEffect(() => {
        getApplication()
        async function getApplication() {
            try{
                const data = await http.getWithAutoRefreshToken(`/api/recruiterApplication/getDetailedApplication/${path.split("/").pop()}`, {useAccessToken: true})
                setApplication({...data.data})
                setLoading(false)
            }
            catch(e:any) {
                setError(e.response.status)
            }
        }
    
    }, [path])
    if (error != 200){
        return(
            <>
                <Error statusCode={error} />
            </>
        )
    }
    if (isLoading){
        return (
            <>
                <div className="text-center h-screen">
                    <h1 className="text-3xl text-gray-800 font-semibold">
                        Loading...
                    </h1>
                </div>
            </>
        )
    }
    return(
        <>
        <div className='flex flex-col pb-5' style={{height: "85vh"}}>
            <ToastContainer/>
            {!application || <>
            <div className=' grid gap-2 sm:grid-cols-2 lg:grid-cols-2 grow'>
                <div className = 'flex flex-col grow content-center'>
                    <div className='grow'>
                        {<p className='font-bold text-3xl text-black'>Đơn ứng tuyển của {`${application.user.username}`}</p>}
                        {/* <div className='flex flex-row gap-10 content-center'>
                            {<p className='font-bold text-3xl text-black'>Email: {application.user.email}</p>}
                            <svg
                                viewBox="0 0 1024 1024"
                                fill="black"
                                height="2em"
                                width="2em"
                                data-value={application.user.email}
                                className='hover:fill-red-500'
                                onClick={(e) => {Copy(e);
                                notifyCopy()}}
                            >
                            <path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z" />
                            </svg>
                        </div> */}
                        <p className='text-black mt-3'>{application.content}</p>
                    </div>
                    <div className='flex flex-col gap-0 justify-center content-center grow'>
                        <button className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800' onClick={Accept} data-id={application.id}>Chấp nhận</button>
                        <button className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800' onClick={Decline} data-id={application.id}>Từ chối</button>
                        <button className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800' onClick={View} data-cv={application.CV}>Xem CV</button>
                    </div>
                </div>
                <div className = 'flex flex-row justify-center content-center grow'>
                    {<iframe src={`${application.CV}`} className='grow'/>}
                </div>
                
            </div>
            </>}
        </div>
        </>
    )
}