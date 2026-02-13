'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { toggleSection } from "../../app/store/selectionsSlice";
import { ThemeToggle } from "./ThemeToggle";
import styles from "../page.module.css";

const DOWNLOAD_LAYOUT_KEY = "hero4job_download_layout";
const LEGACY_DOWNLOAD_LAYOUT_KEY = "fastcv_download_layout";
const DOWNLOAD_LAYOUT_EVENT = "hero4job:download-layout";
const LEGACY_DOWNLOAD_LAYOUT_EVENT = "fastcv:download-layout";
const HOME_ROUTE = "/";
type DownloadLayout = "classic" | "compact";

export function SideNavigation() {
  const sections = useAppSelector((state) => state.sections);
  const personalData = useAppSelector((state) => state.cv.personalData);
  const dispatch = useAppDispatch();
  const [downloadLayout, setDownloadLayout] = useState<DownloadLayout>("classic");

  useEffect(() => {
    const stored =
      window.localStorage.getItem(DOWNLOAD_LAYOUT_KEY) ??
      window.localStorage.getItem(LEGACY_DOWNLOAD_LAYOUT_KEY);
    if (stored === "classic" || stored === "compact") {
      setDownloadLayout(stored);
    } else if (stored) {
      setDownloadLayout("compact");
      window.localStorage.setItem(DOWNLOAD_LAYOUT_KEY, "compact");
      window.localStorage.setItem(LEGACY_DOWNLOAD_LAYOUT_KEY, "compact");
    }

    const syncFromStorage = () => {
      const next =
        window.localStorage.getItem(DOWNLOAD_LAYOUT_KEY) ??
        window.localStorage.getItem(LEGACY_DOWNLOAD_LAYOUT_KEY);
      if (next === "classic" || next === "compact") {
        setDownloadLayout(next);
      } else if (next) {
        setDownloadLayout("compact");
        window.localStorage.setItem(DOWNLOAD_LAYOUT_KEY, "compact");
        window.localStorage.setItem(LEGACY_DOWNLOAD_LAYOUT_KEY, "compact");
      }
    };

    const handleLayoutChange = () => {
      syncFromStorage();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== DOWNLOAD_LAYOUT_KEY && event.key !== LEGACY_DOWNLOAD_LAYOUT_KEY) {
        return;
      }
      syncFromStorage();
    };

    window.addEventListener(DOWNLOAD_LAYOUT_EVENT, handleLayoutChange as EventListener);
    window.addEventListener(LEGACY_DOWNLOAD_LAYOUT_EVENT, handleLayoutChange as EventListener);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(DOWNLOAD_LAYOUT_EVENT, handleLayoutChange as EventListener);
      window.removeEventListener(LEGACY_DOWNLOAD_LAYOUT_EVENT, handleLayoutChange as EventListener);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const handleToggle = (section: keyof typeof sections) => {
    dispatch(toggleSection(section));
  };

  const handleDownload = async () => {
    const previewId =
      downloadLayout === "compact" ? "cv-preview-compact" : "cv-preview-classic";
    const preview = document.getElementById(previewId);
    if (!preview) {
      window.alert("Open Home or Preview My CV to download the selected preview.");
      return;
    }

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    const EXPORT_RENDER_WIDTH_PX = 1100;

    const exportRoot = document.createElement("div");
    exportRoot.style.position = "fixed";
    exportRoot.style.left = "-10000px";
    exportRoot.style.top = "0";
    exportRoot.style.width = `${EXPORT_RENDER_WIDTH_PX}px`;
    exportRoot.style.padding = "0";
    exportRoot.style.margin = "0";
    exportRoot.style.background = "#ffffff";
    exportRoot.style.color = "#0f172a";
    exportRoot.style.fontSize = "14px";
    exportRoot.style.lineHeight = "1.4";
    exportRoot.style.setProperty("--app-bg", "#f1f5f9");
    exportRoot.style.setProperty("--panel-bg", "#ffffff");
    exportRoot.style.setProperty("--surface-bg", "#ffffff");
    exportRoot.style.setProperty("--panel-border", "#e2e8f0");
    exportRoot.style.setProperty("--panel-hover", "#f8fafc");
    exportRoot.style.setProperty("--text-primary", "#0f172a");
    exportRoot.style.setProperty("--text-muted", "#475569");
    exportRoot.style.setProperty("--input-bg", "#ffffff");
    exportRoot.style.setProperty("--input-border", "#cbd5f5");
    exportRoot.style.setProperty("--input-text", "#0f172a");
    exportRoot.style.setProperty("--accent", "#22c55e");
    exportRoot.style.setProperty("--accent-strong", "#16a34a");
    exportRoot.style.setProperty("--danger", "#ef4444");
    exportRoot.style.setProperty("--danger-muted", "#fca5a5");
    exportRoot.style.setProperty("--success", "#16a34a");
    exportRoot.style.setProperty("--paper-bg", "#ffffff");
    exportRoot.style.setProperty("--paper-border", "#e5e7eb");
    exportRoot.style.setProperty("--paper-text", "#0b0b0b");
    exportRoot.style.setProperty("--paper-muted", "#4b5563");

    const previewClone = preview.cloneNode(true) as HTMLElement;
    previewClone.removeAttribute("id");
    previewClone.style.border = "none";
    previewClone.style.boxShadow = "none";
    previewClone.style.background = "#ffffff";
    previewClone.style.color = "#0f172a";
    previewClone.style.width = "100%";
    previewClone.style.maxWidth = "none";

    exportRoot.appendChild(previewClone);
    document.body.appendChild(exportRoot);

    let canvas: HTMLCanvasElement;
    try {
      canvas = await html2canvas(exportRoot, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: EXPORT_RENDER_WIDTH_PX,
        windowWidth: EXPORT_RENDER_WIDTH_PX,
      });
    } finally {
      exportRoot.remove();
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const imageData = canvas.toDataURL("image/png");
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 8;
    const printableWidth = pageWidth - margin * 2;
    const printableHeight = pageHeight - margin * 2;
    const imageHeightOnPage = (canvas.height * printableWidth) / canvas.width;

    let heightLeft = imageHeightOnPage;
    let yOffset = margin;

    pdf.addImage(imageData, "PNG", margin, yOffset, printableWidth, imageHeightOnPage);
    heightLeft -= printableHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      yOffset = margin - (imageHeightOnPage - heightLeft);
      pdf.addImage(imageData, "PNG", margin, yOffset, printableWidth, imageHeightOnPage);
      heightLeft -= printableHeight;
    }
    const safeFirstName = (personalData.firstName || "")
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");
    const safeLastName = (personalData.lastName || "")
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");

    const filenameBase = [safeFirstName, safeLastName]
      .filter(Boolean)
      .join("_");
    const modelSuffix = downloadLayout === "compact" ? "compact" : "classic";
    const fileName = filenameBase
      ? `${filenameBase}_${modelSuffix}_cv.pdf`
      : `${modelSuffix}_cv.pdf`;

    pdf.save(fileName);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <Link href={HOME_ROUTE} aria-label="Hero for Job home">
          <img className={styles.logo} src="/hero4job-logo.svg" alt="hero4job" />
        </Link>
      </div>
      <nav className={styles.nav}>
        <NavLink href={HOME_ROUTE} label="Home" />

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

        <ThemeToggle />

        <div className={styles.divider} />

        <NavLink href="/preview" label="Preview My CV" />

        <div className={styles.navItem}>
          <button
            type="button"
            className={styles.navButton}
            onClick={handleDownload}
          >
            Download CV
          </button>
        </div>

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
