import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

// ADMIN
import AdminDashboard from "./admin/AdminDashboard";
import AdminQuestions from "./admin/AdminQuestions";

// STUDENT
import StudentDashboard from "./student/StudentDashboard";
import Quiz from "./student/Quiz";
import Result from "./student/Result";
import Analysis from "./student/Analysis";
import History from "./student/History";
import Leaderboard from "./student/Leaderboard";

import SidebarLayout from "./layout/SidebarLayout";
import AdminSidebarLayout from "./layout/AdminSidebarLayout";
import QuizList from "./student/QuizList";
import QuizDetail from "./student/QuizDetail";
import AdminTests from "./admin/AdminTests";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ AUTH (NO SIDEBAR) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ PROTECTED ROUTES (WITH SIDEBAR) */}

        <Route element={<SidebarLayout />}>
          {/* STUDENT */}
          <Route path="/student" element={<StudentDashboard />} />

          <Route path="/quiz" element={<QuizList />} />
          <Route path="/quiz/:testId" element={<QuizDetail />} />


          <Route path="/quiz/:testId/start" element={<Quiz />} />
          <Route path="/result" element={<Result />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/history" element={<History />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>

        {/* ADMIN 🔥 */}
        <Route element={<AdminSidebarLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/questions" element={<AdminQuestions />} />
          <Route path="/admin/tests" element={<AdminTests />} />
        </Route>


      </Routes>
    </BrowserRouter>
  );
}

export default App;