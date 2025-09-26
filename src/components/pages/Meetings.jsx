import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import FilterBar from "@/components/molecules/FilterBar";
import MeetingCard from "@/components/molecules/MeetingCard";
import MeetingModal from "@/components/organisms/MeetingModal";
import meetingService from "@/services/api/meetingService";

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadMeetings = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await meetingService.getAll();
      setMeetings(data);
    } catch (err) {
      setError("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setShowModal(true);
  };

  const handleDelete = async (meetingId) => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;

    try {
      await meetingService.delete(meetingId);
      toast.success("Meeting deleted successfully!");
      loadMeetings();
    } catch (error) {
      toast.error("Failed to delete meeting");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMeeting(null);
    loadMeetings();
  };

  const getFilteredMeetings = () => {
    let filtered = [...meetings];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(meeting =>
        meeting.title.toLowerCase().includes(query) ||
        (meeting.description && meeting.description.toLowerCase().includes(query))
      );
    }

    // Sort by date and time (upcoming first, then by date)
    return filtered.sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`);
      const dateTimeB = new Date(`${b.date}T${b.time}`);
      return dateTimeA - dateTimeB;
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
  };

  const getTodayMeetingsCount = () => {
    const today = new Date().toISOString().split("T")[0];
    return meetings.filter(meeting => meeting.date === today).length;
  };

  const filteredMeetings = getFilteredMeetings();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
        <Loading type="meetings" />
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadMeetings} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-600 mt-1">
            Schedule and manage your meetings
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-surface to-gray-100 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {getTodayMeetingsCount()}
            </div>
            <div className="text-sm text-gray-600">Today</div>
          </div>
          
          <div className="bg-gradient-to-r from-surface to-gray-100 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {meetings.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>

      <FilterBar
        type="meetings"
        onClearFilters={clearFilters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {filteredMeetings.length === 0 ? (
          <Empty 
            type="meetings"
            title={searchQuery ? "No meetings found" : "No meetings scheduled"}
            message={
              searchQuery 
                ? "Try adjusting your search to find meetings."
                : "Schedule your first meeting to stay organized and productive!"
            }
            onAction={() => setShowModal(true)}
          />
        ) : (
          <div className="space-y-4">
            {filteredMeetings.map((meeting) => (
              <MeetingCard
                key={meeting.Id}
                meeting={meeting}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <MeetingModal
        isOpen={showModal}
        onClose={closeModal}
        meeting={editingMeeting}
      />
    </div>
  );
};

export default Meetings;