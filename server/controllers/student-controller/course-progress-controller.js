

const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");



//mark current lecture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went Wrong"
        })



    }

}


//get our current course progress
const getCurrentCourseProgress = async (req, res) => {
    try {
        const { userId, courseId } = req.params;
        const studentPurchasedCourses = await StudentCourses.findOne({ userId });

        const isCurrentCoursePurchasedByCurrentUserOrNot =
            studentPurchasedCourses?.courses?.findIndex(item => item.courseId === courseId) > -1;

        if (!isCurrentCoursePurchasedByCurrentUserOrNot) {
            return res.status(200).json({
                success: true,
                isPurchased: false,
                message: "Please Purchase the course to have access"
            })
        }
        const currentUserCourseProgress = await CourseProgress.findOne({
            userId,
            courseId,
        });

        if (
            !currentUserCourseProgress ||
            currentUserCourseProgress?.lecturesProgress?.length === 0
        ) {
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Can't find Course",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Could not Find any Progress, you can start watching the course",
                data: {
                    courseDetails: course,
                    progress: [],
                    isPurchased: true,
                },
            });
        }

        const courseDetails = await Course.findById(courseId);

        res.status(200).json({
            success: true,
            data: {
                courseDetails,
                progress: currentUserCourseProgress.lecturesProgress,
                completed: currentUserCourseProgress.completed,
                completionDate: currentUserCourseProgress.completionDate,
                isPurchased: true,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went Wrong"
        })



    }
}


//Reset current course progress

const resetCurrentCourseProgress = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went Wrong"
        })



    }
}

module.exports = {
    markCurrentLectureAsViewed,
    getCurrentCourseProgress,
    resetCurrentCourseProgress
}

