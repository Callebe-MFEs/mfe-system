import { PropertyValueMap, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Task, TasksServices } from "./tasks.service";
import { getRouter } from "../router";
import { RouteComponent } from "../route.component";

@customElement("task-details")
export class TaskDetailsComponent extends RouteComponent {
  static styles = [
    css`
      .field {
        margin: 10px 0;
      }

      .label {
        display: inline-block;
        width: 90px;
        text-align: right;
        font-weight: bold;
      }

      .value {
        display: inline-block;
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

  render() {
    return html`
      <div>
        <h2>Task - ${this.task.name}</h2>
        <div class="field">
          <span class="label">Name:</span>
          <span class="value">${this.task.name}</span>
        </div>
        <div class="field">
          <span class="label">Description:</span>
          <span class="value">${this.task?.description}</span>
        </div>

        <a href=${this.router.urlForName("tasks-list")}>Go back</a>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "task-details": TaskDetailsComponent;
  }
}
