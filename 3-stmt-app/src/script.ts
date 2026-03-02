// Simple statement manager using localStorage. No frameworks.

interface StatementRow {
  date: string;
  header: string;
  credit: number;
  debit: number;
}

const STORAGE_KEY = 'stmt_app_rows_v1';
let rows: StatementRow[] = [];

// DOM elements
let dateInput: HTMLInputElement;
let headerInput: HTMLInputElement;
let creditInput: HTMLInputElement;
let debitInput: HTMLInputElement;
let addBtn: HTMLButtonElement;
let stmtRows: HTMLElement;
let totalCreditEl: HTMLElement;
let totalDebitEl: HTMLElement;
let balanceEl: HTMLElement;

function getElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector(selector) as T | null;
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }
  return element;
}

function initDOM(): void {
  dateInput = getElement<HTMLInputElement>('#date');
  headerInput = getElement<HTMLInputElement>('#header');
  creditInput = getElement<HTMLInputElement>('#credit');
  debitInput = getElement<HTMLInputElement>('#debit');
  addBtn = getElement<HTMLButtonElement>('#addBtn');
  stmtRows = getElement<HTMLElement>('#stmtRows');
  totalCreditEl = getElement<HTMLElement>('#totalCredit');
  totalDebitEl = getElement<HTMLElement>('#totalDebit');
  balanceEl = getElement<HTMLElement>('#balance');
}

function load(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    rows = raw ? JSON.parse(raw) : [];
  } catch (e) {
    rows = [];
  }
}

function save(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

function formatNumber(n: number): string {
  return Number(n).toLocaleString();
}

function render(): void {
  stmtRows.innerHTML = '';
  let totalCredit = 0;
  let totalDebit = 0;

  rows.forEach((r: StatementRow, idx: number) => {
    const form = document.createElement('form');
    form.className = 'stmt-row';
    form.setAttribute('data-i', idx.toString());
    form.innerHTML = `
      <div class="row g-2">
        <div class="col-md-1 row-number">${idx + 1}</div>
        <div class="col-md-2"><input type="date" class="form-control form-control-sm date-field" value="${r.date || ''}" readonly></div>
        <div class="col-md-3"><input type="text" class="form-control form-control-sm header-field" value="${r.header || ''}" readonly></div>
        <div class="col-md-2"><input type="number" class="form-control form-control-sm credit-field" value="${r.credit || ''}" readonly min="0"></div>
        <div class="col-md-2"><input type="number" class="form-control form-control-sm debit-field" value="${r.debit || ''}" readonly min="0"></div>
        <div class="col-md-2">
          <div class="actions">
            <button type="button" class="btn btn-sm btn-outline-primary edit" data-i="${idx}">Edit</button>
            <button type="button" class="btn btn-sm btn-outline-danger delete" data-i="${idx}">Remove</button>
          </div>
        </div>
      </div>
    `;
    stmtRows.appendChild(form);
    totalCredit += Number(r.credit || 0);
    totalDebit += Number(r.debit || 0);
  });

  totalCreditEl.textContent = formatNumber(totalCredit);
  totalDebitEl.textContent = formatNumber(totalDebit);
  balanceEl.textContent = formatNumber(totalCredit - totalDebit);
}

function addRow(): void {
  const cVal = creditInput.value ? Number(creditInput.value) : 0;
  const dVal = debitInput.value ? Number(debitInput.value) : 0;

  if (cVal > 0 && dVal > 0) {
    alert('Enter either Credit or Debit, not both.');
    return;
  }

  const data: StatementRow = {
    date: dateInput.value,
    header: headerInput.value.trim(),
    credit: cVal,
    debit: dVal,
  };

  if (!data.header) {
    alert('Header required');
    return;
  }

  if (!data.date) {
    data.date = new Date().toISOString().slice(0, 10);
  }

  rows.push(data);
  save();
  render();
  clearInputs();
}

function clearInputs(): void {
  headerInput.value = '';
  creditInput.value = '';
  debitInput.value = '';
  creditInput.disabled = false;
  debitInput.disabled = false;
}

function editRow(idx: number): void {
  const r = rows[idx];
  const form = stmtRows.querySelector(`form[data-i="${idx}"]`) as HTMLFormElement | null;
  if (!form) return;

  form.innerHTML = `
    <div class="row g-2">
      <div class="col-md-1 row-number">${idx + 1}</div>
      <div class="col-md-2"><input type="date" class="form-control form-control-sm date-field" value="${r.date || ''}"></div>
      <div class="col-md-3"><input type="text" class="form-control form-control-sm header-field" value="${r.header || ''}"></div>
      <div class="col-md-2"><input type="number" class="form-control form-control-sm credit-field" value="${r.credit || ''}" min="0"></div>
      <div class="col-md-2"><input type="number" class="form-control form-control-sm debit-field" value="${r.debit || ''}" min="0"></div>
      <div class="col-md-2">
        <div class="actions">
          <button type="button" class="btn btn-sm btn-success save" data-i="${idx}">Save</button>
          <button type="button" class="btn btn-sm btn-secondary cancel" data-i="${idx}">Cancel</button>
        </div>
      </div>
    </div>
  `;

  const creditField = form.querySelector('.credit-field') as HTMLInputElement;
  const debitField = form.querySelector('.debit-field') as HTMLInputElement;
  setupMutualExclusive(creditField, debitField);
}

function setupMutualExclusive(creditEl: HTMLInputElement, debitEl: HTMLInputElement): void {
  if (!creditEl || !debitEl) return;

  const update = (): void => {
    const c = creditEl.value ? Number(creditEl.value) : 0;
    const d = debitEl.value ? Number(debitEl.value) : 0;

    if (c > 0) {
      debitEl.value = '';
      debitEl.disabled = true;
      creditEl.disabled = false;
    } else if (d > 0) {
      creditEl.value = '';
      creditEl.disabled = true;
      debitEl.disabled = false;
    } else {
      creditEl.disabled = false;
      debitEl.disabled = false;
    }
  };

  creditEl.addEventListener('input', update);
  debitEl.addEventListener('input', update);
  update();
}

function saveEdit(idx: number): void {
  const form = stmtRows.querySelector(`form[data-i="${idx}"]`) as HTMLFormElement;
  const dateField = form.querySelector('.date-field') as HTMLInputElement;
  const headerField = form.querySelector('.header-field') as HTMLInputElement;
  const creditField = form.querySelector('.credit-field') as HTMLInputElement;
  const debitField = form.querySelector('.debit-field') as HTMLInputElement;

  const updated: StatementRow = {
    date: dateField.value,
    header: headerField.value.trim(),
    credit: creditField.value ? Number(creditField.value) : 0,
    debit: debitField.value ? Number(debitField.value) : 0,
  };

  if (!updated.header) {
    alert('Header required');
    return;
  }

  if (updated.credit > 0 && updated.debit > 0) {
    alert('Enter either Credit or Debit, not both.');
    return;
  }

  rows[idx] = updated;
  save();
  render();
}

function cancelEdit(): void {
  render();
}

function removeRow(idx: number): void {
  if (!confirm('Remove this entry?')) return;
  rows.splice(idx, 1);
  save();
  render();
}

function setupEventListeners(): void {
  // Add button click
  addBtn.addEventListener('click', () => addRow());

  // Event delegation for statement rows
  stmtRows.addEventListener('click', (e: MouseEvent) => {
    const btn = (e.target as HTMLElement).closest('button');
    if (!btn) return;

    const idx = Number(btn.getAttribute('data-i'));

    if (btn.classList.contains('edit')) {
      editRow(idx);
    } else if (btn.classList.contains('delete')) {
      removeRow(idx);
    } else if (btn.classList.contains('save')) {
      saveEdit(idx);
    } else if (btn.classList.contains('cancel')) {
      cancelEdit();
    }
  });
}

function init(): void {
  initDOM();
  load();
  render();
  setupEventListeners();
  setupMutualExclusive(creditInput, debitInput);
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  init();
});
