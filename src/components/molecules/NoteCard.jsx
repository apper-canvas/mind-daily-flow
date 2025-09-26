import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const NoteCard = ({ note, onEdit, onDelete }) => {
  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="card hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex-1 mr-4">
          {note.title}
        </h3>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(note)}
            className="p-1.5 hover:bg-primary/10 hover:text-primary"
          >
            <ApperIcon name="Edit2" size={14} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(note.Id)}
            className="p-1.5 hover:bg-error/10 hover:text-error"
          >
            <ApperIcon name="Trash2" size={14} />
          </Button>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {truncateContent(note.content)}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {note.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="primary" size="xs">
              {tag}
            </Badge>
          ))}
          {note.tags.length > 3 && (
            <Badge variant="default" size="xs">
              +{note.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center text-xs text-gray-500">
          <ApperIcon name="Clock" size={12} className="mr-1" />
          {format(new Date(note.updatedAt), "MMM d, h:mm a")}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;