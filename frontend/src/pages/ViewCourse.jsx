import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
// Replaced missing module import with getCourseDetails from courseAPI
import { getCourseDetails, getCourseContent } from "../services/operations/courseAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"

import { setCourseViewSidebar } from "../slices/sidebarSlice"




export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)

  // get Full Details Of Course
  useEffect(() => {
    ; (async () => {
      try {
        const details = await getCourseDetails(courseId)
        // details expected shape: { course: {...} } OR { courseDetails: {...} }
        const courseObj = details.courseDetails || details.course || details
        if (!courseObj) return
        // fetch content if separate endpoint is required
        if (courseObj._id && !courseObj.courseContent) {
          try {
            const contentResp = await getCourseContent(courseObj._id, token)
            courseObj.courseContent = contentResp.courseContent || contentResp
          } catch (e) { /* optional content fetch failure */ }
        }
        dispatch(setCourseSectionData(courseObj.courseContent || []))
        dispatch(setEntireCourseData(courseObj))
        dispatch(setCompletedLectures([])) // placeholder until progress endpoint wired
        let lectures = 0
        courseObj?.courseContent?.forEach((sec) => {
          lectures += (sec.subSection?.length) || 0
        })
        dispatch(setTotalNoOfLectures(lectures))
      } catch (e) {
        console.error('Failed to load course details', e)
      }
    })()
  }, [courseId, token, dispatch])


  // handle sidebar for small devices
  const { courseViewSidebar } = useSelector(state => state.sidebar)
  const [screenSize, setScreenSize] = useState(undefined)

  // set curr screen Size
  useEffect(() => {
    const handleScreenSize = () => setScreenSize(window.innerWidth)

    window.addEventListener('resize', handleScreenSize);
    handleScreenSize();
    return () => window.removeEventListener('resize', handleScreenSize);
  })

  // close / open sidebar according screen size
  useEffect(() => {
    if (screenSize <= 640) {
      dispatch(setCourseViewSidebar(false))
    } else dispatch(setCourseViewSidebar(true))
  }, [screenSize])


  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)] ">
        {/* view course side bar */}
        {courseViewSidebar && <VideoDetailsSidebar setReviewModal={setReviewModal} />}

        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto mt-14">
          <div className="mx-6">
            <Outlet />
          </div>
        </div>
      </div>


      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}
