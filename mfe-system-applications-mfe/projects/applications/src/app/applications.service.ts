import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApplicationsApiToken } from './tokens';
import { lastValueFrom } from 'rxjs';
import { Application, ShellApplication } from './application';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  constructor(
    private http: HttpClient,
    @Inject(ApplicationsApiToken) private api: string
  ) {}

  listApplications() {
    return lastValueFrom(
      this.http.get<Array<Application | ShellApplication>>(this.api)
    );
  }

  replaceApplications(applications: Array<Application | ShellApplication>) {
    return lastValueFrom(
      this.http.put<Array<Application | ShellApplication>>(
        this.api,
        applications
      )
    );
  }

  createApplication(application: Application) {
    return lastValueFrom(
      this.http.post<Application | ShellApplication>(this.api, application)
    );
  }

  createShellApplication(application: ShellApplication) {
    return lastValueFrom(
      this.http.post<ShellApplication>(`${this.api}/shell`, application)
    );
  }

  updateApplication(application: Application | ShellApplication) {
    return lastValueFrom(
      this.http.put<Application | ShellApplication>(
        `${this.api}/${application.id}`,
        application
      )
    );
  }

  deleteApplication(id: string) {
    return lastValueFrom(this.http.delete<void>(`${this.api}/${id}`));
  }

  saveApplication(application: Application | ShellApplication) {
    if (!application.id) {
      return this.createApplication(application);
    }
    if (application.id === 'shell') {
      return this.createShellApplication(application as ShellApplication);
    }
    return this.updateApplication(application);
  }
}
