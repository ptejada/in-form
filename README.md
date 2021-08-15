# In-Form
A simple React form component and hook to work with HTML forms. The library focus on simplicity and
transition from regular HTML forms to React.

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
Consider the following example form 

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

If you prefer, you can also use the React hook `useForm` and keep your existing form intact. You will only need to
spread the generated props to the form element. Ex:

```jsx
function App() {
  const formProps = useForm()
  return (
    <form action='/contact' method='POST' {...formProps}>
      ...
    </form>
  )
}
```

## Options
The following options apply to the `useForm` hook and `InForm` component:


| Option | Type | Description |
| --- | --- | --- |
| onSuccess | (response) => void | A function called after a successful submission | 
|onFailure| (response) => void | A function called after the submission fails |
|defaults | {fieldName: fieldValue} | Default values for form fields |
