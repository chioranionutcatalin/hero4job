"use client";

import { useEffect, useState } from "react";
import { SideNavigation } from "./components/SideNavigation";
import { useAppSelector } from "./store/hooks";
import type { DateParts } from "./types";
import styles from "./page.module.css";

export default function HomePage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const cv = useAppSelector((state) => state.cv);
  const sections = useAppSelector((state) => state.sections);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const fullName = [cv.personalData.firstName, cv.personalData.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.container}>
      <SideNavigation />
      <main className={styles.main}>
        <section className={styles.welcomeCard}>
          <h1>Welcome to FastCV</h1>
          <p>Select a section to start building your CV.</p>
        </section>

        {isHydrated && (
          <section className={styles.previewCard}>
          <header className={styles.previewHeader}>
            <h2>CV Preview</h2>
            <span className={styles.previewBadge}>Live</span>
          </header>

          <div className={styles.previewBody}>
            <div className={styles.previewTop}>
              <div>
                <h3 className={styles.previewName}>
                  {fullName || "Your Name"}
                </h3>
                {cv.personalData.desiredJobTitle && (
                  <div className={styles.previewRole}>
                    {cv.personalData.desiredJobTitle}
                  </div>
                )}
                {cv.personalData.summary && (
                  <p className={styles.previewSummary}>{cv.personalData.summary}</p>
                )}
              </div>

              {cv.personalData.profileImageUrl && (
                <img
                  className={styles.previewAvatar}
                  src={cv.personalData.profileImageUrl}
                  alt="Profile"
                />
              )}
            </div>

            <div className={styles.previewMeta}>
              {cv.personalData.email && <span>{cv.personalData.email}</span>}
              {cv.personalData.phone && <span>{cv.personalData.phone}</span>}
              {(cv.personalData.city || cv.personalData.country) && (
                <span>
                  {[cv.personalData.city, cv.personalData.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              )}
              {cv.personalData.linkedInUrl && (
                <span>{cv.personalData.linkedInUrl}</span>
              )}
              {cv.personalData.personalWebsite && (
                <span>{cv.personalData.personalWebsite}</span>
              )}
            </div>

            {sections.experience && (
              <section className={styles.previewSection}>
                <h4>Experience</h4>
                {cv.experienceData.length === 0 ? (
                  <p className={styles.previewEmpty}>No experience added.</p>
                ) : (
                  <div className={styles.previewList}>
                    {cv.experienceData.map((item, index) => (
                      <article key={`${item.companyName}-${index}`}>
                        <div className={styles.previewRow}>
                          <strong>{item.role}</strong>
                          <span>
                            {formatDateValue(item.startDate)} -
                            {item.stillWorkingHere
                              ? " Present"
                              : item.endDate
                                ? ` ${formatDateValue(item.endDate)}`
                                : ""}
                          </span>
                        </div>
                        <div className={styles.previewSubRow}>
                          <span>{item.companyName}</span>
                          {item.location && <span>{item.location}</span>}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {sections.skills && (
              <section className={styles.previewSection}>
                <h4>Skills</h4>
                {cv.skillsData.length === 0 ? (
                  <p className={styles.previewEmpty}>No skills added.</p>
                ) : (
                  <div className={styles.previewTags}>
                    {cv.skillsData.map((item, index) => (
                      <span key={`${item.name}-${index}`}>
                        {item.name}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            )}

            {sections.languages && (
              <section className={styles.previewSection}>
                <h4>Languages</h4>
                {cv.languagesData.length === 0 ? (
                  <p className={styles.previewEmpty}>No languages added.</p>
                ) : (
                  <ul className={styles.previewListSimple}>
                    {cv.languagesData.map((item, index) => (
                      <li key={`${item.language}-${index}`}>
                        {item.language}
                        {item.proficiencyLevel ? ` - ${item.proficiencyLevel}` : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {sections.education && (
              <section className={styles.previewSection}>
                <h4>Education</h4>
                {cv.educationData.length === 0 ? (
                  <p className={styles.previewEmpty}>No education added.</p>
                ) : (
                  <div className={styles.previewList}>
                    {cv.educationData.map((item, index) => (
                      <article key={`${item.institutionName}-${index}`}>
                        <div className={styles.previewRow}>
                          <strong>{item.institutionName}</strong>
                          <span>
                            {formatDateValue(item.startDate)} -
                            {item.endDate ? ` ${formatDateValue(item.endDate)}` : ""}
                          </span>
                        </div>
                        <div className={styles.previewSubRow}>
                          <span>
                            {item.degreeType || item.fieldOfStudy
                              ? [item.degreeType, item.fieldOfStudy]
                                  .filter(Boolean)
                                  .join(" - ")
                              : ""}
                          </span>
                          {item.location && <span>{item.location}</span>}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
          </section>
        )}
      </main>
    </div>
  );
}

function formatDateValue(value: DateParts | string | undefined): string {
  if (!value) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }

  const month = String(value.month).padStart(2, "0");
  const year = String(value.year);

  if (value.day === null) {
    return `${month}/${year}`;
  }

  const day = String(value.day).padStart(2, "0");
  return `${day}/${month}/${year}`;
}
