import { useEffect } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { StatementRow, StatementPayload } from '../types';

interface StatementRowProps {
  row: StatementRow;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: StatementPayload) => Promise<boolean>;
  onCancel: () => void;
  onDelete: () => void;
}

interface FormInputs {
  date: string;
  header: string;
  credit: string;
  debit: string;
}

const validationSchema = Yup.object().shape({
  date: Yup.string()
    .test('not-future', 'Date cannot be in the future', (value) => {
      if (!value) return true;
      return new Date(value) <= new Date();
    }),
  header: Yup.string()
    .required('Header is required')
    .min(2, 'Header must be at least 2 characters')
    .max(50, 'Header must be less than 50 characters')
    .matches(/^[A-Za-z0-9\s\-]+$/, 'Only letters, numbers, spaces, and hyphens allowed'),
  credit: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .min(0, 'Credit must be positive')
    .nullable(),
  debit: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .min(0, 'Debit must be positive')
    .nullable(),
}).test('credit-or-debit', 'Enter either Credit or Debit, not both', function (values) {
  const credit = values.credit ? Number(values.credit) : 0;
  const debit = values.debit ? Number(values.debit) : 0;

  if (credit > 0 && debit > 0) {
    return this.createError({
      path: 'credit',
      message: 'Enter either Credit or Debit, not both',
    });
  }

  if (credit === 0 && debit === 0) {
    return this.createError({
      path: 'credit',
      message: 'Enter at least a Credit or a Debit amount',
    });
  }

  return true;
});

function StatementRowComponent({
  row,
  index,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: StatementRowProps) {
  const initialValues: FormInputs = {
    date: row.date || '',
    header: row.header || '',
    credit: row.credit ? String(row.credit) : '',
    debit: row.debit ? String(row.debit) : '',
  };

  const handleSubmit = async (
    values: FormInputs,
    { setSubmitting }: FormikHelpers<FormInputs>
  ) => {
    const cVal = values.credit ? Number(values.credit) : 0;
    const dVal = values.debit ? Number(values.debit) : 0;

    const data: StatementPayload = {
      date: values.date,
      header: values.header.trim(),
      credit: cVal,
      debit: dVal,
    };

    await onSave(data);
    setSubmitting(false);
  };

  if (isEditing) {
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
        enableReinitialize={true}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => {
          const creditValue = values.credit ? Number(values.credit) : 0;
          const debitValue = values.debit ? Number(values.debit) : 0;
          const creditDisabled = debitValue > 0;
          const debitDisabled = creditValue > 0;

          useEffect(() => {
            if (creditDisabled && values.credit) {
              setFieldValue('credit', '');
            }
            if (debitDisabled && values.debit) {
              setFieldValue('debit', '');
            }
          }, [creditDisabled, debitDisabled, values.credit, values.debit, setFieldValue]);

          const getInputClassName = (fieldName: keyof FormInputs, additionalClasses = '') => {
            const baseClass = `form-control form-control-sm ${additionalClasses}`.trim();
            if (touched[fieldName] && errors[fieldName]) {
              return `${baseClass} is-invalid`;
            }
            return baseClass;
          };

          const getErrorMessage = (fieldName: keyof FormInputs): string => {
            return (touched[fieldName] && errors[fieldName]) || '';
          };

          return (
            <Form className="stmt-row">
              <div className="row g-2">
                <div className="col-md-1 row-number">{index + 1}</div>
                <div className="col-md-2">
                  <Field
                    type="date"
                    name="date"
                    className={getInputClassName('date', 'date-field')}
                    title={getErrorMessage('date')}
                    max={new Date().toISOString().slice(0, 10)}
                  />
                </div>
                <div className="col-md-3">
                  <Field
                    type="text"
                    name="header"
                    className={getInputClassName('header', 'header-field')}
                    title={getErrorMessage('header')}
                  />
                </div>
                <div className="col-md-2">
                  <Field
                    type="number"
                    name="credit"
                    className={getInputClassName('credit', 'credit-field')}
                    title={getErrorMessage('credit')}
                    disabled={creditDisabled}
                    min={0}
                    step="0.01"
                  />
                </div>
                <div className="col-md-2">
                  <Field
                    type="number"
                    name="debit"
                    className={getInputClassName('debit', 'debit-field')}
                    title={getErrorMessage('debit')}
                    disabled={debitDisabled}
                    min={0}
                    step="0.01"
                  />
                </div>
                <div className="col-md-2">
                  <div className="actions">
                    <button type="submit" className="btn btn-sm btn-success" disabled={isSubmitting}>
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={onCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  }

  return (
    <div className="stmt-row">
      <div className="row g-2">
        <div className="col-md-1 row-number">{index + 1}</div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control form-control-sm date-field"
            value={row.date || ''}
            readOnly
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control form-control-sm header-field"
            value={row.header || ''}
            readOnly
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control form-control-sm credit-field"
            value={row.credit || ''}
            readOnly
            min="0"
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control form-control-sm debit-field"
            value={row.debit || ''}
            readOnly
            min="0"
          />
        </div>
        <div className="col-md-2">
          <div className="actions">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={onEdit}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={onDelete}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatementRowComponent;
