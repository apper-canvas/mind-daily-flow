import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import QuickStats from "@/components/molecules/QuickStats";
import TaskCard from "@/components/molecules/TaskCard";
import NoteCard from "@/components/molecules/NoteCard";
import MeetingCard from "@/components/molecules/MeetingCard";
import TaskModal from "@/components/organisms/TaskModal";
import NoteModal from "@/components/organisms/NoteModal";
import MeetingModal from "@/components/organisms/MeetingModal";
import taskService from "@/services/api/taskService";
import noteService from "@/services/api/noteService";
import meetingService from "@/services/api/meetingService";

const Dashboard = () => {
  const [data, setData] = useState({
    tasks: [],
    notes: [],
    meetings: [],
    todayTasks: [],
    todayMeetings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalState, setModalState] = useState({
    taskModal: false,
    noteModal: false,
    meetingModal: false,
    editingItem: null
  });

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [allTasks, recentNotes, allMeetings, todayTasks, todayMeetings] = await Promise.all([
        taskService.getAll(),
        noteService.getRecent(3),
        meetingService.getAll(),
        taskService.getTodayTasks(),
        meetingService.getTodayMeetings()
      ]);

      setData({
        tasks: allTasks,
        notes: recentNotes,
        meetings: allMeetings,
        todayTasks,
        todayMeetings
      });
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleTaskToggle = async (taskId) => {
    try {
      await taskService.toggleComplete(taskId);
      toast.success("Task updated successfully!");
      loadDashboardData();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      switch (type) {
        case "task":
          await taskService.delete(id);
          break;
        case "note":
          await noteService.delete(id);
          break;
        case "meeting":
          await meetingService.delete(id);
          break;
      }
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
      loadDashboardData();
    } catch (error) {
      toast.error(`Failed to delete ${type}`);
    }
  };

  const openEditModal = (type, item) => {
    setModalState({
      taskModal: type === "task",
      noteModal: type === "note",
      meetingModal: type === "meeting",
      editingItem: item
    });
  };

  const closeModals = () => {
    setModalState({
      taskModal: false,
      noteModal: false,
      meetingModal: false,
      editingItem: null
    });
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Loading type="tasks" />
          <Loading type="notes" />
          <Loading type="meetings" />
        </div>
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Your Daily Flow
        </h1>
        <p className="text-gray-600 flex items-center justify-center lg:justify-start">
          <ApperIcon name="Calendar" size={16} className="mr-2" />
          {today}
        </p>
      </div>

      {/* Quick Stats */}
      <QuickStats 
        tasks={data.tasks} 
        notes={data.notes} 
        meetings={data.meetings} 
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Tasks */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ApperIcon name="CheckSquare" size={20} className="mr-2 text-primary" />
              Today's Tasks
            </h2>
            <Button
              size="sm"
              onClick={() => setModalState(prev => ({ ...prev, taskModal: true }))}
              className="flex items-center space-x-1"
            >
              <ApperIcon name="Plus" size={14} />
              <span>Add</span>
            </Button>
          </div>

          <div className="space-y-3">
            {data.todayTasks.length === 0 ? (
              <Empty 
                type="tasks" 
                title="No tasks for today"
                message="You're all caught up! Add a task to stay productive."
                onAction={() => setModalState(prev => ({ ...prev, taskModal: true }))}
              />
            ) : (
              data.todayTasks.map((task) => (
                <TaskCard
                  key={task.Id}
                  task={task}
                  onToggleComplete={handleTaskToggle}
                  onEdit={(task) => openEditModal("task", task)}
                  onDelete={(id) => handleDelete("task", id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Recent Notes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ApperIcon name="FileText" size={20} className="mr-2 text-info" />
              Recent Notes
            </h2>
            <Button
              size="sm"
              onClick={() => setModalState(prev => ({ ...prev, noteModal: true }))}
              className="flex items-center space-x-1"
            >
              <ApperIcon name="Plus" size={14} />
              <span>Add</span>
            </Button>
          </div>

          <div className="space-y-3">
            {data.notes.length === 0 ? (
              <Empty 
                type="notes"
                title="No notes yet"
                message="Capture your thoughts and ideas with your first note."
                onAction={() => setModalState(prev => ({ ...prev, noteModal: true }))}
              />
            ) : (
              data.notes.map((note) => (
                <NoteCard
                  key={note.Id}
                  note={note}
                  onEdit={(note) => openEditModal("note", note)}
                  onDelete={(id) => handleDelete("note", id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Today's Meetings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ApperIcon name="Calendar" size={20} className="mr-2 text-warning" />
              Today's Meetings
            </h2>
            <Button
              size="sm"
              onClick={() => setModalState(prev => ({ ...prev, meetingModal: true }))}
              className="flex items-center space-x-1"
            >
              <ApperIcon name="Plus" size={14} />
              <span>Add</span>
            </Button>
          </div>

          <div className="space-y-3">
            {data.todayMeetings.length === 0 ? (
              <Empty 
                type="meetings"
                title="No meetings today"
                message="Your calendar is clear! Schedule a meeting if needed."
                onAction={() => setModalState(prev => ({ ...prev, meetingModal: true }))}
              />
            ) : (
              data.todayMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.Id}
                  meeting={meeting}
                  onEdit={(meeting) => openEditModal("meeting", meeting)}
                  onDelete={(id) => handleDelete("meeting", id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

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

export default Dashboard;