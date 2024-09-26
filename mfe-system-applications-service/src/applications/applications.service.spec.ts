import { ApplicationsService } from "./applications.service";
import { expect } from "../../test";
import Sinon from "sinon";

describe("ApplicationsService", () => {
  let service: ApplicationsService;
  let dataClient: any;

  beforeEach(() => {
    dataClient = {
      find: Sinon.stub().resolves(null),
    };
    service = new ApplicationsService(dataClient);
  });

  it("should be defined", () => {
    expect(service).to.be.not.undefined;
  });

  it("should get the shell application", async () => {
    dataClient.findApplication = Sinon.stub().resolves({ name: "Shell" });
    const app = await service.getShellApplication();
    expect(dataClient.findApplication.calledOnceWith("shell")).to.be.true;
    expect(app).to.be.not.undefined;
    expect(app.name).to.be.equal("Shell");
  });

  it("should list all applications", async () => {
    dataClient.listApplications = Sinon.stub().resolves([{ name: "App" }]);
    const apps = await service.listApplications();
    expect(dataClient.listApplications.calledOnce).to.be.true;
    expect(apps).to.be.not.undefined;
    expect(apps.length).to.be.equal(1);
  });

  it("should list all applications with shell in first position", async () => {
    dataClient.listApplications = Sinon.stub().resolves([
      { name: "App", id: "app" },
      { name: "Shell", id: "shell" },
    ]);
    const apps = await service.listApplications();
    expect(dataClient.listApplications.calledOnce).to.be.true;
    expect(apps).to.be.not.undefined;
    expect(apps.length).to.be.equal(2);
    expect(apps[0].name).to.be.equal("Shell");
  });

  it("should add an application", async () => {
    dataClient.addApplication = Sinon.stub().resolves({ name: "App" });
    const app = await service.addApplication({ name: "App" } as any);
    expect(dataClient.addApplication.calledOnceWith({ name: "App" })).to.be.true;
    expect(app).to.be.not.undefined;
    expect(app.name).to.be.equal("App");
  });

  it("should throw an error when adding an application with an existing name", async () => {
    dataClient.find = Sinon.stub().resolves({ name: "App" });

    await expect(service.addApplication({ name: "App" } as any)).to.be.rejectedWith(
      "Application name duplicated",
    );
  });

  it("should add a shell application", async () => {
    dataClient.addApplication = Sinon.stub().resolves({ name: "Shell", id: "shell" });
    dataClient.findApplication = Sinon.stub().resolves();
    const app = await service.addShellApplication({ name: "Shell", id: "shell" } as any);
    expect(dataClient.addApplication.calledOnceWith({ name: "Shell", id: "shell" })).to.be.true;
    expect(app).to.be.not.undefined;
    expect(app.name).to.be.equal("Shell");
  });

  it("should remove previous shell application before adding new one", async () => {
    dataClient.findApplication = Sinon.stub().resolves({ name: "Shell", id: "shell" });
    dataClient.deleteApplication = Sinon.stub().resolves();
    dataClient.addApplication = Sinon.stub().resolves({ name: "Shell", id: "shell" });
    const app = await service.addShellApplication({ name: "Shell", id: "shell" } as any);
    expect(dataClient.findApplication.calledOnceWith("shell")).to.be.true;
    expect(dataClient.deleteApplication.calledOnceWith("shell")).to.be.true;
    expect(dataClient.addApplication.calledOnceWith({ name: "Shell", id: "shell" })).to.be.true;
    expect(app).to.be.not.undefined;
    expect(app.name).to.be.equal("Shell");
  });

  it("should update an application", async () => {
    dataClient.findApplication = Sinon.stub().resolves({ name: "App", id: "1" });
    dataClient.replaceApplication = Sinon.stub().resolves({ name: "App", id: "1" });
    const app = await service.updateApplication("1", { name: "App", id: "1" } as any);
    expect(dataClient.replaceApplication.calledOnceWith({ name: "App", id: "1" })).to.be.true;
    expect(app).to.be.not.undefined;
    expect(app.name).to.be.equal("App");
  });

  it("should not update application if name is duplicated", async () => {
    dataClient.find = Sinon.stub().resolves({ name: "App", id: "1" });
    await expect(
      service.updateApplication("2", { name: "App", id: "2" } as any),
    ).to.be.rejectedWith("Application name duplicated");
  });

  it("should not update application if it does not exist", async () => {
    dataClient.findApplication = Sinon.stub().resolves(null);
    await expect(
      service.updateApplication("2", { name: "App", id: "2" } as any),
    ).to.be.rejectedWith("Application not found");
  });

  it("should remove an application", async () => {
    dataClient.deleteApplication = Sinon.stub().resolves();
    await service.removeApplication("app");
    expect(dataClient.deleteApplication.calledOnceWith("app")).to.be.true;
  });
});
