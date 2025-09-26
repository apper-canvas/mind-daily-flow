import notesData from "@/services/mockData/notes.json";

class NoteService {
  constructor() {
    this.storageKey = "dailyflow_notes";
    this.loadFromStorage();
  }

  loadFromStorage() {
    const stored = localStorage.getItem(this.storageKey);
    this.notes = stored ? JSON.parse(stored) : [...notesData];
  }

  saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.notes]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const note = this.notes.find(n => n.Id === parseInt(id));
        resolve(note ? { ...note } : null);
      }, 200);
    });
  }

  async getRecent(limit = 5) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sorted = [...this.notes].sort((a, b) => 
          new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        resolve(sorted.slice(0, limit));
      }, 250);
    });
  }

  async search(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const searchTerm = query.toLowerCase();
        const filtered = this.notes.filter(note =>
          note.title.toLowerCase().includes(searchTerm) ||
          note.content.toLowerCase().includes(searchTerm) ||
          note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
        resolve([...filtered]);
      }, 300);
    });
  }

  async create(noteData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const maxId = Math.max(...this.notes.map(n => n.Id), 0);
        const now = new Date().toISOString();
        const newNote = {
          Id: maxId + 1,
          ...noteData,
          createdAt: now,
          updatedAt: now,
          tags: noteData.tags || []
        };
        this.notes.push(newNote);
        this.saveToStorage();
        resolve({ ...newNote });
      }, 400);
    });
  }

  async update(id, noteData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.notes.findIndex(n => n.Id === parseInt(id));
        if (index !== -1) {
          this.notes[index] = { 
            ...this.notes[index], 
            ...noteData,
            updatedAt: new Date().toISOString()
          };
          this.saveToStorage();
          resolve({ ...this.notes[index] });
        } else {
          resolve(null);
        }
      }, 350);
    });
  }

  async delete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.notes.findIndex(n => n.Id === parseInt(id));
        if (index !== -1) {
          this.notes.splice(index, 1);
          this.saveToStorage();
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }
}

export default new NoteService();