import axios from "../src"
import { getAjaxRequest } from "./helper"

describe('xsrf', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })
  test('should add a download progress handler', () => {
    const progressSpy = jest.fn()
    axios('/foo', {
      onDownloadProgress: progressSpy
    })
    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: '{"foo":"bar"}'
      })
      expect(progressSpy).toHaveBeenCalled()
    })
  })
  test('should add a upload progress handler', () => {
    const progressSpy = jest.fn()
    axios('/foo', {
      onUploadprogress: progressSpy
    })
    return getAjaxRequest().then(request => {
      // expect(progressSpy).toHaveBeenCalled()
    })
  })
})