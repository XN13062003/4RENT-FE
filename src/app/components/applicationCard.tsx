import Link from "next/link";
interface Post {
    id: any;
    title: any;
  }
  
interface CardProps {
    applications: any;
    href: any;
    title: any;
}
  
export default function Card({applications, href, title}: CardProps){
  return (
      <section className="mt-12 mx-auto px-4 max-w-screen-xl md:px-8">
          <div className="text-center">
              <h1 className="text-3xl text-gray-800 font-semibold">
                  {title}
              </h1>
              <p className="mt-3 text-gray-500">
                  Chọn đơn ứng tuyển
              </p>
          </div>
          <div className="mt-10 grid gap-2 sm:grid-cols-1 lg:grid-cols-1 pb-5 auto-rows-fr">
              {
                  applications.map((items: any, key: any) => (
                      <article className="max-w-md mx-auto mt-4 shadow-lg border rounded-md duration-300 hover:shadow-sm hover:cursor-pointer w-5/12" key={key}>
                          <Link href={`${href}${items.id}`}>
                              {/* <img src={'https://devmountain.com/wp-content/uploads/2022/04/wBf2WFXnGZDWaKrTyYfLPmSP3XCp8MAGd6-RVz4cCAFntWN7cxzZqee9K3gOsTVHvW4NSB0JcoXeD6hQ4JROlpqwkQ8yvdEvuT_bAxtauCQaD_3P5ckeCWyrmU8Pc_ve09hqZw0J-1.png'} loading="lazy" alt={items.title}  className="w-full h-40 rounded-t-md" /> */}
                              {/* <div className="flex items-center mt-2 pt-3 ml-4 mr-2">
                                  <div className="flex-none w-10 h-10 rounded-full">
                                      <img src={items.authorLogo} className="w-full h-full rounded-full" alt={items.authorName} />
                                  </div>
                                  <div className="ml-3">
                                      <span className="block text-gray-900">{items.authorName}</span>
                                      <span className="block text-gray-400 text-sm">{items.date}</span>
                                  </div>
                              </div> */}
                              <div className="pt-3 ml-4 mr-2 mb-3">
                                  <h3 className="text-xl text-gray-900 line-clamp-1 mb-2">
                                      {items.user.username}
                                  </h3>
                                  <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="gray"
                                    height="1em"
                                    width="1em"
                                    className="inline-block mr-2"
                                    >
                                        <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6m-2 0l-8 5-8-5h16m0 12H4V8l8 5 8-5v10z" />
                                  </svg>
                                    {items.user.email}
                                    </p>
                                  <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                                  <svg
                                        className="inline-block mr-2"
                                        viewBox="0 0 1024 1024"
                                        fill="currentColor"
                                        height="1em"
                                        width="1em"

                                    >
                                    <path d="M877.1 238.7L770.6 132.3c-13-13-30.4-20.3-48.8-20.3s-35.8 7.2-48.8 20.3L558.3 246.8c-13 13-20.3 30.5-20.3 48.9 0 18.5 7.2 35.8 20.3 48.9l89.6 89.7a405.46 405.46 0 01-86.4 127.3c-36.7 36.9-79.6 66-127.2 86.6l-89.6-89.7c-13-13-30.4-20.3-48.8-20.3a68.2 68.2 0 00-48.8 20.3L132.3 673c-13 13-20.3 30.5-20.3 48.9 0 18.5 7.2 35.8 20.3 48.9l106.4 106.4c22.2 22.2 52.8 34.9 84.2 34.9 6.5 0 12.8-.5 19.2-1.6 132.4-21.8 263.8-92.3 369.9-198.3C818 606 888.4 474.6 910.4 342.1c6.3-37.6-6.3-76.3-33.3-103.4zm-37.6 91.5c-19.5 117.9-82.9 235.5-178.4 331s-213 158.9-330.9 178.4c-14.8 2.5-30-2.5-40.8-13.2L184.9 721.9 295.7 611l119.8 120 .9.9 21.6-8a481.29 481.29 0 00285.7-285.8l8-21.6-120.8-120.7 110.8-110.9 104.5 104.5c10.8 10.8 15.8 26 13.3 40.8z" />
                                    </svg>
                                    {items.user.phoneNumber}
                                  </p>
                              </div>
                          </Link>
                      </article>
                  ))
              }
          </div>
      </section>
  )
}
