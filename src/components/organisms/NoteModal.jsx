import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import noteService from "@/services/api/noteService";

const NoteModal = ({ isOpen, onClose, note = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (note) {
        setFormData({
          title: note.title || "",
          content: note.content || "",
          tags: note.tags ? note.tags.join(", ") : ""
        });
      } else {
        setFormData({
          title: "",
          content: "",
          tags: ""
        });
      }
      setErrors({});
    }
  }, [isOpen, note]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const noteData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: formData.tags 
          ? formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
          : []
      };

      if (note) {
        await noteService.update(note.Id, noteData);
        toast.success("Note updated successfully!");
      } else {
        await noteService.create(noteData);
        toast.success("Note created successfully!");
      }
      onClose();
      // Trigger a page refresh to show updated data
      window.location.reload();
    } catch (error) {
      toast.error("Failed to save note. Please try again.");
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {note ? "Edit Note" : "Create New Note"}
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
            label="Note Title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            error={errors.title}
            placeholder="Enter note title..."
            required
          />

          <Textarea
            label="Content"
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            error={errors.content}
            placeholder="Write your note content..."
            rows={8}
            required
          />

          <Input
            label="Tags"
            value={formData.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
            placeholder="Enter tags separated by commas (e.g., work, ideas, important)"
            helperText="Tags help you organize and find your notes quickly"
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
                  <ApperIcon name="Save" size={16} />
                  <span>{note ? "Update Note" : "Create Note"}</span>
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

export default NoteModal;