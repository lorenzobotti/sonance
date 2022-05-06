import { Expense } from "./expense"
import { deleteExpense, getExpenses, saveExpense } from "./storage"
import h from 'hyperscript'
import { prettyDate } from "./utils"

const inputs = {
    typeToggle: document.getElementById('exp-type') as HTMLInputElement,
    typeToggleOut: document.getElementById('exp-type-out') as HTMLSpanElement,
    to: document.getElementById('to') as HTMLInputElement,
    from: document.getElementById('from') as HTMLInputElement,
    reason: document.getElementById('reason') as HTMLInputElement,
    amount: document.getElementById('amount') as HTMLInputElement,

    list: document.getElementById('list') as HTMLUListElement,
    table: document.getElementById('table') as HTMLTableElement,
    add: document.getElementById('add') as HTMLButtonElement,
    form: document.getElementById('expense-form') as HTMLFormElement,

    spentOut: document.getElementById('spent-out') as HTMLSpanElement,
    receivedOut: document.getElementById('received-out') as HTMLSpanElement,
    balanceOut: document.getElementById('balance-out') as HTMLSpanElement,
}

const formState = {
    outgoing: inputs.typeToggle.checked,
}

inputs.typeToggle.addEventListener('input', event => {
    event.preventDefault()

    inputs.typeToggleOut.textContent = inputs.typeToggle.checked ? 'expense' : 'earning'
    formState.outgoing = inputs.typeToggle.checked

    const me = formState.outgoing ? inputs.from : inputs.to
    const receiver = formState.outgoing ? inputs.to : inputs.from

    receiver.value = me.value
    receiver.disabled = false
    
    me.value = 'me'
    me.disabled = true


    console.log(inputs)
    console.log(formState)
})

inputs.form.addEventListener('submit', e => e.preventDefault())

inputs.add.addEventListener('click', () => {
    const exp: Expense = {
        from: inputs.from.value,
        to: inputs.to.value,
        reason: inputs.reason.value,
        amount: parseFloat(inputs.amount.value),
        date: new Date(),
    }

    saveExpense(exp)
    listExpenses()
})

listExpenses()
function listExpenses() {
    inputs.list.innerHTML = ''
    inputs.table.innerHTML = ''

    let moneySpent  = 0
    let moneyReceived  = 0

    // const heading = h('tr', '', 
    //     h('th', 'spent/received'),
    //     h('th', 'to/from'),
    //     h('th', 'amount'),
    //     h('th', 'reason'),
    // )
    // inputs.table.appendChild(heading)

    const heading = h('tr',
        h('th', 'date'),
        h('th', 'type'),
        h('th', 'to/from'),
        h('th', 'amount'),
        h('th', 'reason'),
    )
    inputs.table.appendChild(heading)

    const expenses = getExpenses()
    console.log({ expenses })

    for (const exp of expenses) {
        const item = document.createElement('li')
        const spent = exp.from === 'me'

        if (spent) {
            item.textContent = `spent €${exp.amount} for ${exp.reason} at ${exp.to} on ${prettyDate(exp.date)} - `
        } else {
            item.textContent = `received €${exp.amount} for ${exp.reason} from ${exp.from} on ${prettyDate(exp.date)} - `
        }
        if (spent) {
            moneySpent += exp.amount
        } else {
            moneyReceived += exp.amount
        }

        const deleteLink = document.createElement('a')
        deleteLink.textContent = 'delete'
        deleteLink.addEventListener('click', () => {
            deleteExpense(exp.id)
            listExpenses()
        })

        item.appendChild(deleteLink)
        inputs.list.appendChild(item)

        const row = h('tr',
            h('td', prettyDate(exp.date)),
            h('td', spent ? 'spent' : 'received'),
            h('td', spent ? exp.to : exp.from),
            h('td', `€${exp.amount}`),
            h('td', exp.reason),
        )
        inputs.table.appendChild(row)
    }

    inputs.spentOut.textContent = moneySpent.toString()
    inputs.receivedOut.textContent = moneyReceived.toString()
    inputs.balanceOut.textContent = (moneyReceived - moneySpent).toString()
}

// function h<K extends keyof HTMLElementTagNameMap>(elem: K, content?: string, ...children: HTMLElement[]): HTMLElementTagNameMap[K] {
//     const el = document.createElement(elem)
//     if (content) {
//         el.textContent = content
//     }

//     if (children) {
//         for (const child of children) {
//             el.appendChild(child)
//         }
//     }

//     return el
// }

allowSend()
function allowSend() {
    inputs.add.disabled = inputs.from.value == ''
        || inputs.to.value == '' 
        || inputs.reason.value == '' 
        || inputs.amount.value == '' 
}

const formInputs = [inputs.from, inputs.to, inputs.reason, inputs.amount]
formInputs.forEach(i => i.addEventListener('input', () => allowSend()))