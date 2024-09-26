import { Container, Provider } from "@decorators/di";
import { MongoClient } from "mongodb";
import { APPLICATION_COLLECTION } from "./configuration";
import { ApplicationsDataImpl } from "./applications/applications.data";
import { ApplicationsDataMongo } from "./applications/applications.data.mongo";
import { ApplicationsDataMemory } from "./applications/applications.data.memory";

const STORAGE = process.env.STORAGE || "memory";

const MONGODB_CONNECTION_STRING =
  process.env.MONGODB_CONNECTION_STRING || "mongodb://root:mfesR00tPass@localhost:27017";

const MONGODB_DATABASE_NAME = process.env.MONGODB_DATABASE_NAME || "applications";

const MONGODB_DATABASE_APPLICATIONS_COLLECTION_NAME =
  process.env.MONGODB_DATABASE_APPLICATIONS_COLLECTION_NAME || "applications";

const MONGODB_APPLICATIONS_ORDER_INDEX_NAME =
  process.env.MONGODB_APPLICATIONS_ORDER_INDEX_NAME || "application_order_index";

export async function databaseConnect(container: Container) {
  console.log("STORAGE: ", STORAGE);

  let ApplicationsDataProider: Provider = {
    provide: ApplicationsDataImpl,
    useClass: ApplicationsDataMemory,
  };

  try {
    if (STORAGE === "mongo") {
      const client = new MongoClient(MONGODB_CONNECTION_STRING);
      console.log("Connecting to database ...");

      await client.connect();

      const database = client.db(MONGODB_DATABASE_NAME);

      console.log("Connecting to collection ...");
      const applicationsCollection = database.collection(
        MONGODB_DATABASE_APPLICATIONS_COLLECTION_NAME,
      );

      // create index if not already created
      console.log("Creating index ...");

      console.log("inserting init document");
      // workaround actually create the collection
      const insert = await applicationsCollection.insertOne({});
      await applicationsCollection.deleteOne({ _id: insert.insertedId });
      await applicationsCollection.findOne({});

      console.log("retrieving indexes");
      const indexes = await applicationsCollection.indexes();
      console.log("existing indexes: ", indexes);
      if (!indexes.find((i) => i.name === MONGODB_APPLICATIONS_ORDER_INDEX_NAME)) {
        applicationsCollection.createIndex(
          { order: 1 },
          { name: MONGODB_APPLICATIONS_ORDER_INDEX_NAME },
        );
      }

      console.log("Connected to database");

      ApplicationsDataProider = {
        provide: ApplicationsDataImpl,
        useClass: ApplicationsDataMongo,
      };

      container.provide([
        {
          provide: APPLICATION_COLLECTION,
          useValue: applicationsCollection,
        },
      ]);
    }
  } catch (err) {
    console.log(err);
    console.log("Error connecting to database. Falling back to in-memory data store.");
  }

  container.provide([ApplicationsDataProider]);
}
