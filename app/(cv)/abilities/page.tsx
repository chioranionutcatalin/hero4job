"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { FieldErrors, FieldPath } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setSkillsData } from "../../store/cvSlice";
import { SkillType } from "../../types";
import styles from "./page.module.css";

type AbilityFormEntry = {
  name: string;
  proficiencyLevel?: SkillType["proficiencyLevel"];
  description?: string;
};

type AbilityFormValues = {
  abilities: AbilityFormEntry[];
};

type AbilityFieldPath = FieldPath<AbilityFormValues>;

const levelOptions: SkillType["proficiencyLevel"][] = [
  "N/A",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];

const emptyAbility: AbilityFormEntry = {
  name: "",
  proficiencyLevel: "N/A",
  description: "",
};

export default function AbilitiesPage() {
  const dispatch = useAppDispatch();
  const abilitiesData = useAppSelector((state) => state.cv.skillsData);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const defaultValues = useMemo<AbilityFormValues>(() => ({
    abilities: abilitiesData.length
      ? abilitiesData
      : [emptyAbility, { ...emptyAbility }, { ...emptyAbility }],
  }), [abilitiesData]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AbilityFormValues>({
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: false,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "abilities",
  });

  const handleSave = useCallback(
    (data: AbilityFormValues) => {
      const mapped = data.abilities
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
  console.log("Rendered AbilitiesPage", { abilitiesData, fields });
  return (
    <form className={styles.form} onSubmit={handleSubmit(handleSave)}>
      <fieldset className={styles.abilitiesWrapper}>
        <legend className={styles.legend}>Abilities</legend>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>
            Add your skills. This section is optional, but at least one ability
            will mark it as complete.
          </p>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => append({ ...emptyAbility })}
          >
            + Add ability
          </button>
        </div>

        {isHydrated && (
          <div className={styles.abilitiesList}>
            {fields.map((field, index) => {
              const namePath = `abilities.${index}.name` as AbilityFieldPath;
              const levelPath = `abilities.${index}.proficiencyLevel` as AbilityFieldPath;
              const descriptionPath = `abilities.${index}.description` as AbilityFieldPath;

              return (
                <section key={field.id} className={styles.abilityCard}>
                  <header className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>Ability #{index + 1}</h3>
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
                      Ability *
                      <input
                        className={`${styles.customInput} ${getFieldError(namePath, errors) ? styles.inputError : ""}`}
                        placeholder="Web Development, Communication, etc."
                        {...register(namePath, {
                          required: "Ability name is required",
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
                      placeholder="Short note about this ability"
                      {...register(descriptionPath)}
                    />
                  </label>
                </section>
              );
            })}
          </div>
        )}

        <button type="submit" className={styles.saveButton}>
          Save Abilities
        </button>
      </fieldset>
    </form>
  );
}

function getFieldError(
  path: AbilityFieldPath,
  errors: FieldErrors<AbilityFormValues>,
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
