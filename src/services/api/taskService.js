import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    this.tableName = 'task_c';
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
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching tasks:", response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to UI expected format
      const tasks = (response.data || []).map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name || "",
        description: task.description_c || "",
        completed: task.completed_c || false,
        priority: task.priority_c || "medium",
        dueDate: task.due_date_c || "",
        createdAt: task.created_at_c || ""
      }));
      
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error.message);
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
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || task.Name || "",
        description: task.description_c || "",
        completed: task.completed_c || false,
        priority: task.priority_c || "medium",
        dueDate: task.due_date_c || "",
        createdAt: task.created_at_c || ""
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  }

  async getTodayTasks() {
    try {
      if (!this.apperClient) this.initializeApperClient();
      
      const today = new Date().toISOString().split("T")[0];
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        where: [{"FieldName": "due_date_c", "Operator": "ExactMatch", "Values": [today]}],
        orderBy: [{"fieldName": "priority_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        return [];
      }
      
      const tasks = (response.data || []).map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name || "",
        description: task.description_c || "",
        completed: task.completed_c || false,
        priority: task.priority_c || "medium",
        dueDate: task.due_date_c || "",
        createdAt: task.created_at_c || ""
      }));
      
      return tasks;
    } catch (error) {
      console.error("Error fetching today tasks:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async getByStatus(status) {
    try {
      const allTasks = await this.getAll();
      
      if (status === "completed") {
        return allTasks.filter(task => task.completed);
      } else if (status === "pending") {
        return allTasks.filter(task => !task.completed);
      }
      
      return allTasks;
    } catch (error) {
      console.error("Error filtering tasks by status:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async getByPriority(priority) {
    try {
      const allTasks = await this.getAll();
      
      if (priority === "all") {
        return allTasks;
      }
      
      return allTasks.filter(task => task.priority === priority);
    } catch (error) {
      console.error("Error filtering tasks by priority:", error?.response?.data?.message || error.message);
      return [];
    }
  }

  async create(taskData) {
    try {
      if (!this.apperClient) this.initializeApperClient();
      
      const params = {
        records: [{
          Name: taskData.title || "",
          title_c: taskData.title || "",
          description_c: taskData.description || "",
          completed_c: false,
          priority_c: taskData.priority || "medium",
          due_date_c: taskData.dueDate || "",
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
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            title: created.title_c || created.Name || "",
            description: created.description_c || "",
            completed: created.completed_c || false,
            priority: created.priority_c || "medium",
            dueDate: created.due_date_c || "",
            createdAt: created.created_at_c || ""
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error.message);
      return null;
    }
  }

  async update(id, taskData) {
    try {
      if (!this.apperClient) this.initializeApperClient();
      
      const updateData = {};
      if (taskData.title !== undefined) {
        updateData.Name = taskData.title;
        updateData.title_c = taskData.title;
      }
      if (taskData.description !== undefined) updateData.description_c = taskData.description;
      if (taskData.completed !== undefined) updateData.completed_c = taskData.completed;
      if (taskData.priority !== undefined) updateData.priority_c = taskData.priority;
      if (taskData.dueDate !== undefined) updateData.due_date_c = taskData.dueDate;
      
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
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            title: updated.title_c || updated.Name || "",
            description: updated.description_c || "",
            completed: updated.completed_c || false,
            priority: updated.priority_c || "medium",
            dueDate: updated.due_date_c || "",
            createdAt: updated.created_at_c || ""
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error.message);
      return null;
    }
  }

  async toggleComplete(id) {
    try {
      const task = await this.getById(id);
      if (!task) return null;
      
      return await this.update(id, { completed: !task.completed });
    } catch (error) {
      console.error("Error toggling task completion:", error?.response?.data?.message || error.message);
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
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error.message);
      return false;
    }
  }
}

export default new TaskService();