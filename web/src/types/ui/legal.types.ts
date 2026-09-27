export interface LegalSectionSubItem {
  id?: string;
  title: string;
  description?: string;
  points?: string[];
  note?: string;
}

export interface LegalRoleItem {
  role: string;
  description: string;
  attributes?: string[];
  note?: string;
}

export interface LegalSection {
  id: string; // e.g. "section-01"
  number: string; // e.g. "01"
  title: string;
  lead?: string;
  subsections?: LegalSectionSubItem[];
  points?: string[];
  roles?: LegalRoleItem[];
  tags?: string[];
  checks?: string[];
  contactBox?: {
    title: string;
    subtitle?: string;
    email?: string;
    website?: string;
    note?: string;
  };
  agreementBox?: {
    title: string;
    paragraphs: string[];
    warning?: string;
  };
  customNote?: string;
}

export interface LegalDocData {
  title: string;
  badge: string;
  lastUpdated: string;
  intro: {
    greeting: string;
    paragraphs: string[];
    highlightCallout?: string;
  };
  sections: LegalSection[];
  sidebarQuestion: {
    question: string;
    actionText: string;
    href: string;
  };
}
