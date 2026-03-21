import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";

interface Course {
  course_id: string;
  title: string;
  description: string;
  price: number;
}

const StudentDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*");

      if (error) {
        console.error("Error fetching courses:", error);
      } else {
        console.log("Courses from DB:", data);
        setCourses(data || []);
      }

      setLoading(false);
    };

    fetchCourses();
  }, []);

  return (
    <div style={{ padding: "2rem", color: "#fff", background: "#000", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Student Dashboard</h1>
        <button onClick={logout} style={{ padding: "8px 16px", borderRadius: "8px", cursor: "pointer", background: "#333", color: "#fff", border: "none" }}>
          Logout
        </button>
      </div>

      <h2>Welcome back, {currentUser?.name}!</h2>

      <h2 style={{ marginTop: "2rem" }}>Available Courses</h2>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
          {courses.map((course) => (
            <div key={course.course_id} style={{ background: "#111", padding: "1.5rem", borderRadius: "8px", border: "1px solid #333" }}>
              
              <h3>{course.title}</h3>
              <p style={{ color: "#aaa", fontSize: "0.9rem" }}>
                {course.description}
              </p>

              <p style={{ marginTop: "0.5rem", fontWeight: "bold" }}>
                ₹{course.price}
              </p>

              <button
                style={{
                  marginTop: "1rem",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                View Course
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;