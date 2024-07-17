import { PhoneOutlined, MailOutlined, SendOutlined } from '@ant-design/icons';

const Footer = () => {
    return (
        <>
            <div className="footer divide-y divide-gray-700">
                <div className="grid grid-cols-4 pt-16 pb-16">
                    <div className='pl-3'>
                        <p className="text-white text-3xl font-bold cursor-pointer">Hust<span className="text-[#f0101a]">CV</span></p>
                        <p className='text-white'>Hút việc về nào</p>
                        <div>
                            <div className='inline-flex gap-2 mt-8'>
                                <p className='cursor-pointer w-7 h-7 flex items-center justify-center hover:bg-black hover:border-none text-white rounded-full border-white border-2'>
                                    <img className='w-4 h-4' src="/socials/tiktok.png" alt="tiktok" />
                                </p>
                                <p className='cursor-pointer w-7 h-7 flex items-center justify-center hover:bg-[#2478ba] hover:border-none text-white rounded-full border-white border-2'>
                                    <img className='w-4 h-4' src="/socials/twitter.png" alt="twitter" />
                                </p>
                                <p className='cursor-pointer w-7 h-7 flex items-center justify-center hover:bg-[#0072b7] hover:border-none text-white rounded-full border-white border-2'>
                                    <img className='w-4 h-4' src="/socials/linkedin.png" alt="linkedin" />
                                </p>
                                <p className='cursor-pointer w-7 h-7 flex items-center justify-center hover:bg-[#c33223] hover:border-none text-white rounded-full border-white border-2'>
                                    <img className='w-4 h-4' src="/socials/youtube.png" alt="youtube" />
                                </p>
                                <p className='cursor-pointer w-7 h-7 flex items-center justify-center hover:bg-[#9146fe] hover:border-none text-white rounded-full border-white border-2'>
                                    <img className='w-4 h-4' src="/socials/twitch.png" alt="twitch" />
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 grid grid-cols-3">
                        <div>
                            <h3 className="text-white font-semibold">Về HustCV</h3>
                            <a href='https://www.facebook.com/hoangtrung.trung.566' className='no-underline text-[#a6a6a6] block text-sm py-2 cursor-pointer hover:text-white'>Hoàng Văn Trung</a>
                            <a href='https://www.facebook.com/vu9636' className='no-underline text-[#a6a6a6] block text-sm py-2 cursor-pointer hover:text-white'>Nguyễn Đức Long Vũ</a>
                            <a href='https://www.facebook.com/Meizu.17.08' className='no-underline text-[#a6a6a6] block text-sm py-2 cursor-pointer hover:text-white'>Lê Văn Minh</a>
                            <a href='https://www.facebook.com/profile.php?id=100020583019038' className='no-underline text-[#a6a6a6] block text-sm py-2 cursor-pointer hover:text-white'>Vũ Đình Linh</a>
                            <a href='https://www.facebook.com/profile.php?id=100017717225379' className='no-underline text-[#a6a6a6] block text-sm py-2 cursor-pointer hover:text-white'>Tạ Ngọc Tú</a>
                            <a href='https://www.facebook.com/xnam132003' className='no-underline text-[#a6a6a6] block text-sm py-2 cursor-pointer hover:text-white'>Nguyễn Xuân Nam</a>
                            <a href='https://www.facebook.com/profile.php?id=100012098265712' className='no-underline text-[#a6a6a6] block text-sm py-2 cursor-pointer hover:text-white'>Nguyễn Nam Khánh</a>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Lớp </h3>
                            <p className='text-[#a6a6a6] text-sm py-2 cursor-pointer'>Nhập môn CNPM</p>
                            <p className='text-[#a6a6a6] text-sm py-2 cursor-pointer'>Khoa học máy tính 03</p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Từ khóa liên quan</h3>
                            <p className='text-[#a6a6a6] text-sm py-2 cursor-pointer'>IT1</p>
                            <p className='text-[#a6a6a6] text-sm py-2 cursor-pointer'>Khoa học máy tính</p>
                            <p className='text-[#a6a6a6] text-sm py-2 cursor-pointer'>Công nghệ phần mềm</p>
                            <p className='text-[#a6a6a6] text-sm py-2 cursor-pointer'>Bách khoa Hà Nội</p>
                            <p className='text-[#a6a6a6] text-sm py-2 cursor-pointer'>Hội trai đẹp</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">Liên hệ để đăng tin tuyển dụng tại:</h3>
                        <p className='text-[#a6a6a6] text-sm py-2 cursor-pointer'><PhoneOutlined className='mr-2' />Hà Nội: (+84) 983 131 351</p>
                        <p className='text-[#a6a6a6] text-sm py-2 cursor-pointer'><MailOutlined className='mr-2' />Email: hustcv@gmail.com</p>
                        <p className='text-[#a6a6a6] text-sm py-2 cursor-pointer'><SendOutlined className='mr-2' />Gửi thông tin liên hệ</p>
                    </div>
                </div>
                <div className='text-center text-white py-6'>
                    <p>Copyright © HustCV</p>
                </div>
            </div>
        </>

    )
}

export default Footer