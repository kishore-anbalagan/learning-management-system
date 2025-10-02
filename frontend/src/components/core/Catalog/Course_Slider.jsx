import React, { useEffect, useState } from "react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "swiper/css/autoplay"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode, Pagination, Autoplay } from "swiper/modules"

import Course_Card from "./Course_Card"

function Course_Slider({ Courses }) {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  
  useEffect(() => {
    // If courses are provided directly, use them
    if (Courses && Courses.length > 0) {
      setCourses(Courses);
      setLoading(false);
    } 
    // Otherwise show empty state
    else {
      setCourses([]);
      setLoading(false);
    }
  }, [Courses]);

  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row gap-6">
        <p className=" h-[201px] w-full rounded-xl skeleton"></p>
        <p className=" h-[201px] w-full rounded-xl hidden lg:flex skeleton"></p>
        <p className=" h-[201px] w-full rounded-xl hidden lg:flex skeleton"></p>
      </div>
    );
  }
  
  // We'll always show courses now
  // if (courses.length === 0) {
  //   return <div className="text-xl text-richblack-5">No courses found</div>;
  // }

  return (
    <div className='text-white'>
      {courses.length > 0 && (
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
            624: {
              slidesPerView: 2,
            }
          }}
          className="max-h-[30rem] pt-8 px-2"
        >
          {courses.map((course, i) => (
            <SwiperSlide key={i}>
              <Course_Card course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
}

export default Course_Slider
