import React from "react";
import { useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TasksPage from "./pages/TasksPage";
import MessagesPage from "./pages/MessagesPage";
import MembersPage from "./pages/MembersPage";
import ToastContainer from "./components/ToastContainer";
import AuthModal from "./components/UI/AuthModal";

function App() {
  const { page } = useApp();

  return (
    <div className="flex h-screen w-screen bg-gray-50 text-gray-900 antialiased overflow-hidden select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 focus:outline-none">
          {page === "tasks" && <TasksPage />}
          {page === "messages" && <MessagesPage />}
          {page === "members" && <MembersPage />}
        </main>
      </div>

      <ToastContainer />
      <AuthModal />
    </div>
  );
}
export default App