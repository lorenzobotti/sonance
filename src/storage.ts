import { Expense } from "./expense"
import { deserializeDates } from "./json_date"

type ExpenseDB = { [key: string]: Expense }
interface SavedExpense extends Expense {
    id: string,
}

function getId(): string {
    if (!localStorage['id']) {
        localStorage['id'] = '0'
    }

    const id = parseInt(localStorage['id'])
    localStorage['id'] = (id + 1).toString()

    return id.toString()
}

export function saveExpense(exp: Expense): string {
    const expenses = loadExpenses()
    const id = getId()

    expenses[id] = exp
    saveExpenses(expenses)

    return id
}

export function editExpense(id: string, exp: Expense) {
    const exps = loadExpenses()
    exps[id] = exp
    saveExpenses(exps)
}

export function deleteExpense(id: string) {
    const exps = loadExpenses()
    delete exps[id]
    saveExpenses(exps)
}

export function getExpense(id: string): SavedExpense | undefined {
    const exps = loadExpenses()
    return { id, ...exps[id] }
}

export function getExpenses(): SavedExpense[] {
    const exps = loadExpenses()
    return Object.keys(exps).map(id => {
        const exp = exps[id]
        return { id, ...exp }
    }).sort((a, b) => a.date < b.date ? -1 : 1)
}

function loadExpenses(): ExpenseDB {
    initExpenseStorage()
    return deserializeDates(localStorage['expenses']) as ExpenseDB
}

function saveExpenses(exps: ExpenseDB) {
    return localStorage['expenses'] = JSON.stringify(exps)
}

function initExpenseStorage() {
    if (!localStorage['expenses']) {
        localStorage['expenses'] = JSON.stringify({})
    }
}