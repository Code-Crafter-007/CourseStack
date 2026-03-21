import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";

interface Lecture {
  lecture_id: string;
  title: string;
  order_number: number;
}

interface Module {
  module_id: string;
  module_title: string;
  order_number: number;
  lectures: Lecture[];
}

interface Course {
  course_id: string;
  title: string;
  description: string;
  price: number;
  thumbnail_url: string;
  instructor_id: string;
}

const CourseDetail: React.FC = () => {

  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // safely extract user id
  const userId = (currentUser as any)?.user_id;

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [instructorName, setInstructorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [openModule, setOpenModule] = useState<string | null>(null);

  useEffect(() => {

    const fetchCourseData = async () => {

      if (!courseId || !userId) return;

      /* COURSE INFO */

      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("course_id", courseId)
        .single();

      if (courseData) {

        setCourse(courseData);

        const { data: instructor } = await supabase
          .from("users")
          .select("name")
          .eq("user_id", courseData.instructor_id)
          .single();

        if (instructor) {
          setInstructorName(instructor.name);
        }
      }

      /* MODULES + LECTURES */

      const { data: modulesData } = await supabase
        .from("modules")
        .select(`
          module_id,
          module_title,
          order_number,
          lectures (
            lecture_id,
            title,
            order_number
          )
        `)
        .eq("course_id", courseId)
        .order("order_number");

      if (modulesData) {
        setModules(modulesData);
      }

      /* ENROLLMENT CHECK */

      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .maybeSingle();

      if (enrollment) {
        setIsEnrolled(true);
      }

      setLoading(false);
    };

    fetchCourseData();

  }, [courseId, userId]);



  /* ENROLL FUNCTION */

  const handleEnroll = async () => {

    if (!userId) {
      alert("User not logged in");
      return;
    }

    const { error } = await supabase
      .from("enrollments")
      .insert({
        user_id: userId,
        course_id: courseId
      });

    if (error) {
      console.error("Enrollment failed:", error);
    } else {
      setIsEnrolled(true);
    }
  };


  if (loading) {
    return <div style={{ padding: 40 }}>Loading course...</div>;
  }

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>

      {/* HERO SECTION */}

      <div
        style={{
          display: "flex",
          gap: "50px",
          padding: "60px",
          borderBottom: "1px solid #333"
        }}
      >

        <div style={{ flex: 2 }}>

          <h1 style={{ fontSize: "36px", marginBottom: 15 }}>
            {course?.title}
          </h1>

          <p style={{ color: "#aaa", fontSize: "18px" }}>
            {course?.description}
          </p>

          <p style={{ marginTop: 20 }}>
            Created by <strong>{instructorName}</strong>
          </p>

        </div>


        {/* COURSE CARD */}

        <div
          style={{
            width: 350,
            background: "#111",
            padding: 20,
            borderRadius: 10
          }}
        >

          <img
            src={
              course?.thumbnail_url
                ? `/images/${course.thumbnail_url}`
                : "https://via.placeholder.com/400"
            }
            style={{
              width: "100%",
              borderRadius: 8,
              marginBottom: 20
            }}
          />

          <h2>₹{course?.price}</h2>

          {isEnrolled ? (
            <button
              style={{
                width: "100%",
                marginTop: 15,
                padding: 12,
                background: "#16a34a",
                border: "none",
                borderRadius: 6,
                color: "white",
                fontWeight: "bold"
              }}
            >
              Enrolled
            </button>
          ) : (
            <button
              onClick={handleEnroll}
              style={{
                width: "100%",
                marginTop: 15,
                padding: 12,
                background: "#a435f0",
                border: "none",
                borderRadius: 6,
                color: "white",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Enroll Now
            </button>
          )}

        </div>
      </div>


      {/* COURSE CONTENT */}

      <div style={{ padding: 60 }}>

        <h2 style={{ marginBottom: 20 }}>Course Content</h2>

        {modules.map((module) => (

          <div
            key={module.module_id}
            style={{
              border: "1px solid #333",
              borderRadius: 8,
              marginBottom: 20
            }}
          >

            <div
              style={{
                padding: 20,
                cursor: "pointer",
                background: "#111"
              }}
              onClick={() =>
                setOpenModule(
                  openModule === module.module_id
                    ? null
                    : module.module_id
                )
              }
            >
              <strong>{module.module_title}</strong>
            </div>

            {openModule === module.module_id && (

              <ul style={{ padding: 20 }}>

                {module.lectures.map((lecture) => (

                  <li
                    key={lecture.lecture_id}
                    style={{
                      marginBottom: 10,
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >

                    {lecture.title}

                    {isEnrolled ? (
                      <button
                        onClick={() =>
                          navigate(`/course/${courseId}/lecture/${lecture.lecture_id}`)
                        }
                        style={{
                          background: "#2563eb",
                          border: "none",
                          color: "white",
                          padding: "6px 10px",
                          borderRadius: 4,
                          cursor: "pointer"
                        }}
                      >
                        Watch
                      </button>
                    ) : (
                      <span style={{ color: "#aaa" }}>Preview</span>
                    )}

                  </li>

                ))}

              </ul>

            )}

          </div>

        ))}

      </div>


      {/* DESCRIPTION */}

      <div
        style={{
          padding: 60,
          borderTop: "1px solid #333"
        }}
      >

        <h2>Description</h2>

        <p
          style={{
            marginTop: 20,
            color: "#aaa",
            lineHeight: 1.7
          }}
        >
          {course?.description}
        </p>

      </div>

    </div>
  );
};

export default CourseDetail;