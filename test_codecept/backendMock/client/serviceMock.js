

const client = require('./index')

// Turn undefined / null into an empty object so body-parser never sees “null”
function safeBody(payload) {
  return payload == null ? {} : payload;
}

class ServiceMock {
  async getAuthToken() {
    const authCookie = await browser.driver.manage().getCookie('__auth__');
    return authCookie.value
  }

  async updateMockServer(apiMethod, response) {
    const authToken = await this.getAuthToken()
    // if caller passed nothing, replace with a 500 error
    if (!response) response = { status: 500, data: { error: 'No mock response supplied' } };

    // make sure data is safe for JSON
    const sanitized = {
      status: response.status ?? 200,
      data: safeBody(response.data)
    };
    return client.setUserApiData(authToken, apiMethod, sanitized);
  }

  async updateCaseData(data, status) {
    await this.updateMockServer('OnCaseDetails', { status: status ? status : 200, data: data });
  }

  async updateSearchForCompletableTasks(data, status) {
    await this.updateMockServer('OnSearchForCompletableTasks', { status: status ? status : 200, data: data });
  }

  async setBookings(data, status) {
    await this.updateMockServer('OnBookings', { status: status ? status : 200, data: data });
  }

  async setlocations(data, status) {
    await this.updateMockServer('onServiceLocations', { status: status ? status : 200, data: data })
  }

  async setCaseHearings(data, status) {
    await this.updateMockServer('OnCaseHearings', { status: status ? status : 200, data: data })
  }


}

module.exports = new ServiceMock()
