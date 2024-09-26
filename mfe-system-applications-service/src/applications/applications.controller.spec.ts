import Sinon from "sinon";
import { expect } from "../../test";
import { ApplicationsController } from "./applications.controller";

describe("ApplicationsController", () => {
  let controller: ApplicationsController;
  let service: any;
  let response: any;

  beforeEach(async () => {
    response = {
      json: Sinon.stub(),
      status: Sinon.stub().returnsThis(),
      send: Sinon.stub(),
    };
    service = {};
    controller = new ApplicationsController(service);
  });

  it("should be defined", () => {
    expect(controller).to.be.not.undefined;
  });

  it("should list all applications", async () => {
    service.listApplications = Sinon.stub().resolves([{ name: "App" }]);
    await controller.ListApplications(response);
    expect(service.listApplications.calledOnce).to.be.true;
    expect(response.json.calledOnceWith([{ name: "App" }])).to.be.true;
  });

  it("should add an application", async () => {
    service.addApplication = Sinon.stub().resolves({ name: "App" });
    const body: any = { name: "App" };
    await controller.addApplication(response, body);
    expect(service.addApplication.calledOnceWith({ name: "App" })).to.be.true;
    expect(response.status.calledOnceWith(201)).to.be.true;
    expect(response.json.calledOnceWith({ name: "App" })).to.be.true;
  });

  it("should add a shell application", async () => {
    service.addShellApplication = Sinon.stub().resolves({ name: "Shell", id: "shell" });
    const body: any = { name: "Shell" };
    await controller.addShellApplication(response, body);
    expect(service.addShellApplication.calledOnceWith({ name: "Shell" })).to.be.true;
    expect(response.json.calledOnceWith({ name: "Shell", id: "shell" })).to.be.true;
  });

  it("shopuld update an application", async () => {
    service.updateApplication = Sinon.stub().resolves({ name: "App" });
    const body: any = { name: "App" };
    await controller.updateApplication(response, "id", body);
    expect(service.updateApplication.calledOnceWith("id", { name: "App" })).to.be.true;
    expect(response.json.calledOnceWith({ name: "App" })).to.be.true;
  });

  it("should remove an application", async () => {
    service.removeApplication = Sinon.stub().resolves();
    await controller.removeApplication(response, "id");
    expect(service.removeApplication.calledOnceWith("id")).to.be.true;
    expect(response.status.calledOnceWith(203)).to.be.true;
    expect(response.send.calledOnce).to.be.true;
  });
});
