import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import ReviewSection from "../components/course/ReviewSection";

interface Lecture {
  lecture_id: string;
  title: string;
  order_number: number;
  video_url?: string;
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

const normalizeVideoUrl = (raw?: string) => {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return `https://${trimmed}`;
};

const getYouTubeEmbedUrl = (url: string) => {
  const normalized = normalizeVideoUrl(url);
  try {
    const parsed = new URL(normalized);
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();

    if (host === "youtu.be") {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (host.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    return "";
  } catch {
    return "";
  }
};

const getThumbnailSrc = (thumbnailUrl?: string) => {
  if (!thumbnailUrl) return "https://via.placeholder.com/400";
  if (/^https?:\/\//i.test(thumbnailUrl) || thumbnailUrl.startsWith("/")) return thumbnailUrl;
  return `/images/${thumbnailUrl}`;
};

const CourseDetail: React.FC = () => {

  const { courseId } = useParams();
  const { currentUser } = useAuth();

  // safely extract user id
  const userId = (currentUser as any)?.user_id;

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [instructorName, setInstructorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());
  const [selectedLecture, setSelectedLecture] = useState<{ title: string; videoUrl: string } | null>(null);

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

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
            order_number,
            video_url
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
            src={getThumbnailSrc(course?.thumbnail_url)}
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
              onClick={() => toggleModule(module.module_id)}
            >
              <strong>{module.module_title}</strong>
            </div>

            {openModules.has(module.module_id) && (

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
                        onClick={() => {
                          const videoUrl = normalizeVideoUrl(lecture.video_url);
                          if (videoUrl) {
                            setSelectedLecture({
                              title: lecture.title,
                              videoUrl
                            });
                            return;
                          }
                          alert("Video URL not available for this lecture yet.");
                        }}
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

      <div style={{ padding: 60, borderTop: "1px solid #333" }}>
    {courseId && <ReviewSection courseId={courseId} />}
</div>

      {selectedLecture && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: 20
          }}
          onClick={() => setSelectedLecture(null)}
        >
          <div
            style={{
              width: "min(980px, 95vw)",
              background: "#111",
              border: "1px solid #333",
              borderRadius: 10,
              padding: 16
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <strong>{selectedLecture.title}</strong>
              <button
                onClick={() => setSelectedLecture(null)}
                style={{ background: "#222", color: "#fff", border: "1px solid #444", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}
              >
                Close
              </button>
            </div>

            {getYouTubeEmbedUrl(selectedLecture.videoUrl) ? (
              <iframe
                title={selectedLecture.title}
                src={getYouTubeEmbedUrl(selectedLecture.videoUrl)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{ width: "100%", aspectRatio: "16 / 9", border: "none", borderRadius: 8 }}
              />
            ) : (
              <video
                controls
                src={selectedLecture.videoUrl}
                style={{ width: "100%", borderRadius: 8, maxHeight: "70vh", background: "#000" }}
              />
            )}
          </div>
        </div>
      )}


    </div>
  );
};

export default CourseDetail;