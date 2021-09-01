import React from 'react'
import {fireEvent, render} from '@testing-library/react'
import {useForm} from '../lib'


describe('useForm hook testing', () => {
  test('', () => {
    let formProps

    const handleSubmit = jest.fn(() => Promise.resolve(true))

    function Form() {
      formProps = useForm({handleSubmit})

      return <form action='/contact' method='post' {...formProps}>
        <input type='text' name='name' defaultValue='Pablo'/>
        <button type='submit'>Submit</button>
      </form>
    }

    const {container} = render(<Form />)
    fireEvent.submit(container.querySelector('form'))

    expect(handleSubmit).toBeCalledTimes(1)
    expect(handleSubmit).toHaveBeenCalledWith('http://localhost/contact', {name: 'Pablo'}, expect.any(Function))
  })
})


