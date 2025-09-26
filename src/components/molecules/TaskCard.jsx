import { useState } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    await onToggleComplete(task.Id);
    setIsCompleting(false);
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "high":
        return { variant: "error", icon: "AlertCircle", text: "High" };
      case "medium":
        return { variant: "warning", icon: "Clock", text: "Medium" };
      case "low":
        return { variant: "success", icon: "CheckCircle2", text: "Low" };
      default:
        return { variant: "default", icon: "Circle", text: "Normal" };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={`card hover:shadow-lg transition-all duration-300 ${
      task.completed ? "bg-gradient-to-br from-green-50 to-emerald-50" : ""
    } priority-${task.priority}`}>
      <div className="flex items-start space-x-4">
        <button
          onClick={handleToggleComplete}
          disabled={isCompleting}
          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            task.completed
              ? "bg-gradient-to-r from-success to-green-600 border-success text-white"
              : "border-gray-300 hover:border-primary hover:bg-primary/5"
          } ${isCompleting ? "animate-pulse" : ""}`}
        >
          {task.completed && <ApperIcon name="Check" size={12} />}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold mb-2 ${
            task.completed ? "text-gray-600 line-through" : "text-gray-900"
          }`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={`text-sm mb-3 ${
              task.completed ? "text-gray-500" : "text-gray-600"
            }`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge variant={priorityConfig.variant} size="xs">
                <ApperIcon name={priorityConfig.icon} size={10} className="mr-1" />
                {priorityConfig.text}
              </Badge>
              
              <div className={`flex items-center text-xs ${
                isOverdue ? "text-error font-medium" : "text-gray-500"
              }`}>
                <ApperIcon name="Calendar" size={12} className="mr-1" />
                {format(new Date(task.dueDate), "MMM d")}
                {isOverdue && (
                  <Badge variant="error" size="xs" className="ml-2">
                    Overdue
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="p-1.5 hover:bg-primary/10 hover:text-primary"
              >
                <ApperIcon name="Edit2" size={14} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.Id)}
                className="p-1.5 hover:bg-error/10 hover:text-error"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;