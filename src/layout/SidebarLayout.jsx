import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

function SidebarLayout() {
  const navigate = useNavigate();
  const name = localStorage.getItem("studentName");

  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);

  // 🔥 disable scroll when modal open
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showModal]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex">

      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-gray-900 text-white flex justify-between items-center p-4 z-50">
        <h2 className="font-bold">🎯 TestSeries</h2>
        <button onClick={() => setOpen(!open)}>
          {open ? "✖" : "☰"}
        </button>
      </div>

      {/* OVERLAY (mobile sidebar) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 
  bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 
  text-white flex flex-col justify-between p-5 z-50 shadow-2xl
  transform transition-transform duration-300
  ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >

        {/* TOP */}
        <div>
          <div className="flex justify-between items-center md:hidden mb-6">
            <h2 className="font-bold">Menu</h2>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <h2 className="text-xl font-bold mb-6 hidden md:flex items-center gap-2">
            🎯 <span className="tracking-wide">TestSeries</span>
          </h2>

          <div className="mb-6 flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="w-11 h-11 transition-transform hover:scale-110 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md flex items-center justify-center font-bold text-lg">
              {name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{name}</p>
              <p className="text-xs text-gray-400">Student</p>
            </div>
          </div>
          <nav className="flex flex-col gap-3">

            <NavLink
              to="/student"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                  ? "bg-blue-500 border-l-4 border-white"
                  : "hover:bg-gray-700"
                }`
              }
            >
              🏠 Dashboard
            </NavLink>

            <NavLink
              to="/quiz"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                  ? "bg-blue-500 border-l-4 border-white"
                  : "hover:bg-gray-700"
                }`
              }
            >
              📝 Quiz
            </NavLink>

            <NavLink
              to="/leaderboard"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                  ? "bg-blue-500 border-l-4 border-white"
                  : "hover:bg-gray-700"
                }`
              }
            >
              🏆 Leaderboard
            </NavLink>

            <NavLink
              to="/history"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                  ? "bg-blue-500 border-l-4 border-white"
                  : "hover:bg-gray-700"
                }`
              }
            >
              📜 History
            </NavLink>

          </nav>
        </div>

        {/* LOGOUT */}
        <button
          onClick={() => setShowModal(true)}
          className=" bg-red-500/90 backdrop-blur hover:bg-red-600 hover:shadow-red-500/30 px-3 py-3 rounded-xl hover:scale-105 transition w-full shadow-lg font-semibold"
        >
          Logout 🚪
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 bg-gradient-to-br from-gray-100 via-blue-50 to-blue-100 min-h-screen p-6 pt-20 md:pt-6 md:ml-64">
        <Outlet />
      </div>

      {/* 🔥 LOGOUT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex">

          {/* sidebar space */}
          <div className="w-72 hidden md:block"></div>

          {/* overlay */}
          <div
            onClick={() => setShowModal(false)}
            className="flex-1 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl border p-6 w-80 text-center animate-[fadeIn_0.2s_ease]"
            >
              <h2 className="text-lg font-semibold mb-4">
                🚪 Confirm Logout
              </h2>

              <p className="text-gray-500 mb-6">
                Are you sure you want to logout?
              </p>

              <div className="flex justify-center gap-4">

                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Yes
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default SidebarLayout;