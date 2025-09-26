import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const MeetingCard = ({ meeting, onEdit, onDelete }) => {
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, "h:mm a");
  };

  const getMeetingStatus = () => {
    const meetingDateTime = new Date(`${meeting.date}T${meeting.time}`);
    const now = new Date();
    const endTime = new Date(meetingDateTime.getTime() + (meeting.duration * 60000));

    if (now < meetingDateTime) {
      return { status: "upcoming", variant: "primary", icon: "Clock" };
    } else if (now >= meetingDateTime && now <= endTime) {
      return { status: "ongoing", variant: "warning", icon: "Play" };
    } else {
      return { status: "completed", variant: "success", icon: "CheckCircle2" };
    }
  };

  const statusConfig = getMeetingStatus();

  return (
    <div className="card hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            {meeting.title}
          </h3>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <ApperIcon name="Calendar" size={14} className="mr-1" />
              {format(new Date(meeting.date), "MMM d")}
            </div>
            
            <div className="flex items-center">
              <ApperIcon name="Clock" size={14} className="mr-1" />
              {formatTime(meeting.time)}
            </div>
            
            <div className="flex items-center">
              <ApperIcon name="Timer" size={14} className="mr-1" />
              {meeting.duration}m
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant={statusConfig.variant} size="xs">
            <ApperIcon name={statusConfig.icon} size={10} className="mr-1" />
            {statusConfig.status}
          </Badge>

          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(meeting)}
              className="p-1.5 hover:bg-primary/10 hover:text-primary"
            >
              <ApperIcon name="Edit2" size={14} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(meeting.Id)}
              className="p-1.5 hover:bg-error/10 hover:text-error"
            >
              <ApperIcon name="Trash2" size={14} />
            </Button>
          </div>
        </div>
      </div>

      {meeting.description && (
        <p className="text-gray-600 text-sm leading-relaxed">
          {meeting.description}
        </p>
      )}
    </div>
  );
};

export default MeetingCard;