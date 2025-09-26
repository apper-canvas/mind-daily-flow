import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import meetingService from "@/services/api/meetingService";

const MeetingModal = ({ isOpen, onClose, meeting = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    duration: 30,
    description: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (meeting) {
        setFormData({
          title: meeting.title || "",
          date: meeting.date || "",
          time: meeting.time || "",
          duration: meeting.duration || 30,
          description: meeting.description || ""
        });
      } else {
        const today = new Date().toISOString().split("T")[0];
        const currentHour = new Date().getHours();
        const nextHour = (currentHour + 1).toString().padStart(2, "0");
        
        setFormData({
          title: "",
          date: today,
          time: `${nextHour}:00`,
          duration: 30,
          description: ""
        });
      }
      setErrors({});
    }
  }, [isOpen, meeting]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Meeting title is required";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    
    if (!formData.time) {
      newErrors.time = "Time is required";
    }
    
    if (formData.duration < 15) {
      newErrors.duration = "Duration must be at least 15 minutes";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const meetingData = {
        title: formData.title.trim(),
        date: formData.date,
        time: formData.time,
        duration: parseInt(formData.duration),
        description: formData.description.trim()
      };

      if (meeting) {
        await meetingService.update(meeting.Id, meetingData);
        toast.success("Meeting updated successfully!");
      } else {
        await meetingService.create(meetingData);
        toast.success("Meeting scheduled successfully!");
      }
      onClose();
      // Trigger a page refresh to show updated data
      window.location.reload();
    } catch (error) {
      toast.error("Failed to save meeting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {meeting ? "Edit Meeting" : "Schedule New Meeting"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Meeting Title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            error={errors.title}
            placeholder="Enter meeting title..."
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              error={errors.date}
              required
            />

            <Input
              label="Time"
              type="time"
              value={formData.time}
              onChange={(e) => handleChange("time", e.target.value)}
              error={errors.time}
              required
            />
          </div>

          <Input
            label="Duration (minutes)"
            type="number"
            min="15"
            step="15"
            value={formData.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            error={errors.duration}
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Add meeting details, agenda, or notes (optional)..."
            rows={3}
          />

          <div className="flex items-center space-x-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Calendar" size={16} />
                  <span>{meeting ? "Update Meeting" : "Schedule Meeting"}</span>
                </div>
              )}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingModal;