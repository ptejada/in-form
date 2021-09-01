import React from 'react'
import {fireEvent, render} from '@testing-library/react'
import {InForm} from '../lib'

describe('InForm Component Testing', () => {
  test('should pass props to form native attributes', () => {
    const {container} = render(
      <InForm action='/contact' method='GET' name='mainForm' className='fancy-form'>
        <input type='text' name='name'/>
      </InForm>
    )

    const form = container.querySelector('form')

    expect(form.action).toBe('http://localhost/contact')
    expect(form.name).toBe('mainForm')
    expect(form.enctype).toBe('application/x-www-form-urlencoded')
    expect(form.className).toBe('fancy-form')
  })

  test('should update the form fields default', () => {
    const defaults = {
      name: 'Pablo',
      ticked1: true,
      ticked2: false,
      ticked3: 'Y',
      ticked4: 'N',
      multiTick: ['two']
    }

    const {container} = render(
      <InForm defaults={defaults}>
        <input type='text' name='name'/>
        <input type='checkbox' name='ticked1'/>
        <input type='checkbox' name='ticked2'/>
        <input type='checkbox' name='ticked3' value='Y'/>
        <input type='checkbox' name='ticked4' value='Y'/>
        <input type='checkbox' name='multiTick[]' value='two'/>
        <input type='checkbox' name='multiTick[]' value='one'/>
      </InForm>
    )

    const form = container.querySelector('form')

    function getNode(name): HTMLInputElement {
      return form.querySelector(`[name="${name}"]`)
    }

    function getNodeChecked(name): HTMLInputElement | undefined {
      return form.querySelector(`[name="${name}"]:checked`)
    }

    expect(getNode('name').value).toBe(defaults.name)
    expect(getNode('ticked1').checked).toBeTruthy()
    expect(getNode('ticked2').checked).toBeFalsy()
    expect(getNode('ticked3').checked).toBeTruthy()
    expect(getNode('ticked4').checked).toBeFalsy()
    expect(getNodeChecked('multiTick[]').value).toBe(defaults.multiTick[0])
  })

  test('should trigger submitting callback', () => {
    const submitting = jest.fn()

    const {container} = render(
      <InForm submitting={submitting} handleSubmit={(url, data, done) => done(data)}>
        <input type='text' name='name' defaultValue='Pablo'/>
        <button type='submit'>Send</button>
      </InForm>
    )

    fireEvent.submit(container.querySelector('form'))

    expect(submitting).toHaveBeenCalledTimes(2)
    expect(submitting).nthCalledWith(1, true)
    expect(submitting).nthCalledWith(2, false)
  })
})
