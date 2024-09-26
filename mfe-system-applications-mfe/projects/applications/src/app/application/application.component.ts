import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  Application,
  ApplicationForm,
  Contact,
  ShellApplication,
  Support,
  emptyApplication,
  fillEmptyApplication,
} from '../application';
import { FormsModule } from '@angular/forms';
import { JsonEditorOptions, NgJsonEditorModule } from 'ang-jsoneditor';
import { RegExpMatchDirective } from '../form/reg-exp-match.directive';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [FormsModule, NgJsonEditorModule, RegExpMatchDirective],
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationComponent {
  private $application: Application | ShellApplication | null = null;
  @Input() set application(app: Application | ShellApplication | null) {
    this.$application = app;
    this.resetApplicationCopy();
  }

  get application(): Application | ShellApplication | null {
    return this.$application;
  }

  @Output() applicationChange = new EventEmitter<
    Application | ShellApplication
  >();

  @Output() editCanceld = new EventEmitter<void>();

  private $applicationCopy: ApplicationForm = JSON.parse(
    JSON.stringify(emptyApplication)
  );
  get applicationCopy(): ApplicationForm {
    return this.$applicationCopy;
  }

  data: any = undefined;
  editorOptions: JsonEditorOptions;

  dataError = false;

  styles: string = '';
  scripts: string = '';

  constructor(private changeDetection: ChangeDetectorRef) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mainMenuBar = false;
    this.editorOptions.mode = 'code';
    this.editorOptions.onValidationError = (errors: object[]) => {
      this.dataError = errors.length > 0;
    };
  }

  cancelEdit() {
    this.resetApplicationCopy();

    this.editCanceld.emit();

    this.changeDetection.detectChanges();
  }

  addContact() {
    this.applicationCopy.support.contacts.push({
      name: '',
      email: '',
      phone: '',
    });

    this.changeDetection.detectChanges();
  }

  removeContact(index: number) {
    this.applicationCopy.support.contacts.splice(index, 1);
    this.changeDetection.detectChanges();
  }

  saveApplication() {
    console.log(`saving app`, this.applicationCopy);
    this.applicationChange.emit(this.applicationCopy);
  }

  dataChange(data: any) {
    if (!(data instanceof Event)) {
      this.applicationCopy.data = data;
    }
  }

  stylesChange(styles: string) {
    this.applicationCopy.styles = styles.split(/\s/).filter((s) => s);
  }

  scriptsChange(scripts: string) {
    this.applicationCopy.scripts = scripts.split(/\s/).filter((s) => s);
  }

  private resetApplicationCopy() {
    this.$applicationCopy = fillEmptyApplication(
      this.application || emptyApplication
    );
    this.data = this.$applicationCopy.data;
    this.styles = this.$applicationCopy.styles?.join('\n') || '';
    this.scripts = this.$applicationCopy.scripts?.join('\n') || '';
  }
}
