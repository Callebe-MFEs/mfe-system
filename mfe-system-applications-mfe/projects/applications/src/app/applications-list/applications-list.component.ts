import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

import { JsonEditorOptions, NgJsonEditorModule } from 'ang-jsoneditor';
import { ApplicationComponent } from '../application/application.component';
import { Application, ShellApplication } from '../application';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [NgJsonEditorModule, ApplicationComponent],
  templateUrl: './applications-list.component.html',
  styleUrl: './applications-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationsListComponent implements AfterViewInit, OnDestroy {
  @Input() applications: Array<Application | ShellApplication> = [];

  @Input() selectedApplication: Application | ShellApplication | null = null;

  @Output() selectedApplicationChange = new EventEmitter<
    Application | ShellApplication | null
  >();

  @Output() deleteApplication = new EventEmitter<
    Application | ShellApplication
  >();

  @Output() saveApplication = new EventEmitter<
    Application | ShellApplication
  >();

  @Output() newApplication = new EventEmitter<void>();

  @Output() editShellApplication = new EventEmitter<void>();

  @Output() editCanceld = new EventEmitter<
    Application | ShellApplication | null
  >();

  @Output() replaceApplications = new EventEmitter<
    Array<Application | ShellApplication>
  >();

  @ViewChild('applicationsList') applicationsList:
    | ElementRef<HTMLDivElement>
    | undefined;

  wide = false;

  replaceApplicationEditor = false;
  data: any = [];
  editorOptions: JsonEditorOptions;
  dataError = false;

  private resizeObserver: ResizeObserver | undefined = undefined;

  constructor(private changeDetection: ChangeDetectorRef) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mainMenuBar = false;
    this.editorOptions.mode = 'code';
    this.editorOptions.onValidationError = (errors: object[]) => {
      this.dataError = errors.length > 0;
    };
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      this.setWide(entries[0].contentRect.width >= 768);
    });

    if (this.applicationsList) {
      this.setWide(this.applicationsList.nativeElement.clientWidth >= 768);
      this.resizeObserver.observe(this.applicationsList.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver && this.resizeObserver.disconnect();
    this.resizeObserver = undefined;
  }

  toggleApplication(application: Application | ShellApplication) {
    this.selectedApplication =
      application === this.selectedApplication ? null : application;
    this.selectedApplicationChange.emit(application);
    this.changeDetection.detectChanges();
  }

  deleteApplicationEmit(application: Application | ShellApplication) {
    this.deleteApplication.emit(application);
  }

  applicationChange(application: Application | ShellApplication) {
    this.saveApplication.emit(application);
  }

  newApplicationEmit() {
    this.newApplication.emit();
  }

  editShellApplicationEmit() {
    this.editShellApplication.emit();
  }

  replaceApplicationsClick() {
    this.editCanceld.emit(this.selectedApplication);
    this.selectedApplicationChange.emit(null);
    this.replaceApplicationEditor = true;
  }

  replaceApplicationEmit() {
    this.replaceApplications.emit(this.data);
    this.replaceApplicationEditor = false;
    this.data = [];
  }

  editCanceldEmit(application: Application | ShellApplication | null) {
    this.editCanceld.emit(application);
    this.replaceApplicationEditor = false;
    this.data = [];
  }

  dataChange(data: any) {
    if (!(data instanceof Event)) {
      this.data = data;
    }
  }

  private setWide(value: boolean) {
    setTimeout(() => {
      this.wide = value;
      this.changeDetection.detectChanges();
    }, 0);
  }
}
