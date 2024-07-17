import Link from "next/link";
import Image from "next/image";
interface Post {
    id: any;
    title: any;
  }
  
interface CardProps {
    posts: any;
    href: any;
    title: any;
}
  
export default function Card({posts, href, title}: CardProps){
  return (
      <section className="mt-12 mx-auto px-4 max-w-screen-xl md:px-8">
          <div className="text-center">
              <h1 className="text-3xl text-gray-800 font-semibold">
                  {title}
              </h1>
              <p className="mt-3 text-gray-500">
                  Chọn bài đăng tuyển
              </p>
          </div>
          <div className="mt-10 grid gap-2 sm:grid-cols-1 lg:grid-cols-1 pb-5">
              {
                  posts.map((items: any, key: any) => (
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
                                  <h3 className="text-xl text-gray-900 line-clamp-2 mb-5">
                                      {items.title}
                                  </h3>
                                  
                                  <p className="text-gray-500 text-sm mt-1 mb-2">
                                  <svg fill="none" viewBox="0 0 24 24" height="1em" width="1em" className="inline-block mr-1">
                                        <path
                                                fill="currentColor"
                                                fillRule="evenodd"
                                                d="M17 7a3 3 0 00-3-3h-4a3 3 0 00-3 3H6a3 3 0 00-3 3v8a3 3 0 003 3h12a3 3 0 003-3v-8a3 3 0 00-3-3h-1zm-3-1h-4a1 1 0 00-1 1h6a1 1 0 00-1-1zM6 9h12a1 1 0 011 1v8a1 1 0 01-1 1H6a1 1 0 01-1-1v-8a1 1 0 011-1z"
                                                clipRule="evenodd"
                                        />
                                </svg>
                                    {items.form}
                                    </p>
                                  {items.skills.map((e:any, key: any)=>{
                                    return (<p key ={key} className="text-gray-400 text-xs mt-1 mr-2 inline-block rounded-full border-zinc-500  border-2 pl-2 pr-2 pt-1 pb-1">{e.name}</p>)
                                  })}
                              </div>
                          </Link>
                      </article>
                  ))
              }
          </div>
      </section>
  )
}
