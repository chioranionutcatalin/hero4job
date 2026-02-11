'use client';

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { toggleSection } from "../../app/store/selectionsSlice";
import {
  clearEducationData,
  clearLanguagesData,
  clearSkillsData,
} from "../../app/store/cvSlice";
import styles from "../page.module.css";

export function SideNavigation() {
  const sections = useAppSelector((state) => state.sections);
  const dispatch = useAppDispatch();

  const handleToggle = (section: keyof typeof sections) => {
    const isEnabled = sections[section];
    if (isEnabled) {
      if (section === "skills") {
        dispatch(clearSkillsData());
      }
      if (section === "languages") {
        dispatch(clearLanguagesData());
      }
      if (section === "education") {
        dispatch(clearEducationData());
      }
    }
    dispatch(toggleSection(section));
  };

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <img
          src="/FASTCV_LOGO.png"
          alt="FastCV"
          className={styles.logo}
        />
      </div>

      <nav className={styles.nav}>
        <NavLink href="/personal" label="Personal Info" />

        <NavLink href="/experience" label="Work Experience" />

        <NavToggle
          href="/skills"
          label="Skills"
          checked={sections.skills}
          onToggle={() => handleToggle("skills")}
        />

        <NavToggle
          href="/languages"
          label="Languages"
          checked={sections.languages}
          onToggle={() => handleToggle("languages")}
        />

        <NavToggle
          href="/education"
          label="Education"
          checked={sections.education}
          onToggle={() => handleToggle("education")}
        />

        <div className={styles.divider} />

        <NavLink href="/preview" label="Preview CV" />
        <NavLink href="/download" label="Download CV" />
      </nav>
    </aside>
  );
}

/* ========== Helpers ========== */

function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <div className={styles.navItem}>
      <Link href={href} className={styles.navButton}>
        {label}
      </Link>
    </div>
  );
}

function NavToggle({
  href,
  label,
  checked,
  onToggle,
}: {
  href: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={styles.navItem}>
      <Link href={href} className={styles.navButton}>
        {label}
      </Link>

      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
        />
        <span className={styles.slider} />
      </label>
    </div>
  );
}
