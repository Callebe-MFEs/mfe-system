import { Component, Inject, OnInit } from '@angular/core';
import { ApplicationsListComponent } from './applications-list/applications-list.component';
import {
  Application,
  ShellApplication,
  emptyApplication,
  fillEmptyApplication,
} from './application';
import { ApplicationsService } from './applications.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ApplicationsListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'applications';

  selectedApplication: Application | ShellApplication | null = null;

  applications: Array<Application | ShellApplication> = [
    // {
    //   id: 'shell',
    //   name: 'shell',
    //   label: 'Shell',
    //   route: '/',
    //   url: '/apps/shell',
    //   remote: {
    //     url: '/apps/shell/remoteEntry.js',
    //     scope: 'shell',
    //     module: './Shell',
    //     type: 'module',
    //   },
    // },
    // {
    //   id: '92873648',
    //   name: 'test',
    //   label: 'Test',
    //   route: '/test',
    //   url: '/apps/test',
    //   remote: {
    //     url: '/apps/test/remoteEntry.js',
    //     scope: 'test',
    //     module: './Test',
    //     type: 'module',
    //   },
    // },
  ];

  constructor(
    private applicationsService: ApplicationsService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.applicationsService.listApplications().then((applications) => {
      this.applications = applications;
    });
  }

  saveApplication(application: Application | ShellApplication) {
    this.applicationsService.saveApplication(application).then((savedApp) => {
      let index = this.applications.findIndex((app) => app.id === savedApp.id);
      // if not found, it's a new application
      index = index >= 0 ? index : this.applications.length - 1;
      this.applications[index] = savedApp;
      this.applications = [...this.applications];
      this.selectedApplication = savedApp;

      this.ngOnInit(); // reload list of applications.

      // whenever an application is updated, we dispatch an event to notify any component/application that might be interested
      this.document.dispatchEvent(
        new CustomEvent('mfe-system-applications-mfe:application-updated', {
          detail: savedApp,
        })
      );
    });
  }

  newApplication() {
    if (
      this.applications.length === 0 ||
      this.applications[this.applications.length - 1].id
    ) {
      this.selectedApplication = fillEmptyApplication(emptyApplication);
      this.applications = [...this.applications, this.selectedApplication];
    }
  }

  editShellApplication() {
    let shell = this.applications.find(
      (app) => app.id === 'shell'
    ) as ShellApplication;
    if (!shell) {
      shell = fillEmptyApplication(emptyApplication);
      shell.id = 'shell';
      shell.name = 'shell';
      shell.label = 'Shell';
      shell.route = '/';
      shell.styles = [];
      shell.scripts = [];
      this.applications = [shell, ...this.applications];
    }
    this.selectedApplication = shell;
  }

  editCanceld(application: Application | ShellApplication | null | undefined) {
    if (application && !application.id) {
      this.applications.pop();
      this.selectedApplication = null;
      this.applications = [...this.applications];
    }
  }

  async replaceApplications(
    applications: Array<Application | ShellApplication>
  ) {
    this.applications = await this.applicationsService.replaceApplications(
      applications
    );
  }

  async deleteApplication(application: Application | ShellApplication) {
    await this.applicationsService.deleteApplication(application.id);
    const index = this.applications.findIndex(
      (app) => app.id === application.id
    );
    this.applications.splice(index, 1);

    this.selectedApplication =
      this.selectedApplication?.id === application.id
        ? null
        : this.selectedApplication;

    this.applications = [...this.applications];
  }
}
