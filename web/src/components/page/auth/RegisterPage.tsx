import { RegisterForm, type RegisterFormProps } from '@/components/organisms/auth/RegisterForm';
import { AuthTemplate } from '@/components/templates/auth/AuthTemplate';

export interface RegisterPageProps extends RegisterFormProps {
  onNavigateToLogin?: () => void;
}

export function RegisterPage({ onNavigateToLogin, ...formProps }: RegisterPageProps) {
  return (
    <AuthTemplate
      title="Buat Akun"
      description="Daftar untuk mengakses tryout dan modul pembelajaran"
      footerText="Sudah punya akun?"
      footerLinkText="Masuk"
      footerLinkHref="/login"
      onFooterLinkClick={onNavigateToLogin}
    >
      <RegisterForm {...formProps} />
    </AuthTemplate>
  );
}
