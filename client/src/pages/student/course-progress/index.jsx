import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { getCurrentCourseProgressService } from "@/services";
import { ChevronLeft } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {

    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
        useContext(StudentContext);
    const [lockCourse, setLockCourse] = useState(false);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
        useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const { id } = useParams();

    async function fetchCurrentCourseProgress() {
        const response = await getCurrentCourseProgressService(auth?.user?._id, id);
        if (response?.success) {
            if (!response?.data?.isPurchased) {
                setLockCourse(true);
            } else {
                setStudentCurrentCourseProgress({
                    courseDetails: response?.data?.courseDetails,
                    progress: response?.data?.progress,
                });

                if (response?.data?.completed) {
                    setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
                    setShowCourseCompleteDialog(true);
                    setShowConfetti(true);

                    return;
                }

                if (response?.data?.progress?.length === 0) {
                    setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
                } else {
                    console.log("logging here");
                    const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
                        (acc, obj, index) => {
                            return acc === -1 && obj.viewed ? index : acc;
                        },
                        -1
                    );

                    setCurrentLecture(
                        response?.data?.courseDetails?.curriculum[
                        lastIndexOfViewedAsTrue + 1
                        ]
                    );
                }
            }
        }
    }


    useEffect(() => {
        fetchCurrentCourseProgress()
    }, [id])



    return (
        <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
            <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
                <div className="flex items-center space-x-4">
                    <Button onClick={() => navigate("/student-courses")} className="text-black" variant="ghost" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to My Course page
                    </Button>
                    <h1>

                    </h1>

                </div>
                <Dialog open={lockCourse}>
                    <DialogContent className="sm:w-[425px]">
                        <DialogHeader>
                            <DialogTitle>You Dont have Access to View This Page</DialogTitle>
                            <DialogDescription>
                                Please purchase this course to get access
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
                <Dialog open={showCourseCompleteDialog}>
                    <DialogContent showOverlay={false} className="sm:w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Congratulations!</DialogTitle>
                            <DialogDescription className="flex flex-col gap-3">
                                <Label>You have Successfully completed the Course...!</Label>
                                <div className="flex flex-row gap-3">
                                    <Button onClick={() => navigate("/student-courses")}>
                                        My Courses Page
                                    </Button>
                                    {/* <Button onClick={handleRewatchCourse}>Rewatch Course</Button> */}
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

            </div>

        </div>)

}

export default StudentViewCourseProgressPage;