import { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/organisms/Header";
import TaskModal from "@/components/organisms/TaskModal";
import NoteModal from "@/components/organisms/NoteModal";
import MeetingModal from "@/components/organisms/MeetingModal";

const Layout = ({ children }) => {
  const [modalState, setModalState] = useState({
    taskModal: false,
    noteModal: false,
    meetingModal: false,
    editingItem: null
  });
  
  const location = useLocation();

  const handleAddClick = () => {
    switch (location.pathname) {
      case "/tasks":
        setModalState(prev => ({ ...prev, taskModal: true }));
        break;
      case "/notes":
        setModalState(prev => ({ ...prev, noteModal: true }));
        break;
      case "/meetings":
        setModalState(prev => ({ ...prev, meetingModal: true }));
        break;
      default:
        setModalState(prev => ({ ...prev, taskModal: true }));
    }
  };

  const closeModals = () => {
    setModalState({
      taskModal: false,
      noteModal: false,
      meetingModal: false,
      editingItem: null
    });
  };

  const openEditModal = (type, item) => {
    setModalState({
      taskModal: type === "task",
      noteModal: type === "note",
      meetingModal: type === "meeting",
      editingItem: item
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddClick={handleAddClick} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="min-h-[calc(100vh-8rem)]">
          {children}
        </div>
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={modalState.taskModal}
        onClose={closeModals}
        task={modalState.editingItem}
      />

      <NoteModal
        isOpen={modalState.noteModal}
        onClose={closeModals}
        note={modalState.editingItem}
      />

      <MeetingModal
        isOpen={modalState.meetingModal}
        onClose={closeModals}
        meeting={modalState.editingItem}
      />
    </div>
  );
};

export default Layout;