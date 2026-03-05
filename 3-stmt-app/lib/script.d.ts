interface StatementRow {
    id?: number;
    date: string;
    header: string;
    credit: number;
    debit: number;
}
declare const API_BASE = "http://localhost:5001";
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
declare function load(): Promise<void>;
declare function createRow(data: Omit<StatementRow, 'id'>): Promise<void>;
declare function updateRow(id: number, data: Omit<StatementRow, 'id'>): Promise<void>;
declare function deleteRow(id: number): Promise<void>;
declare function formatNumber(n: number): string;
declare function render(): void;
declare function addRow(): Promise<void>;
declare function clearInputs(): void;
declare function editRow(idx: number): void;
declare function setupMutualExclusive(creditEl: HTMLInputElement, debitEl: HTMLInputElement): void;
declare function saveEdit(idx: number): Promise<void>;
declare function cancelEdit(): void;
declare function removeRow(idx: number): Promise<void>;
declare function setupEventListeners(): void;
declare function init(): Promise<void>;
//# sourceMappingURL=script.d.ts.map