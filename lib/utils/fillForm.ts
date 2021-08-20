export default function fillForm(form: HTMLFormElement, defaults: any) {
  Object.keys(defaults).forEach(name => {
    let element = form.elements[name]
    const defValue = defaults[name]

    if (element === undefined && Array.isArray(defValue)) {
      element = form.elements[`${name}[]`]
    }

    if (element === undefined) {
      return
    }

    function wrap<T>(list): Array<T & HTMLFormElement> {
      return list.length !== undefined ? list : [list]
    }

    switch (element.tagName) {
      case 'INPUT':
        switch (element.type.toLowerCase()) {
          case 'checkbox':
            if (typeof defValue === 'boolean') {
              wrap(element).forEach(elem => elem.checked = defValue)
            } else if (Array.isArray(defValue)) {
              wrap(element).forEach(elem => elem.checked = defValue.indexOf(element.value) > -1)
            } else {
              wrap(element).forEach(elem => elem.checked = elem.value === defValue)
            }
            break
          case 'radio':
            wrap(element).forEach(elem => elem.checked = elem.value === defValue)
            break
          default:
            element.value = defaults[name]
        }
        break
      case 'SELECT':
        if (element.multiple && Array.isArray(defValue)) {
          element.querySelectorAll('option').forEach(option => {
            option.selected = defValue.indexOf(option.value) > -1
          })
        } else {
          element.querySelectorAll('option').forEach(option => {
            option.selected = option.value === defValue
          })
        }

        break
      case 'TEXTAREA':
        element.value = defaults[name]
        break
    }
  })
}
