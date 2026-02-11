"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { FieldErrors, FieldPath } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setSkillsData } from "../../store/cvSlice";
import { SkillType } from "../../types";
import styles from "./page.module.css";

type SkillFormEntry = {
  name: string;
  proficiencyLevel?: SkillType["proficiencyLevel"];
  description?: string;
};

type SkillFormValues = {
  skills: SkillFormEntry[];
};

type SkillFieldPath = FieldPath<SkillFormValues>;

const levelOptions: SkillType["proficiencyLevel"][] = [
  "N/A",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];

const emptySkill: SkillFormEntry = {
  name: "",
  proficiencyLevel: "N/A",
  description: "",
};

export default function SkillsPage() {
  const dispatch = useAppDispatch();
  const skillsData = useAppSelector((state) => state.cv.skillsData);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const defaultValues = useMemo<SkillFormValues>(() => ({
    skills: skillsData.length ? skillsData : [emptySkill, { ...emptySkill }, { ...emptySkill }],
  }), [skillsData]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillFormValues>({
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: false,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const handleSave = useCallback(
    (data: SkillFormValues) => {
      const mapped = data.skills
        .map(entry => ({
          ...entry,
          name: entry.name.trim(),
          description: entry.description?.trim() || "",
        }))
        .filter(entry => entry.name);

      dispatch(setSkillsData(mapped));
    },
    [dispatch],
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleSave)}>
      <fieldset className={styles.skillsWrapper}>
        <legend className={styles.legend}>Skills</legend>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>
            Add your skills. This section is optional, but at least one skill
            will mark it as complete.
          </p>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => append({ ...emptySkill })}
          >
            + Add skill
          </button>
        </div>

        {isHydrated && (
          <div className={styles.skillsList}>
            {fields.map((field, index) => {
              const namePath = `skills.${index}.name` as SkillFieldPath;
              const levelPath = `skills.${index}.proficiencyLevel` as SkillFieldPath;
              const descriptionPath = `skills.${index}.description` as SkillFieldPath;

              return (
                <section key={field.id} className={styles.skillCard}>
                  <header className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>Skill #{index + 1}</h3>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => remove(index)}
                      >
                        Remove
                      </button>
                    )}
                  </header>

                  <div className={styles.formRow}>
                    <label className={styles.field}>
                      Skill *
                      <input
                        className={`${styles.customInput} ${getFieldError(namePath, errors) ? styles.inputError : ""}`}
                        placeholder="Web Development, Communication, etc."
                        {...register(namePath, {
                          required: "Skill name is required",
                        })}
                      />
                      {getFieldError(namePath, errors) && (
                        <span className={styles.errorText}>
                          {getFieldError(namePath, errors)}
                        </span>
                      )}
                    </label>
                    <label className={styles.field}>
                      Level
                      <select className={styles.selectInput} {...register(levelPath)}>
                        {levelOptions.map(level => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className={styles.field}>
                    Description (optional)
                    <textarea
                      className={styles.customInput}
                      rows={3}
                      placeholder="Short note about this skill"
                      {...register(descriptionPath)}
                    />
                  </label>
                </section>
              );
            })}
          </div>
        )}

        <button type="submit" className={styles.saveButton}>
          Save Skills
        </button>
      </fieldset>
    </form>
  );
}

function getFieldError(
  path: SkillFieldPath,
  errors: FieldErrors<SkillFormValues>,
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
