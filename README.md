# In-Form
[![npm version](https://badge.fury.io/js/@tejada%2Fin-form.svg)](https://badge.fury.io/js/@tejada%2Fin-form)
[![Unittest](https://github.com/ptejada/in-form/actions/workflows/unittest.yml/badge.svg)](https://github.com/ptejada/in-form/actions/workflows/unittest.yml)

A simple React form component and hook to work with HTML forms. The library focus on simplicity and ease of transition 
from regular HTML forms to React.

While the official React docs on forms suggests that we should use controlled components, in most cases we don't really
need to monitor or track the form fields on every keystroke. This library relies on original DOM events so your form 
will still look like standard HTML forms for the most part.

Features include:

- Automatic collection of form data.
- Automatic form submission handling.
- Regular url-encoded form requests or JSON requests.
- Support for the most common form controls.
- Default values.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
  - [action](#action)
  - [method](#method)
  - [jsonRequest](#jsonrequest)
  - [defaults](#defaults)
  - [submitting](#submitting)
  - [onSuccess](#onsuccess)
  - [onFailure](#onfailure)
  - [handleSubmit](#handlesubmit)
- [Roadmap](#roadmap)

## Installation

```bash
npm i @tejada/in-form

# Or with yarn

yarn add @tejada/in-form
```

## Usage

Consider the following example form plan HTML

```html

<form action="/contact" method="POST">
    <label for="firstName">First Name</label>
    <input type="text" name="firstName" id="firstName"/>

    <label for="lastName">Last Name</label>
    <input type="text" name="lastName" id="lastName"/>

    <label for="email">Email Address</label>
    <input type="email" name="email" id="email" required/>

    <textarea name="message" id="message" cols="30" rows="10" placeholder="Write message..." required></textarea>

    <button type="submit">Send</button>
</form>
```

The form can process and submitted replacing `<form>` tag with the `InForm` react component instead:

```jsx
<InForm action='/contact' method='POST'>
  <label htmlFor='firstName'>First Name</label>
  <input type='text' name='firstName' id='firstName'/>

  <label htmlFor='lastName'>Last Name</label>
  <input type='text' name='lastName' id='lastName'/>

  <label htmlFor='email'>Email Address</label>
  <input type='email' name='email' id='email' required/>

  <textarea name='message' id='message' cols='30' rows='10' placeholder='Write message...' required></textarea>

  <button type='submit'>Send</button>
</InForm>
```

> **Note:** The label `for` attribute is not supported in React and is replaced by `htmlFor`.

Nothing else is needed in the example above for the form to be processed and submitted via ajax. You can play with a 
live version of this example in the [Demo - Contact Form]

If you prefer, you can also use the React hook `useForm` and keep your existing form intact. You will only need to
spread the generated props to the form element. Ex:

```jsx
function App () {
  const formProps = useForm()
  return (
    <form action='/contact' method='POST' {...formProps}>
      ...
    </form>
  )
}
```

You can play with the live version of the hook version in the [Demo - Contact Form (hook)]

## Options

The following options apply to the `useForm` hook as arguments and the `InForm` component as props:

#### action 
`string`

The relative or absolute URL where the form data will be sent to.

#### method 
`'GET', 'POST', 'PUT'`

The http method that will be used to submit the data to the `action` URL. The default is `POST`.

#### jsonRequest 
`boolean`

Whether the request to `action` URL will in JSON format. If false then a normal `x-www-form-urlencoded` request will be
made. The default is `false`.

#### defaults
`{fieldName: defaultValue}*`

An object to default the form field state or value. The key correspond to the field name and the value is the default
value. The value can be an array if the form control accepts multiple values. Ex: multiple `checkboxes` with the same 
name or a `select` that accepts multiple values.

For `checkboxes` the value must match the HTML value of form control. Alternatively, you can use a `boolean` as the 
default value and the checkbox will checked if `true` and unchecked if `false` regardless of that HTML value is.

For example:
```js
useForm({default: {accept: true}})
```

Will automatically check any of these checkboxes elements:
```html
<input type='checkbox' name='accept'>
<input type='checkbox' name='accept' value='Y'>
<input type='checkbox' name='accept' value='1'>
```

#### submitting: 
`(inProgress: boolean) => void`

A callback function that will be call when the form request starts and finishes. On single request this callback will
be called twice: The first time with the first parameter as `true` indicating the submission is in progress and second time
as `false` indicating the submission request finished.

A common pattern for this callback is to use a boolean state hook setter. Ex:
```jsx
function Form() {
  const [submitting, setSubmitting] = useState(false)
  
  return <Inform submitting={setSubmitting}>
    ...
    <button type='submit' disabled={submitting}>{submitting ? 'Send' : 'Sending...'}</button>    
  </Inform>  
}
```
In this case the submit button will be disabled while a submission is in progress and its text will change as well. 

#### onSuccess:
`(response) => void`

A callback function that is called with the `response` of a successful form submission request. A submission request is
considered successful if it responds with a `2xx` http code. The `response` will be sent to the 
[onFailure] callback otherwise.

#### onFailure
`(response) => void`

A callback function that is call with the `response` of failed form submission request. A submission request is
considered to have failed if the response is in the `4xx` and `5xx` range.

#### handleSubmit
`(action, data) => Promise` or `(action, data, done(response, isOk?: boolean)) => void`

A function handler to overwrite the built-in form submission. The handler is called on form submission and receives
the form `action` url as the first parameter and the form `data` as the second. In order to no break the workflow of
other callback functions this handler provides to way to mark the submission as a success or failure.
- `(action, data) => Promise` <br> 
You can return a promise from the handler. If the promise is resolved then the resolution param will be passed to 
[onSuccess]. If the promise is rejected then [onFailure] will be call. 
- `(action, data, done(response, isOk?: boolean)) => void` <br>
You can use the `done()` function passed as the third parameter. The `done()` function accepts a `response` as the 
first parameter. The second parameter is a boolean flag indicating whether the `response` will be piped to either  the
[onSuccess] or [onFailure] callback.

Even if you handle both the submission and the outcome withing the submit handler and do not use either the [onSuccess]
or [onFailure] callbacks, it is good practice to still resolve the submission with either a promise or the `done()` 
callback to finish the form submission cycle.

## Roadmap

See the [Roadmap Board] & [Changelog](CHANGELOG.md)

[Demo - Contact Form]: https://codesandbox.io/s/tejada-in-form-contact-form-4betf
[Demo - Contact Form (hook)]: https://codesandbox.io/s/tejada-in-form-contact-form-hook-g4oz8
[Roadmap Board]: https://github.com/ptejada/in-form/projects/1
[onFailure]: #onfailure-response--void
[onSuccess]: #onsuccess-response--void
