import Sinon from "sinon";
import { expect } from "../../test";
import { ApplicationsDataMongo } from "./applications.data.mongo";

describe("ApplicationsController", () => {
  let dataClient: ApplicationsDataMongo;
  let collectionMock: any;

  beforeEach(async () => {
    collectionMock = {};
    collectionMock.find = Sinon.stub().returnsThis();
    collectionMock.sort = Sinon.stub().returnsThis();
    collectionMock.limit = Sinon.stub().returnsThis();
    collectionMock.toArray = Sinon.stub().resolves([]);
    collectionMock.updateMany = Sinon.stub().resolves();
    dataClient = new ApplicationsDataMongo(collectionMock);
  });

  it("should be defined", () => {
    expect(dataClient).to.be.not.undefined;
  });

  it("should add an application", async () => {
    collectionMock.insertOne = Sinon.stub().resolves();
    let app: any = { name: "App" };
    app = await dataClient.addApplication(app);
    expect(collectionMock.insertOne.calledOnceWith(app)).to.be.true;
    expect(app.order).to.be.equal(1);
    expect(app.id).to.be.not.undefined;
  });

  it("should update order of existing applications", async () => {
    collectionMock.insertOne = Sinon.stub().resolves();
    let app: any = { name: "App", order: 3 };
    app = await dataClient.addApplication(app);
    expect(collectionMock.insertOne.calledOnceWith(app)).to.be.true;
    expect(app.order).to.be.equal(3);
    expect(app.id).to.be.not.undefined;
    expect(collectionMock.updateMany.calledOnce).to.be.true;
  });

  it("should assing last order when order is undefined", async () => {
    collectionMock.toArray.resolves([{ order: 2 }]);
    collectionMock.insertOne = Sinon.stub().resolves();
    let app: any = { name: "App" };
    app = await dataClient.addApplication(app);
    expect(collectionMock.insertOne.calledOnceWith(app)).to.be.true;
    expect(app.order).to.be.equal(3);
    expect(app.id).to.be.not.undefined;
  });

  it("should add a shell application", async () => {
    collectionMock.insertOne = Sinon.stub().resolves();
    let app: any = { name: "Shell", id: "shell" };
    app = await dataClient.addApplication(app);
    expect(collectionMock.insertOne.calledOnceWith(app)).to.be.true;
    expect(app.id).to.be.equal("shell");
  });

  it("should list all applications", async () => {
    collectionMock.find = Sinon.stub().returnsThis();
    collectionMock.toArray = Sinon.stub().resolves([{ name: "App" }]);
    const apps = await dataClient.listApplications();
    expect(collectionMock.find.calledOnce).to.be.true;
    expect(collectionMock.toArray.calledOnce).to.be.true;
    expect(apps).to.be.not.undefined;
    expect(apps.length).to.be.equal(1);
  });

  it("should find an application by id", async () => {
    collectionMock.findOne = Sinon.stub().resolves({ name: "App" });
    const app = await dataClient.findApplication("id");
    expect(collectionMock.findOne.calledOnceWith({ id: "id" })).to.be.true;
    expect(app).to.be.not.undefined;
    expect(app.name).to.be.equal("App");
  });

  it("should find an application by query", async () => {
    collectionMock.findOne = Sinon.stub().resolves({ name: "App" });
    const app = await dataClient.find({ name: "App" });
    expect(collectionMock.findOne.calledOnceWith({ name: "App" })).to.be.true;
    expect(app).to.be.not.undefined;
    expect(app.name).to.be.equal("App");
  });

  it("should return null if no application is found", async () => {
    collectionMock.findOne = Sinon.stub().resolves(null);
    const app = await dataClient.find({ name: "App" });
    expect(collectionMock.findOne.calledOnceWith({ name: "App" })).to.be.true;
    expect(app).to.be.null;
  });

  it("should replace an application", async () => {
    collectionMock.replaceOne = Sinon.stub().resolves();
    collectionMock.findOne = Sinon.stub().resolves({ id: "id", name: "App" });
    let app: any = { id: "id", name: "App" };
    app = await dataClient.replaceApplication(app);
    expect(collectionMock.replaceOne.calledOnceWith({ id: "id" }, app)).to.be.true;
    expect(app).to.be.not.undefined;
    expect(app.name).to.be.equal("App");
  });

  it("should delete an application by id", async () => {
    collectionMock.deleteOne = Sinon.stub().resolves();
    await dataClient.deleteApplication("id");
    expect(collectionMock.deleteOne.calledOnceWith({ id: "id" })).to.be.true;
  });
});
