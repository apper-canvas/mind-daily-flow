import { toast } from 'react-toastify';

class MeetingService {
  constructor() {
    this.tableName = 'meeting_c';
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
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching meetings:", response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to UI expected format
      const meetings = (response.data || []).map(meeting => ({
        Id: meeting.Id,
        title: meeting.title_c || meeting.Name || "",
        date: meeting.date_c || "",
        time: meeting.time_c || "",
        duration: meeting.duration_c || 30,
        description: meeting.description_c || "",
        createdAt: meeting.created_at_c || ""
      }));
      
      return meetings;
    } catch (error) {
      console.error("Error fetching meetings:", error?.response?.data?.message || error.message);
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
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      const meeting = response.data;
      return {
        Id: meeting.Id,
        title: meeting.title_c || meeting.Name || "",
        date: meeting.date_c || "",
        time: meeting.time_c || "",
        duration: meeting.duration_c || 30,
        description: meeting.description_c || "",
        createdAt: meeting.created_at_c || ""
      };
    } catch (error) {
      console.error(`Error fetching meeting ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  }

  async getTodayMeetings() {
    try {
      if (!this.apperClient) this.initializeApperClient();
      
      const today = new Date().toISOString().split("T")[0];
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        where: [{"FieldName": "date_c", "Operator": "ExactMatch", "Values": [today]}],
        orderBy: [{"fieldName": "time_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        return [];
      }
      
      const meetings = (response.data || []).map(meeting => ({
        Id: meeting.Id,
        title: meeting.title_c || meeting.Name || "",
        date: meeting.date_c || "",
        time: meeting.time_c || "",
        duration: meeting.duration_c || 30,
        description: meeting.description_c || "",
        createdAt: meeting.created_at_c || ""
      }));
      
      return meetings;
    } catch (error) {
      console.error("Error fetching today meetings:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async getUpcoming(days = 7) {
    try {
      const allMeetings = await this.getAll();
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);
      
      return allMeetings.filter(meeting => {
        const meetingDate = new Date(meeting.date);
        return meetingDate >= today && meetingDate <= futureDate;
      }).sort((a, b) => new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time));
    } catch (error) {
      console.error("Error fetching upcoming meetings:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async getByDate(date) {
    try {
      if (!this.apperClient) this.initializeApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        where: [{"FieldName": "date_c", "Operator": "ExactMatch", "Values": [date]}],
        orderBy: [{"fieldName": "time_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        return [];
      }
      
      const meetings = (response.data || []).map(meeting => ({
        Id: meeting.Id,
        title: meeting.title_c || meeting.Name || "",
        date: meeting.date_c || "",
        time: meeting.time_c || "",
        duration: meeting.duration_c || 30,
        description: meeting.description_c || "",
        createdAt: meeting.created_at_c || ""
      }));
      
      return meetings;
    } catch (error) {
      console.error("Error fetching meetings by date:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async create(meetingData) {
    try {
      if (!this.apperClient) this.initializeApperClient();
      
      const params = {
        records: [{
          Name: meetingData.title || "",
          title_c: meetingData.title || "",
          date_c: meetingData.date || "",
          time_c: meetingData.time || "",
          duration_c: parseInt(meetingData.duration) || 30,
          description_c: meetingData.description || "",
          created_at_c: new Date().toISOString()
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
          console.error(`Failed to create ${failed.length} meetings:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            title: created.title_c || created.Name || "",
            date: created.date_c || "",
            time: created.time_c || "",
            duration: created.duration_c || 30,
            description: created.description_c || "",
            createdAt: created.created_at_c || ""
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating meeting:", error?.response?.data?.message || error.message);
      return null;
    }
  }

  async update(id, meetingData) {
    try {
      if (!this.apperClient) this.initializeApperClient();
      
      const updateData = {};
      if (meetingData.title !== undefined) {
        updateData.Name = meetingData.title;
        updateData.title_c = meetingData.title;
      }
      if (meetingData.date !== undefined) updateData.date_c = meetingData.date;
      if (meetingData.time !== undefined) updateData.time_c = meetingData.time;
      if (meetingData.duration !== undefined) updateData.duration_c = parseInt(meetingData.duration);
      if (meetingData.description !== undefined) updateData.description_c = meetingData.description;
      
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
          console.error(`Failed to update ${failed.length} meetings:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            title: updated.title_c || updated.Name || "",
            date: updated.date_c || "",
            time: updated.time_c || "",
            duration: updated.duration_c || 30,
            description: updated.description_c || "",
            createdAt: updated.created_at_c || ""
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating meeting:", error?.response?.data?.message || error.message);
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
          console.error(`Failed to delete ${failed.length} meetings:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting meeting:", error?.response?.data?.message || error.message);
      return false;
    }
  }
}

export default new MeetingService();
export default new MeetingService();