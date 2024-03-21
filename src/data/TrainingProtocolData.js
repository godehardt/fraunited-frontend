export class TrainingProtocolData {
  constructor (name, nMatchesPerInstance, mode, dateCreated, yamlConfig) {
    this.name = name
    this.nMatchesPerInstance = nMatchesPerInstance
    this.mode = mode
    this.configs = []
    this.matchups = []
    this.dateCreated = dateCreated
    this.yamlConfig = yamlConfig
  }
}
