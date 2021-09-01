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

> **Note:** The label`for` attribute is not supported in React and is replaced by `htmlFor`.

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

| Option | Type | Description |
| --- | --- | --- |
| onSuccess | (response) => void | A function called after a successful submission | 
|onFailure| (response) => void | A function called after the submission fails |
|defaults | {fieldName: fieldValue} | Default values for form fields |

## Roadmap

See the [Roadmap Board]

[Demo - Contact Form]: https://codesandbox.io/s/tejada-in-form-contact-form-4betf
[Demo - Contact Form (hook)]: https://codesandbox.io/s/tejada-in-form-contact-form-hook-g4oz8
[Roadmap Board]: https://github.com/ptejada/in-form/projects/1
