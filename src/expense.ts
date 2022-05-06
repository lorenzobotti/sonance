export interface Expense {
    from: string,
    to: string,

    amount: number,  // cents
    reason: string,
    date: Date,
}