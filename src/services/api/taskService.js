import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.storageKey = "dailyflow_tasks";
    this.loadFromStorage();
  }

  loadFromStorage() {
    const stored = localStorage.getItem(this.storageKey);
    this.tasks = stored ? JSON.parse(stored) : [...tasksData];
  }

  saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.tasks]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const task = this.tasks.find(t => t.Id === parseInt(id));
        resolve(task ? { ...task } : null);
      }, 200);
    });
  }

  async getTodayTasks() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = new Date().toISOString().split("T")[0];
        const todayTasks = this.tasks.filter(task => task.dueDate === today);
        resolve([...todayTasks]);
      }, 250);
    });
  }

  async getByStatus(status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredTasks;
        if (status === "completed") {
          filteredTasks = this.tasks.filter(task => task.completed);
        } else if (status === "pending") {
          filteredTasks = this.tasks.filter(task => !task.completed);
        } else {
          filteredTasks = this.tasks;
        }
        resolve([...filteredTasks]);
      }, 300);
    });
  }

  async getByPriority(priority) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredTasks = priority === "all" 
          ? this.tasks 
          : this.tasks.filter(task => task.priority === priority);
        resolve([...filteredTasks]);
      }, 250);
    });
  }

  async create(taskData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const maxId = Math.max(...this.tasks.map(t => t.Id), 0);
        const newTask = {
          Id: maxId + 1,
          ...taskData,
          completed: false,
          createdAt: new Date().toISOString()
        };
        this.tasks.push(newTask);
        this.saveToStorage();
        resolve({ ...newTask });
      }, 400);
    });
  }

  async update(id, taskData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.tasks.findIndex(t => t.Id === parseInt(id));
        if (index !== -1) {
          this.tasks[index] = { ...this.tasks[index], ...taskData };
          this.saveToStorage();
          resolve({ ...this.tasks[index] });
        } else {
          resolve(null);
        }
      }, 350);
    });
  }

  async toggleComplete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.tasks.findIndex(t => t.Id === parseInt(id));
        if (index !== -1) {
          this.tasks[index].completed = !this.tasks[index].completed;
          this.saveToStorage();
          resolve({ ...this.tasks[index] });
        } else {
          resolve(null);
        }
      }, 200);
    });
  }

  async delete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.tasks.findIndex(t => t.Id === parseInt(id));
        if (index !== -1) {
          this.tasks.splice(index, 1);
          this.saveToStorage();
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }
}

export default new TaskService();