import { css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Task, TasksServices } from "./tasks.service";
import { Router } from "@vaadin/router";
import { RouteComponent } from "../route.component";

@customElement("tasks-list")
export class TasksListComponent extends RouteComponent {
  static styles = [
    css`
      table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid;
        margin: 10px 0;

        th {
          text-align: left;
        }

        .actions {
          width: 140px;
        }

        .name {
          width: 250px;
        }

        th,
        td {
          padding: 5px;
        }
      }

      button {
        padding: 10px;
        line-height: 100%;
      }
    `,
  ];

  @state()
  private tasks: Task[];

  constructor() {
    super();
    this.tasks = TasksServices.instance.getTasks();
  }

  deleteTask(task: Task) {
    TasksServices.instance.removeTask(task.id);
    this.tasks = TasksServices.instance.getTasks();
  }

  render() {
    return html`
      <div>
        <h2>Tasks List</h2>
        <div>
          <button
            type="button"
            @click=${() => Router.go(this.router.urlForName("task-form"))}
          >
            New Task
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th class="name">Name</th>
              <th>Description</th>
              <th class="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.tasks.map(
              (task) => html`
                <tr>
                  <td>${task.id}</td>
                  <td>${task.name}</td>
                  <td>${task.description}</td>
                  <td>
                    <a
                      href=${this.router.urlForName("task-form", {
                        taskId: `${task.id}`,
                      })}
                      >Edit</a
                    >
                    <a
                      href=${this.router.urlForName("task-details", {
                        taskId: `${task.id}`,
                      })}
                      >View</a
                    >
                    <a
                      href
                      @click=${(e) => {
                        e.preventDefault();
                        this.deleteTask(task);
                      }}
                      >Delete</a
                    >
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tasks-list": TasksListComponent;
  }
}
