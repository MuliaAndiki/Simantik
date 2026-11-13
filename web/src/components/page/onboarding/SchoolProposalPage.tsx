import {
  SchoolProposalTemplate,
  type SchoolProposalTemplateProps,
} from '@/components/templates/onboarding/SchoolProposalTemplate';

export type { SchoolProposalTemplateProps };

export function SchoolProposalPage(props: SchoolProposalTemplateProps) {
  return <SchoolProposalTemplate {...props} />;
}
