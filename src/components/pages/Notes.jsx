import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import FilterBar from "@/components/molecules/FilterBar";
import NoteCard from "@/components/molecules/NoteCard";
import NoteModal from "@/components/organisms/NoteModal";
import noteService from "@/services/api/noteService";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadNotes = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await noteService.getAll();
      setNotes(data);
    } catch (err) {
      setError("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleEdit = (note) => {
    setEditingNote(note);
    setShowModal(true);
  };

  const handleDelete = async (noteId) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await noteService.delete(noteId);
      toast.success("Note deleted successfully!");
      loadNotes();
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNote(null);
    loadNotes();
  };

  const getFilteredNotes = () => {
    let filtered = [...notes];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort by update date (newest first)
    return filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  };

  const clearFilters = () => {
    setSearchQuery("");
  };

  const filteredNotes = getFilteredNotes();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
        <Loading type="notes" />
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadNotes} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
          <p className="text-gray-600 mt-1">
            Capture and organize your thoughts and ideas
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <div className="bg-gradient-to-r from-surface to-gray-100 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {notes.length}
            </div>
            <div className="text-sm text-gray-600">Total Notes</div>
          </div>
        </div>
      </div>

      <FilterBar
        type="notes"
        onClearFilters={clearFilters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {filteredNotes.length === 0 ? (
          <Empty 
            type="notes"
            title={searchQuery ? "No notes found" : "No notes yet"}
            message={
              searchQuery 
                ? "Try adjusting your search to find notes."
                : "Capture your thoughts and ideas by creating your first note!"
            }
            onAction={() => setShowModal(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.Id}
                note={note}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <NoteModal
        isOpen={showModal}
        onClose={closeModal}
        note={editingNote}
      />
    </div>
  );
};

export default Notes;