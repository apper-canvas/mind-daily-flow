import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const QuickStats = ({ tasks, notes, meetings }) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const todayMeetings = meetings.filter(meeting => {
    const today = new Date().toISOString().split("T")[0];
    return meeting.date === today;
  }).length;

  const stats = [
    {
      title: "Pending Tasks",
      value: pendingTasks,
      icon: "CheckSquare",
      color: "primary",
      bgColor: "from-primary/5 to-blue-100"
    },
    {
      title: "Completed Tasks",
      value: completedTasks,
      icon: "CheckCircle2",
      color: "success",
      bgColor: "from-success/5 to-green-100"
    },
    {
      title: "Total Notes",
      value: notes.length,
      icon: "FileText",
      color: "info",
      bgColor: "from-info/5 to-indigo-100"
    },
    {
      title: "Today's Meetings",
      value: todayMeetings,
      icon: "Calendar",
      color: "warning",
      bgColor: "from-warning/5 to-yellow-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${stat.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
            
            <div className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm`}>
              <ApperIcon 
                name={stat.icon} 
                size={24} 
                className={`text-${stat.color}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;