import { useEffect } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { StatementPayload } from '../types';

interface StatementFormProps {
  onAdd: (data: StatementPayload) => Promise<boolean>;
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

const initialValues: FormInputs = {
  date: '',
  header: '',
  credit: '',
  debit: '',
};

function StatementForm({ onAdd }: StatementFormProps) {
  const handleSubmit = async (
    values: FormInputs,
    { resetForm, setSubmitting }: FormikHelpers<FormInputs>
  ) => {
    const cVal = values.credit ? Number(values.credit) : 0;
    const dVal = values.debit ? Number(values.debit) : 0;

    const data: StatementPayload = {
      date: values.date || new Date().toISOString().slice(0, 10),
      header: values.header.trim(),
      credit: cVal,
      debit: dVal,
    };

    const success = await onAdd(data);
    if (success) {
      resetForm();
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnChange={true}
      validateOnBlur={true}
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

        const getInputClassName = (fieldName: keyof FormInputs) => {
          const baseClass = 'form-control';
          if (touched[fieldName] && errors[fieldName]) {
            return `${baseClass} is-invalid`;
          }
          return baseClass;
        };

        const getErrorMessage = (fieldName: keyof FormInputs): string => {
          return (touched[fieldName] && errors[fieldName]) || '';
        };

        return (
          <Form className="row g-2 mb-4" noValidate>
            <div className="col-md-2">
              <Field
                type="date"
                name="date"
                className={getInputClassName('date')}
                title={getErrorMessage('date') || 'Select a date'}
                max={new Date().toISOString().slice(0, 10)}
              />
            </div>
            <div className="col-md-3">
              <Field
                type="text"
                name="header"
                className={getInputClassName('header')}
                placeholder="Header (e.g., Salary)"
                title={getErrorMessage('header') || 'Enter transaction description (2-50 chars)'}
              />
            </div>
            <div className="col-md-2">
              <Field
                type="number"
                name="credit"
                className={getInputClassName('credit')}
                placeholder="Credit"
                title={getErrorMessage('credit') || 'Enter credit amount'}
                disabled={creditDisabled}
                min={0}
                step="0.01"
              />
            </div>
            <div className="col-md-2">
              <Field
                type="number"
                name="debit"
                className={getInputClassName('debit')}
                placeholder="Debit"
                title={getErrorMessage('debit') || 'Enter debit amount'}
                disabled={debitDisabled}
                min={0}
                step="0.01"
              />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                Add
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default StatementForm;
