export type Task = {
  id: number;
  name: string;
  description: string;
};

let id = 2;

// mock data
const tasks: Task[] = [
  {
    id: 1,
    name: "Take the ring to Rivendell",
    description: `Change your Name. Travel alone. Don't talk to strangers. Don't wear the ring. Take it to Rivendell`,
  },
  {
    id: 2,
    name: "Take the ring to Mount Doom",
    description: `The black Knights are hunting you. The great eye is looking for you. Walk in the shadows and cast the ring into the Mount Doom deeps`,
  },
];

export class TasksServices {
  protected static $instance: TasksServices;

  static get instance(): TasksServices {
    if (!TasksServices.$instance) TasksServices.$instance = new TasksServices();
    return TasksServices.$instance;
  }

  protected constructor() {}

  private tasks: Task[] = tasks;

  getTasks(): Task[] {
    return this.tasks;
  }

  getTask(id: number): Task {
    return this.tasks.find((task) => task.id === id);
  }

  saveTask(task: Task): void {
    task.id = task.id || ++id;
    this.removeTask(task.id);
    this.tasks.push(task);
  }

  removeTask(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
