import { PropertyValueMap, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Task, TasksServices } from "./tasks.service";
import { Router } from "@vaadin/router";
import { RouteComponent } from "../route.component";

@customElement("task-form")
export class TaskFormComponent extends RouteComponent {
  static styles = [
    css`
      input,
      textarea {
        padding: 10px;
      }

      textarea {
        vertical-align: top;
      }

      label {
        display: inline-block;
        margin: 10px 0;
      }

      label span {
        display: inline-block;
        width: 90px;
        text-align: right;
      }

      button {
        padding: 10px;
        line-height: 100%;
      }
    `,
  ];

  @property({ type: Number })
  set taskId(id: number) {
    this.task = TasksServices.instance.getTask(id) || {
      id: 0,
      name: "",
      description: "",
    };
  }

  get taskId(): number {
    return this.task.id;
  }

  @state()
  private task: Task = { id: 0, name: "", description: "" };

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    this.taskId = +((this as any).location?.params?.taskId || 0);
  }

  submit(e: Event) {
    e.preventDefault();
    TasksServices.instance.saveTask(this.task);
    Router.go(
      this.router.urlForName("task-details", { taskId: `${this.task.id}` })
    );
  }

  render() {
    return html`
      <div>
        <h2>${this.task.id ? `Task - ${this.task.name}` : "New Task"}</h2>
        <form @submit=${this.submit}>
          <div>
            <label for="name">
              <span>Name:</span> 
              <input type="text" id="name" name="name" value="${
                this.task.name
              }" @change=${(e) => (this.task.name = e.target.value)} />
            </label>
          </div>
          <div>
            <label for="description">
              <span>Description:</span> 
            <textarea id="description" name="description" @change=${(e) =>
              (this.task.description = e.target.value.trim())}>${
      this.task?.description
    }
            </textarea>
            </label>
          </div>
          <div>
            <button type="submit">Save</button>
          </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "task-form": TaskFormComponent;
  }
}
