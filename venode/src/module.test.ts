import {test, expect} from 'vitest'
import { moduleToVendorPath } from './module'

test('should work', () => {
  expect(moduleToVendorPath('/home/bagher/venode/node_modules/venode/node_modules/picocolors/picocolors.browser.js')).toBe('/picocolors/picocolors.browser.js')
})

