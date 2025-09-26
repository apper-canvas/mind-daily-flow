import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import FilterBar from "@/components/molecules/FilterBar";
import TaskCard from "@/components/molecules/TaskCard";
import TaskModal from "@/components/organisms/TaskModal";
import taskService from "@/services/api/taskService";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleTaskToggle = async (taskId) => {
    try {
      await taskService.toggleComplete(taskId);
      toast.success("Task updated successfully!");
      loadTasks();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await taskService.delete(taskId);
      toast.success("Task deleted successfully!");
      loadTasks();
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    loadTasks();
  };

  const getFilteredTasks = () => {
    let filtered = [...tasks];

    // Status filter
    if (statusFilter === "completed") {
      filtered = filtered.filter(task => task.completed);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter(task => !task.completed);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }

    // Sort by creation date (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setSearchQuery("");
  };

  const filteredTasks = getFilteredTasks();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
        <Loading type="tasks" />
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadTasks} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">
            Manage your tasks and stay productive
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <div className="bg-gradient-to-r from-surface to-gray-100 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {tasks.filter(t => !t.completed).length}
            </div>
            <div className="text-sm text-gray-600">Pending Tasks</div>
          </div>
        </div>
      </div>

      <FilterBar
        type="tasks"
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onClearFilters={clearFilters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {filteredTasks.length === 0 ? (
          <Empty 
            type="tasks"
            title={searchQuery ? "No tasks found" : "No tasks yet"}
            message={
              searchQuery 
                ? "Try adjusting your search or filters to find tasks."
                : "Create your first task to get started with your productivity journey!"
            }
            onAction={() => setShowModal(true)}
          />
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.Id}
                task={task}
                onToggleComplete={handleTaskToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <TaskModal
        isOpen={showModal}
        onClose={closeModal}
        task={editingTask}
      />
    </div>
  );
};

export default Tasks;