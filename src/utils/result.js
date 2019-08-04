'use strict';

const flowResult = {
  success: 1,
  failed: 2,
  skipped: 3,
};

class Result {
  constructor() {
    this.data = null;
    this.message = null;
    this.flow = flowResult.failed;
  }
}

module.exports = {
  flowResult,
  Result,
};
