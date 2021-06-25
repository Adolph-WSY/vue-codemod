jest.autoMockOff()

import { defineTest } from 'jscodeshift/src/testUtils'

defineTest(__dirname, 'vue-i18n-v9', {}, 'vue-i18n-v9/create-i18n')
