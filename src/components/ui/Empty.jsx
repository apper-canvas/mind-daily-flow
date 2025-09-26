import ApperIcon from "@/components/ApperIcon";

const Empty = ({ type = "data", title, message, action, onAction }) => {
  const getEmptyConfig = () => {
    switch (type) {
      case "tasks":
        return {
          icon: "CheckCircle2",
          title: title || "No tasks yet",
          message: message || "Create your first task to get started with your productivity journey!",
          action: action || "Add Task"
        };
      case "notes":
        return {
          icon: "FileText",
          title: title || "No notes yet",
          message: message || "Capture your thoughts and ideas by creating your first note!",
          action: action || "Add Note"
        };
      case "meetings":
        return {
          icon: "Calendar",
          title: title || "No meetings scheduled",
          message: message || "Schedule your first meeting to stay organized and productive!",
          action: action || "Add Meeting"
        };
      default:
        return {
          icon: "Inbox",
          title: title || "No data available",
          message: message || "There's nothing here yet. Start by adding some content!",
          action: action || "Get Started"
        };
    }
  };

  const config = getEmptyConfig();

  return (
    <div className="text-center py-12">
      <div className="bg-gradient-to-br from-surface to-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <ApperIcon name={config.icon} className="h-10 w-10 text-secondary" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{config.title}</h3>
      <p className="text-gray-600 mb-8 max-w-sm mx-auto leading-relaxed">
        {config.message}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>{config.action}</span>
        </button>
      )}
    </div>
  );
};

export default Empty;