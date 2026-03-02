interface StatementRow {
    date: string;
    header: string;
    credit: number;
    debit: number;
}
declare const STORAGE_KEY = "stmt_app_rows_v1";
declare let rows: StatementRow[];
declare let dateInput: HTMLInputElement;
declare let headerInput: HTMLInputElement;
declare let creditInput: HTMLInputElement;
declare let debitInput: HTMLInputElement;
declare let addBtn: HTMLButtonElement;
declare let stmtRows: HTMLElement;
declare let totalCreditEl: HTMLElement;
declare let totalDebitEl: HTMLElement;
declare let balanceEl: HTMLElement;
declare function getElement<T extends HTMLElement>(selector: string): T;
declare function initDOM(): void;
declare function load(): void;
declare function save(): void;
declare function formatNumber(n: number): string;
declare function render(): void;
declare function addRow(): void;
declare function clearInputs(): void;
declare function editRow(idx: number): void;
declare function setupMutualExclusive(creditEl: HTMLInputElement, debitEl: HTMLInputElement): void;
declare function saveEdit(idx: number): void;
declare function cancelEdit(): void;
declare function removeRow(idx: number): void;
declare function setupEventListeners(): void;
declare function init(): void;
//# sourceMappingURL=script.d.ts.map