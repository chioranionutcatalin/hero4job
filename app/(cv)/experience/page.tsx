"use client";

import { useCallback, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { FieldErrors, FieldPath } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setExperienceData } from "../../store/cvSlice";
import { DateParts, ExperienceType } from "../../types";
import styles from "./page.module.css";

type ExperienceFormEntry = {
  role: string;
  companyName: string;
  startDate: string;
  endDate?: string;
  location?: string;
  remote?: boolean;
  stillWorkingHere?: boolean;
  description?: string;
};

type ExperienceFormValues = {
  experienceData: ExperienceFormEntry[];
};

type ExperienceFieldPath = FieldPath<ExperienceFormValues>;

const emptyExperience: ExperienceFormEntry = {
  role: "",
  companyName: "",
  startDate: "",
  endDate: "",
  location: "",
  remote: false,
  stillWorkingHere: false,
  description: "",
};

export default function ExperiencePage() {
  const dispatch = useAppDispatch();
  const experienceData = useAppSelector((state) => state.cv.experienceData);

  const defaultValues = useMemo<ExperienceFormValues>(() => {
    return {
      experienceData: experienceData.length
        ? experienceData.map(entry => ({
            ...entry,
            startDate: formatDateValue(entry.startDate as DateParts | string),
            endDate: entry.endDate
              ? formatDateValue(entry.endDate as DateParts | string)
              : "",
          }))
        : [emptyExperience],
    };
  }, [experienceData]);

  const {
    register,
    control,
    getValues,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<ExperienceFormValues>({
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: false,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experienceData",
  });

  const isFieldValid = useCallback(
    (path: ExperienceFieldPath, requireValue = true) => {
      const value = getValues(path) as unknown;
      const hasValue =
        !requireValue ||
        (typeof value === "string" ? value.trim() !== "" : Boolean(value));
      return isSubmitted && !getFieldError(path, errors) && hasValue;
    },
    [errors, getValues, isSubmitted],
  );

  const handleSave = useCallback(
    (data: ExperienceFormValues) => {
      const mapped = data.experienceData.map(entry => ({
        ...entry,
        startDate: parseDateInput(entry.startDate) as DateParts,
        endDate: entry.endDate ? parseDateInput(entry.endDate) : undefined,
      }));
      dispatch(setExperienceData(mapped));
    },
    [dispatch],
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleSave)}>
      <fieldset className={styles.experienceWrapper}>
        <legend className={styles.legend}>Experience</legend>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>
            Add your relevant roles. At least one entry is required.
          </p>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => append({ ...emptyExperience })}
          >
            + Add experience
          </button>
        </div>

        <div className={styles.experienceList}>
          {fields.map((field, index) => {
            const rolePath = `experienceData.${index}.role` as ExperienceFieldPath;
            const companyPath = `experienceData.${index}.companyName` as ExperienceFieldPath;
            const startPath = `experienceData.${index}.startDate` as ExperienceFieldPath;
            const endPath = `experienceData.${index}.endDate` as ExperienceFieldPath;
            const locationPath = `experienceData.${index}.location` as ExperienceFieldPath;
            const remotePath = `experienceData.${index}.remote` as ExperienceFieldPath;
            const stillPath = `experienceData.${index}.stillWorkingHere` as ExperienceFieldPath;
            const descriptionPath = `experienceData.${index}.description` as ExperienceFieldPath;

            const isPresent = Boolean(watch(stillPath));
            const isRemote = Boolean(watch(remotePath));

            return (
              <section key={field.id} className={styles.experienceCard}>
                <header className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Experience #{index + 1}</h3>
                  {fields.length > 1 && (
                    <div className={styles.cardActions}>
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => remove(index)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </header>

                <div className={styles.inlineFields}>
                  <label className={styles.field}>
                    Job Title *
                    <input
                      className={`${styles.customInput} ${getFieldError(rolePath, errors) ? styles.inputError : ""}`}
                      placeholder="Job title"
                      {...register(rolePath, {
                        required: "Job title is required",
                      })}
                    />
                    {getFieldError(rolePath, errors) && (
                      <span className={styles.errorText}>
                        {getFieldError(rolePath, errors)}
                      </span>
                    )}
                    {isFieldValid(rolePath) && (
                      <span className={styles.validText}>OK</span>
                    )}
                  </label>
                  <label className={styles.field}>
                    Company *
                    <input
                      className={`${styles.customInput} ${getFieldError(companyPath, errors) ? styles.inputError : ""}`}
                      placeholder="Company name"
                      {...register(companyPath, {
                        required: "Company is required",
                      })}
                    />
                    {getFieldError(companyPath, errors) && (
                      <span className={styles.errorText}>
                        {getFieldError(companyPath, errors)}
                      </span>
                    )}
                    {isFieldValid(companyPath) && (
                      <span className={styles.validText}>OK</span>
                    )}
                  </label>
                </div>

                <div className={styles.inlineFields}>
                  <div className={styles.field}>
                    <label>
                      Start Date *
                      <input
                        className={`${styles.customInput} ${getFieldError(startPath, errors) ? styles.inputError : ""}`}
                        placeholder="MM/YYYY or DD/MM/YYYY"
                        {...register(startPath, {
                          required: "Start date is required",
                          pattern: {
                            value: /^(0[1-9]|1[0-2])\/\d{4}$|^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
                            message: "Use MM/YYYY or DD/MM/YYYY",
                          },
                        })}
                      />
                    </label>
                    <small>Format: MM/YYYY or DD/MM/YYYY</small>
                    {getFieldError(startPath, errors) && (
                      <span className={styles.errorText}>
                        {getFieldError(startPath, errors)}
                      </span>
                    )}
                    {isFieldValid(startPath) && (
                      <span className={styles.validText}>OK</span>
                    )}
                  </div>
                  <div className={styles.field}>
                    <label>
                      End Date
                      <input
                        className={styles.customInput}
                        placeholder="MM/YYYY or DD/MM/YYYY"
                        disabled={isPresent}
                        {...register(endPath, {
                          validate: value => {
                            if (watch(stillPath)) {
                              return true;
                            }
                            if (typeof value !== "string" || value.trim() === "") {
                              return "End date is required";
                            }
                            return (
                              /^(0[1-9]|1[0-2])\/\d{4}$|^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(
                                value,
                              ) || "Use MM/YYYY or DD/MM/YYYY"
                            );
                          },
                        })}
                      />
                    </label>
                    <small>Format: MM/YYYY or DD/MM/YYYY</small>
                    {getFieldError(endPath, errors) && (
                      <span className={styles.errorText}>
                        {getFieldError(endPath, errors)}
                      </span>
                    )}
                    {isFieldValid(endPath) && (
                      <span className={styles.validText}>OK</span>
                    )}
                  </div>
                </div>

                <div className={styles.inlineFields}>
                  <div className={`${styles.field} ${styles.fullRow}`}>
                    <div className={styles.switchRow}>
                      <span>Still working here</span>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          {...register(stillPath, {
                            onChange: event => {
                              const checked = event.target.checked;
                              if (checked) {
                                setValue(endPath, "", { shouldDirty: true });
                              }
                            },
                          })}
                        />
                        <span className={styles.slider} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className={styles.inlineFields}>
                  <div className={styles.field}>
                    <label>
                      Location
                      <input
                        className={styles.customInput}
                        placeholder="Location"
                        disabled={isRemote}
                        {...register(locationPath)}
                      />
                    </label>
                    <div className={styles.switchRow}>
                      <span>Remote</span>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          {...register(remotePath, {
                            onChange: event => {
                              const checked = event.target.checked;
                              const currentValue = getValues(locationPath);
                              const current =
                                typeof currentValue === "string" ? currentValue : "";
                              const withoutRemote = current
                                .replace(/\s*\(Remote\)\s*$/i, "")
                                .trim();

                              const next = checked
                                ? (withoutRemote ? `${withoutRemote} (Remote)` : "Remote")
                                : withoutRemote;

                              setValue(locationPath, next, { shouldDirty: true });
                            },
                          })}
                        />
                        <span className={styles.slider} />
                      </label>
                    </div>
                  </div>
                </div>

                <label className={styles.field}>
                  Job Description
                  <textarea
                    className={styles.customInput}
                    placeholder="Describe your responsibilities and achievements"
                    rows={4}
                    {...register(descriptionPath)}
                  />
                </label>
              </section>
            );
          })}
        </div>

        <button type="submit" className={styles.saveButton}>
          Save Experience
        </button>
      </fieldset>
    </form>
  );
}

function getFieldError(
  path: ExperienceFieldPath,
  errors: FieldErrors<ExperienceFormValues>,
) {
  const parts = path.split(".");
  let current: unknown = errors;
  for (const part of parts) {
    if (!current || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  if (current && typeof current === "object") {
    return (current as { message?: string }).message;
  }

  return undefined;
}

function parseDateInput(value: string): DateParts | undefined {
  const trimmed = value.trim();
  const monthYear = /^(0[1-9]|1[0-2])\/(\d{4})$/;
  const dayMonthYear = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;

  const monthYearMatch = trimmed.match(monthYear);
  if (monthYearMatch) {
    return {
      day: null,
      month: Number(monthYearMatch[1]),
      year: Number(monthYearMatch[2]),
    };
  }

  const dayMonthYearMatch = trimmed.match(dayMonthYear);
  if (dayMonthYearMatch) {
    return {
      day: Number(dayMonthYearMatch[1]),
      month: Number(dayMonthYearMatch[2]),
      year: Number(dayMonthYearMatch[3]),
    };
  }

  return undefined;
}

function formatDateValue(value: DateParts | string): string {
  if (typeof value === "string") {
    const parsed = parseDateInput(value);
    return parsed ? formatDateValue(parsed) : value;
  }

  const month = String(value.month).padStart(2, "0");
  const year = String(value.year);

  if (value.day === null) {
    return `${month}/${year}`;
  }

  const day = String(value.day).padStart(2, "0");
  return `${day}/${month}/${year}`;
}
