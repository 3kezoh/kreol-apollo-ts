import { DataSource } from "apollo-datasource";
import { Definition, IDefinitionDocument } from "@Definition";
import { Model } from "mongoose";

class DefinitionDataSource extends DataSource {
  Definition: Model<IDefinitionDocument>;

  constructor() {
    super();
    this.Definition = Definition;
  }

  async getDefinitions() {
    return this.Definition.find();
  }

  async getCount() {
    return this.Definition.estimatedDocumentCount();
  }
}

export default DefinitionDataSource;
