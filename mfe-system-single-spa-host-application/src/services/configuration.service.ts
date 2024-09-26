export class ConfigurationService {
  private configuration: { [key: string]: any };

  private static $instance: ConfigurationService;

  static get instance(): ConfigurationService {
    if (!this.$instance) {
      this.$instance = new ConfigurationService();
    }
    return this.$instance;
  }

  private constructor() {
    this.configuration = {};
  }

  getConfiguration(): any {
    return this.configuration;
  }

  setConfiguration(configuration: { [key: string]: any }) {
    this.configuration = {
      ...this.configuration,
      ...configuration,
    };
  }
}
