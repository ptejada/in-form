import * as React from 'react'
import ReactDOM from 'react-dom'
import {act} from 'react-dom/test-utils'
import {InForm} from '../lib'
import {expect} from 'chai'
import jsdom from 'mocha-jsdom'

// @ts-ignore
global.document = jsdom({
  url: "http://localhost:3001"
})

let rootContainer: HTMLDivElement

beforeEach(() => {
  rootContainer = document.createElement('div')
  document.body.appendChild(rootContainer)
})

afterEach(() => {
  document.body.removeChild(rootContainer)
  rootContainer = null
})

describe('InForm Component Testing', () => {
  it('should pass props to form native attributes', () => {
    act(() => {
      ReactDOM.render(
        <InForm action='/contact' method='GET' name='mainForm' className='fancy-form'>
          <input type='text' name='name'/>
        </InForm>
        , rootContainer)
    })

    const form = rootContainer.querySelector('form') as HTMLFormElement

    expect(form.action).to.equal('http://localhost:3001/contact')
    expect(form.name).to.equal('mainForm')
    expect(form.enctype).to.equal('application/x-www-form-urlencoded')
    expect(form.className).to.equal('fancy-form')
  })

  it('should update the form fields default', () => {
    const defaults = {
      name: 'Pablo',
      ticked1: true,
      ticked2: false,
      ticked3: 'Y',
      ticked4: 'N',
      multiTick: ['two']
    }

    let form: HTMLFormElement

    act(() => {
      ReactDOM.render(
        <InForm defaults={defaults}>
          <input type='text' name='name'/>
          <input type='checkbox' name='ticked1'/>
          <input type='checkbox' name='ticked2'/>
          <input type='checkbox' name='ticked3' value='Y'/>
          <input type='checkbox' name='ticked4' value='Y'/>
          <input type='checkbox' name='multiTick[]' value='two'/>
          <input type='checkbox' name='multiTick[]' value='one'/>
        </InForm>
        , rootContainer)

        form = rootContainer.querySelector('form')
    })

    function getNode(name): HTMLInputElement {
      return rootContainer.querySelector(`[name="${name}"]`)
    }

    function getNodeChecked(name): HTMLInputElement | undefined {
      return rootContainer.querySelector(`[name="${name}"]:checked`)
    }

    expect(getNode('name').value).to.equal(defaults.name)
    expect(getNode('ticked1').checked).to.be.ok
    expect(getNode('ticked2').checked).to.not.be.ok
    expect(getNode('ticked3').checked).to.be.ok
    expect(getNode('ticked4').checked).to.not.ok
    expect(getNodeChecked('multiTick[]')).has.property('value').and.is.equal(defaults.multiTick[0])
  })

  it('should trigger submitting callback', (done) => {
    let execCounter = 1

    function submitting(yes) {
      if (execCounter === 1) {
        expect(yes).to.be.ok
      } else {
        expect(yes).to.not.be.ok
        done()
      }

      execCounter++
    }

    act(() => {
      ReactDOM.render(
        <InForm submitting={submitting} handleSubmit={(data, done) => done(data)}>
          <input type='text' name='name' defaultValue='Pablo'/>
          <button type='submit'>Send</button>
        </InForm>
        , rootContainer)
    })

    rootContainer.querySelector('form').dispatchEvent(new window.Event('submit', {bubbles: true}))
  })
})
