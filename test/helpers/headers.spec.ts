import { parseHeaders, processHeaders, flattenHeaders } from "../../src/helpers/headers";
describe('helpers:header', () => {
  describe('parseHeaders', () => {
    test('should parse headers', () => {
      const parsed = parseHeaders([
        'Content-Type: application/json',
        'Connection: keep-alive',
        'Transfer-Encoding: chunked',
        'Date: Tue, 21 May 2019 09:23:44 GMT',
        ':aa',
        'Key:'
      ].join('\r\n'))
      expect(parsed['content-type']).toBe('application/json')
      expect(parsed['connection']).toBe('keep-alive')
      expect(parsed['transfer-encoding']).toBe('chunked')
      expect(parsed['date']).toBe('Tue, 21 May 2019 09:23:44 GMT')
      expect(parsed['key']).toBe('')
    })

    test('should return empty object if header is empty', () => {
      expect(parseHeaders('')).toEqual({})
    })
  })
  describe('processHeaders', () => {
    test('should normalize Content-Type header name', () => {
      const headers: any = {
        'conTent-Type': 'foo/bar',
        'Content-length': 1024
      }
      processHeaders(headers, {})
      expect(headers['Content-Type']).toBe('foo/bar')
      expect(headers['conTent-Type']).toBeUndefined()
      expect(headers['Content-length']).toBe(1024)
    })
    test('should set Content-Type if not se and data is PlanObject', () => {
      const headers: any = {}
      processHeaders(headers, {})
      expect(headers['Content-Type']).toBe('application/json;charset=utf-8')
    })
    test('should do nothing if headers is undefined or null', () => {
      expect(processHeaders(undefined, {})).toBeUndefined()
      expect(processHeaders(null, {})).toBeNull()
    })
  })
  describe('flattenHeaders', () => {
    test('should flatten the headers and inclide common headers', () => {
      const headers = {
        Accept: 'application/json',
        common: {
          'X-COMMON-HEADER': 'commonHeaderValue'
        },
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        },
        post: {
          'X-POST_HEADER': 'postHeaderValue'
        }
      }
      expect(flattenHeaders(headers, 'get')).toEqual({
        Accept: 'application/json',
        'X-COMMON-HEADER': 'commonHeaderValue',
        'X-GET-HEADER': 'getHeaderValue'
      })
    })
    test('should flatten the headers without common headers', () => {
      const headers = {
        Accept: 'application/json',
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        },
      }
      expect(flattenHeaders(headers, 'patch')).toEqual({
        Accept: 'application/json'
      })
    })
    test('should do nothing if header is null or undefined', () => {
      expect(flattenHeaders(undefined, 'post')).toBeUndefined()
      expect(flattenHeaders(null, 'get')).toBeNull()
    })
  })
})