(function () {
  interface StatementRow {
    id?: number;
    date: string;
    header: string;
    credit: number;
    debit: number;
  }

  const API_BASE = 'http://localhost:5001';
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

  async function load(): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/statements`);
      if (!res.ok) throw new Error('Failed to load');
      rows = await res.json();
    } catch (e) {
      console.error('Error loading statements', e);
      rows = [];
    }
  }

  async function createRow(data: Omit<StatementRow, 'id'>): Promise<void> {
    const res = await fetch(`${API_BASE}/statements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create');
  }

  async function updateRow(id: number, data: Omit<StatementRow, 'id'>): Promise<void> {
    const res = await fetch(`${API_BASE}/statements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update');
  }

  async function deleteRow(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/statements/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete');
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

  async function addRow(): Promise<void> {
    const cVal = creditInput.value ? Number(creditInput.value) : 0;
    const dVal = debitInput.value ? Number(debitInput.value) : 0;

    if (cVal > 0 && dVal > 0) {
      alert('Enter either Credit or Debit, not both.');
      return;
    }

    if (cVal === 0 && dVal === 0) {
      alert('Enter at least a Credit or a Debit amount.');
      return;
    }

    const data: Omit<StatementRow, 'id'> = {
      date: dateInput.value || new Date().toISOString().slice(0, 10),
      header: headerInput.value.trim(),
      credit: cVal,
      debit: dVal,
    };

    if (!data.header) {
      alert('Header required');
      return;
    }

    try {
      await createRow(data);
      await load();
      render();
      clearInputs();
    } catch (e) {
      console.error(e);
      alert('Failed to add statement');
    }
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

  async function saveEdit(idx: number): Promise<void> {
    const form = stmtRows.querySelector(`form[data-i="${idx}"]`) as HTMLFormElement;
    const dateField = form.querySelector('.date-field') as HTMLInputElement;
    const headerField = form.querySelector('.header-field') as HTMLInputElement;
    const creditField = form.querySelector('.credit-field') as HTMLInputElement;
    const debitField = form.querySelector('.debit-field') as HTMLInputElement;

    const updatedPayload: Omit<StatementRow, 'id'> = {
      date: dateField.value,
      header: headerField.value.trim(),
      credit: creditField.value ? Number(creditField.value) : 0,
      debit: debitField.value ? Number(debitField.value) : 0,
    };

    if (!updatedPayload.header) {
      alert('Header required');
      return;
    }

    if (updatedPayload.credit > 0 && updatedPayload.debit > 0) {
      alert('Enter either Credit or Debit, not both.');
      return;
    }

    if (updatedPayload.credit === 0 && updatedPayload.debit === 0) {
      alert('Enter at least a Credit or a Debit amount.');
      return;
    }

    const existing = rows[idx];
    if (!existing || existing.id == null) {
      alert('Cannot update this row');
      return;
    }

    try {
      await updateRow(existing.id, updatedPayload);
      await load();
      render();
    } catch (e) {
      console.error(e);
      alert('Failed to save changes');
    }
  }

  function cancelEdit(): void {
    render();
  }

  async function removeRow(idx: number): Promise<void> {
    if (!confirm('Remove this entry?')) return;

    const existing = rows[idx];
    if (!existing || existing.id == null) {
      alert('Cannot delete this row');
      return;
    }

    try {
      await deleteRow(existing.id);
      await load();
      render();
    } catch (e) {
      console.error(e);
      alert('Failed to remove');
    }
  }

  function setupEventListeners(): void {
    addBtn.addEventListener('click', () => addRow());

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

  async function init(): Promise<void> {
    initDOM();
    await load();
    render();
    setupEventListeners();
    setupMutualExclusive(creditInput, debitInput);
  }

  document.addEventListener('DOMContentLoaded', () => {
    init();
  });
})();
