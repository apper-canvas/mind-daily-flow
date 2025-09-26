import meetingsData from "@/services/mockData/meetings.json";

class MeetingService {
  constructor() {
    this.storageKey = "dailyflow_meetings";
    this.loadFromStorage();
  }

  loadFromStorage() {
    const stored = localStorage.getItem(this.storageKey);
    this.meetings = stored ? JSON.parse(stored) : [...meetingsData];
  }

  saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.meetings));
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.meetings]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const meeting = this.meetings.find(m => m.Id === parseInt(id));
        resolve(meeting ? { ...meeting } : null);
      }, 200);
    });
  }

  async getTodayMeetings() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = new Date().toISOString().split("T")[0];
        const todayMeetings = this.meetings.filter(meeting => meeting.date === today);
        resolve([...todayMeetings]);
      }, 250);
    });
  }

  async getUpcoming(days = 7) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);
        
        const upcoming = this.meetings.filter(meeting => {
          const meetingDate = new Date(meeting.date);
          return meetingDate >= today && meetingDate <= futureDate;
        }).sort((a, b) => new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time));
        
        resolve([...upcoming]);
      }, 300);
    });
  }

  async getByDate(date) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.meetings.filter(meeting => meeting.date === date);
        resolve([...filtered]);
      }, 250);
    });
  }

  async create(meetingData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const maxId = Math.max(...this.meetings.map(m => m.Id), 0);
        const newMeeting = {
          Id: maxId + 1,
          ...meetingData,
          createdAt: new Date().toISOString()
        };
        this.meetings.push(newMeeting);
        this.saveToStorage();
        resolve({ ...newMeeting });
      }, 400);
    });
  }

  async update(id, meetingData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.meetings.findIndex(m => m.Id === parseInt(id));
        if (index !== -1) {
          this.meetings[index] = { ...this.meetings[index], ...meetingData };
          this.saveToStorage();
          resolve({ ...this.meetings[index] });
        } else {
          resolve(null);
        }
      }, 350);
    });
  }

  async delete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.meetings.findIndex(m => m.Id === parseInt(id));
        if (index !== -1) {
          this.meetings.splice(index, 1);
          this.saveToStorage();
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }
}

export default new MeetingService();