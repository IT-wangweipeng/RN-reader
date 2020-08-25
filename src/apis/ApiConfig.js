
let instance = null

export class ApiConfig {
  constructor(props) {
    this.ip = ''
    this.h5ApiPrefix = ''
  }

  static getInstance() {
    if (!instance) {
      instance = new ApiConfig()
    }
    return instance
  }
}
