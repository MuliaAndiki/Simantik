import {
  SchoolOnboardingForm,
  type SchoolOnboardingFormProps,
} from '@/components/organisms/onboarding/SchoolOnboardingForm';
import { AuthTemplate } from '@/components/templates/auth/AuthTemplate';

export type SchoolOnboardingPageProps = SchoolOnboardingFormProps;

export function SchoolOnboardingPage(props: SchoolOnboardingPageProps) {
  return (
    <AuthTemplate
      title="Lengkapi Profil Sekolah"
      description="Pilih sekolahmu untuk melanjutkan ke dashboard belajar"
    >
      <SchoolOnboardingForm {...props} />
    </AuthTemplate>
  );
}
