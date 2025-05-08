import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { getCurrentCourseProgressService, markLectureAsViewedService, resetCourseProgressService } from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import ReactConfetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";
import html2pdf from 'html2pdf.js'; // Import html2pdf.js

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
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    const [certificateGenerated, setCertificateGenerated] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizPassed, setQuizPassed] = useState(false);
    // const certificateRef = useRef();

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

    async function updateCourseProgress() {
        if (currentLecture) {
            const response = await markLectureAsViewedService(
                auth?.user?._id,
                studentCurrentCourseProgress?.courseDetails?._id,
                currentLecture._id
            );

            if (response?.success) {
                fetchCurrentCourseProgress();
            }
        }
    }

    async function handleRewatchCourse() {
        const response = await resetCourseProgressService(
            auth?.user?._id,
            studentCurrentCourseProgress?.courseDetails?._id
        );

        if (response?.success) {
            setCurrentLecture(null);
            setShowConfetti(false);
            setShowCourseCompleteDialog(false);
            fetchCurrentCourseProgress();
        }
    }

    const quizQuestions = [
        {
            id: 1,
            question: "What is React primarily used for?",
            options: [
                "Backend Development",
                "Game Development",
                "Building User Interfaces",
                "Database Management",
            ],
            correct: 2,
        },
        {
            id: 2,
            question: "Which hook is used to manage state in functional components?",
            options: ["useFetch", "useContext", "useState", "useRouter"],
            correct: 2,
        },
        {
            id: 3,
            question: "What does JSX stand for?",
            options: [
                "JavaScript XML",
                "Java Syntax Extension",
                "Java Super X",
                "JSON Extra",
            ],
            correct: 0,
        },
        {
            id: 4,
            question: "Which method is used to fetch data from an API in React?",
            options: ["fetch()", "get()", "useFetch()", "request()"],
            correct: 0,
        },
        {
            id: 5,
            question: "What is a component in React?",
            options: [
                "A function or class that renders UI",
                "A styling file",
                "A route path",
                "A database model",
            ],
            correct: 0,
        },
    ];

    function handleQuizSubmit() {
        let score = 0;
        quizQuestions.forEach((q) => {
            if (quizAnswers[q.id] === q.correct) score++;
        });

        setQuizSubmitted(true);
        const passed = score >= 4;
        setQuizPassed(passed);

        if (passed) {
            setShowCourseCompleteDialog(true);
            setShowConfetti(true);
        }
    }

    console.log("Quiz Questions", quizQuestions)

    // function generateCertificate() {
    //     const element = certificateRef.current;
    //     html2pdf().from(element).save(`certificate-${auth?.user?.userName}.pdf`);
    //     setCertificateGenerated(true);
    // }



    const generateCertificate = () => {
        const element = document.getElementById('certificate');
        if (element) {
            // Adding text to the certificate dynamically
            const certificateContent = `
                <div style="text-align: center; font-size: 24px; margin-top: 50px; margin-bottom:50px;">
                    <h1 style="font-size: 36px; font-weight: bold;">${studentCurrentCourseProgress?.courseDetails?.title}</h1>
                    <p style="font-size: 24px; margin-top: 20px;">Certificate of Completion</p>
                   <p style="font-size: 20px; margin-top: 30px;">Congratulations ${auth?.user?.userName || 'Student'}!</p>
                    <p style="font-size: 18px; margin-top: 15px;">You have successfully completed the course.</p>
                    <p style="font-size: 16px; margin-top: 20px;">Date: ${new Date().toLocaleDateString()}</p>
                </div>
            `;

            element.innerHTML = certificateContent;  // Set the dynamic content to the certificate element

            // Show the certificate div temporarily (for rendering)
            element.style.display = 'block';

            const options = {
                filename: `${studentCurrentCourseProgress?.courseDetails?.title}_Certificate.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 4 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape', margin: [20, 20, 20, 20] },
            };

            html2pdf().from(element).set(options).save();

            // Hide the certificate div after download
            setTimeout(() => {
                element.style.display = 'none';
            }, 1000);  // Hide it after 1 second

            setCertificateGenerated(true);  // Track that the certificate is generated
        }
    };


    useEffect(() => {
        fetchCurrentCourseProgress()
    }, [id]);

    useEffect(() => {
        if (currentLecture?.progressValue === 1) updateCourseProgress();
    }, [currentLecture]);


    useEffect(() => {
        if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
    }, [showConfetti]);



    return (

        <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
            {showConfetti && <ReactConfetti />}


            <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
                <DialogContent className="sm:max-w-2xl bg-gray-900 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold mb-4">Final Quiz</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleQuizSubmit();
                        }}
                    >
                        {quizQuestions.map((q) => (
                            <div key={q.id} className="mb-6">
                                <p className="font-medium">{q.question}</p>
                                {q.options.map((opt, idx) => (
                                    <label key={idx} className="block mt-1">
                                        <input
                                            type="radio"
                                            name={`q${q.id}`}
                                            value={idx}
                                            checked={quizAnswers[q.id] === idx}
                                            onChange={() =>
                                                setQuizAnswers((prev) => ({ ...prev, [q.id]: idx }))
                                            }
                                            className="mr-2"
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        ))}
                        <Button type="submit" className="mt-4 w-full">
                            Submit Quiz
                        </Button>
                    </form>

                    {quizSubmitted && (
                        <div className="mt-4 text-center font-semibold">
                            {quizPassed ? (
                                <span className="text-green-400">You passed the quiz! 🎉</span>
                            ) : (
                                <span className="text-red-400">You did not pass. Try again!</span>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>


            <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
                <div className="flex items-center space-x-4">
                    <Button onClick={() => navigate("/student-courses")} className="text-black" variant="ghost" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to My Course page
                    </Button>
                    <h1 className="text-lg font-bold hidden md:block">
                        {studentCurrentCourseProgress?.courseDetails?.title}
                    </h1>

                </div>
                <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
                    {isSideBarOpen ? (
                        <ChevronRight className="h-5 w-5" />
                    ) : (
                        <ChevronLeft className="h-5 w-5" />
                    )}
                </Button>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div
                    className={`flex-1 ${isSideBarOpen ? "mr-[400px]" : ""
                        } transition-all duration-300`}
                >
                    <VideoPlayer
                        width="100%"
                        height="500px"
                        url={currentLecture?.videoUrl}
                        onProgressUpdate={setCurrentLecture}
                        progressData={currentLecture}
                    />
                    <div className="p-6 bg-[#1c1d1f]">
                        <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
                    </div>
                </div>
                <div className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${isSideBarOpen ? "translate-x-0" : "translate-x-full"
                    }`}>
                    <Tabs defaultValue="content" className="h-full flex flex-col">
                        <TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14">
                            <TabsTrigger
                                value="content"
                                className=" text-black rounded-none h-full"
                            >
                                Course Content
                            </TabsTrigger>
                            <TabsTrigger
                                value="overview"
                                className=" text-black rounded-none h-full"
                            >
                                Overview
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="content">
                            <ScrollArea className="h-full">
                                <div className="p-4 space-y-4">
                                    {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                                        (item) => (
                                            <div
                                                className="flex items-center space-x-2 text-sm text-white font-bold cursor-pointer"
                                                key={item._id}
                                            >
                                                {studentCurrentCourseProgress?.progress?.find(
                                                    (progressItem) => progressItem.lectureId === item._id
                                                )?.viewed ? (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <Play className="h-4 w-4 " />
                                                )}
                                                <span>{item?.title}</span>
                                            </div>
                                        )
                                    )}

                                </div>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="overview" className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full">
                                <div className="p-4">
                                    <h2 className="text-xl font-bold mb-4">About this course</h2>
                                    <p className="text-gray-400">
                                        {studentCurrentCourseProgress?.courseDetails?.description}
                                    </p>
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
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
                <DialogContent showOverlay={false} className="max-w-xl w-full">
                    <DialogHeader>
                        <DialogTitle>Congratulations!</DialogTitle>
                        <DialogDescription className="flex flex-col gap-3">
                            <Label>You have Successfully completed the Course...!</Label>
                            <div className="overflow-x-auto">
                                <div className="flex whitespace-nowrap gap-3 md:gap-5">
                                    <Button className="px-1 text-sm" onClick={() => navigate("/student-courses")}>
                                        My Courses Page
                                    </Button>
                                    <Button className="px-1 text-sm" onClick={handleRewatchCourse}>
                                        Rewatch Course
                                    </Button>
                                    <Button className="px-1 text-sm" onClick={() => setShowQuiz(true)}>
                                        Take Final Quiz
                                    </Button>
                                    {!certificateGenerated && (
                                        <Button className="px-1 text-sm" onClick={generateCertificate}>
                                            Download Certificate
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {/* Certificate */}
            <div id="certificate" style={{ display: 'none' }}>
                {/* <div style={{ textAlign: 'center', fontSize: '24px', marginTop: '50px' }}>
                    <h1>{studentCurrentCourseProgress?.courseDetails?.title}</h1>
                    <p>Certificate of Completion</p>
                    <p>Congratulations {auth?.user?.name}!</p>
                    <p>You have successfully completed the course.</p>
                    <p>Date: {new Date().toLocaleDateString()}</p>
                </div> */}
            </div>


        </div>);


}


export default StudentViewCourseProgressPage;




// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import VideoPlayer from "@/components/video-player";
// import { AuthContext } from "@/context/auth-context";
// import { StudentContext } from "@/context/student-context";
// import {
//   getCurrentCourseProgressService,
//   markLectureAsViewedService,
//   resetCourseProgressService,
// } from "@/services";
// import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
// import { useContext, useEffect, useState, useRef } from "react";
// import ReactConfetti from "react-confetti";
// import { useNavigate, useParams } from "react-router-dom";
// import html2pdf from "html2pdf.js";

// function StudentViewCourseProgressPage() {
//   const navigate = useNavigate();
//   const { auth } = useContext(AuthContext);
//   const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
//     useContext(StudentContext);
//   const [lockCourse, setLockCourse] = useState(false);
//   const [currentLecture, setCurrentLecture] = useState(null);
//   const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
//     useState(false);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [isSideBarOpen, setIsSideBarOpen] = useState(true);
//   const [certificateGenerated, setCertificateGenerated] = useState(false);
//   const [showQuiz, setShowQuiz] = useState(false);
//   const [quizAnswers, setQuizAnswers] = useState({});
//   const [quizSubmitted, setQuizSubmitted] = useState(false);
//   const [quizPassed, setQuizPassed] = useState(false);
//   const certificateRef = useRef();

//   const { id } = useParams();

//   useEffect(() => {
//     fetchCurrentCourseProgress();
//   }, []);

//   async function fetchCurrentCourseProgress() {
//     const response = await getCurrentCourseProgressService(
//       auth?.user?._id,
//       id
//     );
//     if (response?.success) {
//       if (!response?.data?.isPurchased) {
//         setLockCourse(true);
//       } else {
//         setStudentCurrentCourseProgress({
//           courseDetails: response?.data?.courseDetails,
//           progress: response?.data?.progress,
//         });

//         if (response?.data?.completed) {
//           setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
//           setShowCourseCompleteDialog(true);
//           setShowConfetti(true);
//           return;
//         }

//         if (response?.data?.progress?.length === 0) {
//           setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
//         } else {
//           const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
//             (acc, obj, index) => {
//               return acc === -1 && obj.viewed ? index : acc;
//             },
//             -1
//           );
//           setCurrentLecture(
//             response?.data?.courseDetails?.curriculum[lastIndexOfViewedAsTrue + 1]
//           );
//         }
//       }
//     }
//   }

//   async function updateCourseProgress() {
//     if (currentLecture) {
//       const response = await markLectureAsViewedService(
//         auth?.user?._id,
//         studentCurrentCourseProgress?.courseDetails?._id,
//         currentLecture._id
//       );
//       if (response?.success) {
//         fetchCurrentCourseProgress();
//       }
//     }
//   }

//   async function handleRewatchCourse() {
//     const response = await resetCourseProgressService(
//       auth?.user?._id,
//       studentCurrentCourseProgress?.courseDetails?._id
//     );
//     if (response?.success) {
//       setCurrentLecture(null);
//       setShowConfetti(false);
//       setShowCourseCompleteDialog(false);
//       fetchCurrentCourseProgress();
//     }
//   }

//   const quizQuestions = [
//     {
//       id: 1,
//       question: "What is React primarily used for?",
//       options: [
//         "Backend Development",
//         "Game Development",
//         "Building User Interfaces",
//         "Database Management",
//       ],
//       correct: 2,
//     },
//     {
//       id: 2,
//       question: "Which hook is used to manage state in functional components?",
//       options: ["useFetch", "useContext", "useState", "useRouter"],
//       correct: 2,
//     },
//     {
//       id: 3,
//       question: "What does JSX stand for?",
//       options: [
//         "JavaScript XML",
//         "Java Syntax Extension",
//         "Java Super X",
//         "JSON Extra",
//       ],
//       correct: 0,
//     },
//     {
//       id: 4,
//       question: "Which method is used to fetch data from an API in React?",
//       options: ["fetch()", "get()", "useFetch()", "request()"],
//       correct: 0,
//     },
//     {
//       id: 5,
//       question: "What is a component in React?",
//       options: [
//         "A function or class that renders UI",
//         "A styling file",
//         "A route path",
//         "A database model",
//       ],
//       correct: 0,
//     },
//   ];

//   function handleQuizSubmit() {
//     let score = 0;
//     quizQuestions.forEach((q) => {
//       if (quizAnswers[q.id] === q.correct) score++;
//     });

//     setQuizSubmitted(true);
//     const passed = score >= 4;
//     setQuizPassed(passed);

//     if (passed) {
//       setShowCourseCompleteDialog(true);
//       setShowConfetti(true);
//     }
//   }

//   function generateCertificate() {
//     const element = certificateRef.current;
//     html2pdf().from(element).save(`certificate-${auth?.user?.name}.pdf`);
//     setCertificateGenerated(true);
//   }

//   return (
//     <div className="p-4">
//       {/* Show Quiz */}
//       {showQuiz && (
//         <div className="p-6 bg-gray-800 rounded-lg shadow-lg max-w-2xl mx-auto mt-10">
//           <h2 className="text-2xl font-bold mb-4 text-white">Final Quiz</h2>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleQuizSubmit();
//             }}
//           >
//             {quizQuestions.map((q) => (
//               <div key={q.id} className="mb-6">
//                 <p className="text-white mb-2">{q.question}</p>
//                 {q.options.map((opt, idx) => (
//                   <label key={idx} className="block text-white ml-2">
//                     <input
//                       type="radio"
//                       name={`q${q.id}`}
//                       value={idx}
//                       checked={quizAnswers[q.id] === idx}
//                       onChange={() =>
//                         setQuizAnswers({ ...quizAnswers, [q.id]: idx })
//                       }
//                       className="mr-2"
//                     />
//                     {opt}
//                   </label>
//                 ))}
//               </div>
//             ))}
//             <Button type="submit" className="mt-4">
//               Submit Quiz
//             </Button>
//           </form>

//           {quizSubmitted && (
//             <p className="mt-4 text-white">
//               {quizPassed ? "You passed the quiz!" : "You did not pass the quiz. Please try again."}
//             </p>
//           )}
//         </div>
//       )}

//       {/* Course Complete Dialog */}
//       <Dialog open={showCourseCompleteDialog} onOpenChange={setShowCourseCompleteDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>🎉 Congratulations!</DialogTitle>
//             <DialogDescription>
//               You have completed the course.
//               <div className="mt-4">
//                 {!certificateGenerated && (
//                   <Button onClick={generateCertificate}>Generate Certificate</Button>
//                 )}
//                 <Button variant="outline" onClick={() => setShowQuiz(true)} className="ml-2">
//                   Take Final Quiz
//                 </Button>
//               </div>
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>

//       {/* Certificate to Export */}
//       <div ref={certificateRef} className="hidden bg-white p-10 text-center" id="certificate">
//         <h1 className="text-4xl font-bold mb-4">Certificate of Completion</h1>
//         <p className="text-xl">This is to certify that</p>
//         <h2 className="text-2xl font-semibold my-2">{auth?.user?.name}</h2>
//         <p>has successfully completed the course</p>
//         <h2 className="text-2xl font-semibold my-2">
//           {studentCurrentCourseProgress?.courseDetails?.title}
//         </h2>
//         <p className="mt-6">Date: {new Date().toLocaleDateString()}</p>
//       </div>

//       {/* Confetti Effect */}
//       {showConfetti && <ReactConfetti />}
//     </div>
//   );
// }

// export default StudentViewCourseProgressPage;
