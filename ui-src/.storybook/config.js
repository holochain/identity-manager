import { configure } from '@storybook/react';
import { describe, it, beforeEach } from 'storybook-addon-specifications'
import expect from 'expect'
import jest from 'jest-mock'
import { configure as enzymeConfigure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

window.describe = describe
window.beforeEach = beforeEach
window.it = it
window.expect = expect
window.jest = jest

enzymeConfigure({ adapter: new Adapter() })

const req = require.context("../src", true, /.(stories).(tsx|ts|js|jsx)$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
