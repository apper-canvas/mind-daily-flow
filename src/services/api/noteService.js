import { toast } from 'react-toastify';

class NoteService {
  constructor() {
    this.tableName = 'note_c';
    this.apperClient = null;
    this.initializeApperClient();
  }

  initializeApperClient() {
    if (window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "tags_c"}}
        ],
        orderBy: [{"fieldName": "updated_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching notes:", response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to UI expected format
      const notes = (response.data || []).map(note => ({
        Id: note.Id,
        title: note.title_c || note.Name || "",
        content: note.content_c || "",
        createdAt: note.created_at_c || "",
        updatedAt: note.updated_at_c || "",
        tags: note.tags_c ? note.tags_c.split(",").map(tag => tag.trim()).filter(tag => tag) : []
      }));
      
      return notes;
    } catch (error) {
      console.error("Error fetching notes:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "tags_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      const note = response.data;
      return {
        Id: note.Id,
        title: note.title_c || note.Name || "",
        content: note.content_c || "",
        createdAt: note.created_at_c || "",
        updatedAt: note.updated_at_c || "",
        tags: note.tags_c ? note.tags_c.split(",").map(tag => tag.trim()).filter(tag => tag) : []
      };
    } catch (error) {
      console.error(`Error fetching note ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  }

  async getRecent(limit = 5) {
    try {
      if (!this.apperClient) this.initializeApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "tags_c"}}
        ],
        orderBy: [{"fieldName": "updated_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        return [];
      }
      
      const notes = (response.data || []).map(note => ({
        Id: note.Id,
        title: note.title_c || note.Name || "",
        content: note.content_c || "",
        createdAt: note.created_at_c || "",
        updatedAt: note.updated_at_c || "",
        tags: note.tags_c ? note.tags_c.split(",").map(tag => tag.trim()).filter(tag => tag) : []
      }));
      
      return notes;
    } catch (error) {
      console.error("Error fetching recent notes:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async search(query) {
    try {
      const allNotes = await this.getAll();
      
      if (!query) return allNotes;
      
      const searchTerm = query.toLowerCase();
      return allNotes.filter(note =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    } catch (error) {
      console.error("Error searching notes:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async create(noteData) {
    try {
      if (!this.apperClient) this.initializeApperClient();
      
      const now = new Date().toISOString();
      const params = {
        records: [{
          Name: noteData.title || "",
          title_c: noteData.title || "",
          content_c: noteData.content || "",
          created_at_c: now,
          updated_at_c: now,
          tags_c: Array.isArray(noteData.tags) ? noteData.tags.join(",") : ""
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} notes:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            title: created.title_c || created.Name || "",
            content: created.content_c || "",
            createdAt: created.created_at_c || "",
            updatedAt: created.updated_at_c || "",
            tags: created.tags_c ? created.tags_c.split(",").map(tag => tag.trim()).filter(tag => tag) : []
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating note:", error?.response?.data?.message || error.message);
      return null;
    }
  }

  async update(id, noteData) {
    try {
      if (!this.apperClient) this.initializeApperClient();
      
      const updateData = {};
      if (noteData.title !== undefined) {
        updateData.Name = noteData.title;
        updateData.title_c = noteData.title;
      }
      if (noteData.content !== undefined) updateData.content_c = noteData.content;
      if (noteData.tags !== undefined) {
        updateData.tags_c = Array.isArray(noteData.tags) ? noteData.tags.join(",") : "";
      }
      updateData.updated_at_c = new Date().toISOString();
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} notes:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            title: updated.title_c || updated.Name || "",
            content: updated.content_c || "",
            createdAt: updated.created_at_c || "",
            updatedAt: updated.updated_at_c || "",
            tags: updated.tags_c ? updated.tags_c.split(",").map(tag => tag.trim()).filter(tag => tag) : []
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating note:", error?.response?.data?.message || error.message);
      return null;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeApperClient();
      
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} notes:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting note:", error?.response?.data?.message || error.message);
      return false;
    }
  }
}

export default new NoteService();