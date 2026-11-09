export type PublicNavRoute =
  | 'home'
  | 'about'
  | 'documentation'
  | 'tutorials'
  | 'testimonials'
  | 'learning'
  | 'tryout'
  | 'news';

export interface PublicNavTabItem {
  label: string;
  href: string;
  route: PublicNavRoute;
}

// ============================================================================
// Landing Page Data Types
// ============================================================================

export interface HeroStudentMockup {
  name: string;
  school: string;
  badgeLevel: string;
  avatarInitials: string;
  averageScore: number;
  maxScore: number;
  competencies: Array<{
    name: string;
    scorePercent: number;
    isAlert?: boolean;
    alertLabel?: string;
  }>;
  dailyRecommendation: {
    title: string;
    actionLabel: string;
    href: string;
  };
  verifiedQuestionsCount: number;
}

export interface ValuePropItem {
  id: string;
  title: string;
  description: string;
  iconName:
    | 'compass'
    | 'check-circle'
    | 'bar-chart'
    | 'lightbulb'
    | 'shield-check'
    | 'laptop'
    | 'award'
    | 'target'
    | 'file-text';
  colorTheme: 'teal' | 'cyan' | 'blue' | 'amber' | 'emerald';
}

export interface LearningCycleStep {
  step: string;
  title: string;
  description: string;
  isHighlighted?: boolean;
  highlightBadge?: string;
}

export interface LandingModuleItem {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  progressPercent: number;
  isPriority?: boolean;
  badgeColor?: string;
  href: string;
}

export interface LandingTryoutPackage {
  id: string;
  title: string;
  description: string;
  badgeLabel: string;
  badgeType: 'standard' | 'popular' | 'live';
  difficulty: string;
  totalQuestions: number;
  durationMinutes: number;
  startHref: string;
  detailHref: string;
}

export interface CompetencyDiagnosisItem {
  name: string;
  scorePercent: number;
  statusLabel: string;
  isAlert?: boolean;
  alertNote?: string;
}

export interface LandingDiagnosticsData {
  overallScorePercent: number;
  grade: string;
  accuracyPercent: number;
  answeredRatioText: string;
  avgTimePerQuestion: string;
  targetThresholdPercent: number;
  competencies: CompetencyDiagnosisItem[];
  principleQuote: string;
}

export interface LandingRecommendationData {
  flowSteps: Array<{
    stepNumber: number;
    title: string;
    isHighlighted?: boolean;
  }>;
  featuredModule: {
    id: string;
    title: string;
    description: string;
    targetCompetency: string;
    curationReason: string;
    estimatedDuration: string;
    progressStatus: string;
    learnHref: string;
    saveHref?: string;
  };
}

export interface LandingNewsItem {
  id: string;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  slug: string;
  imageUrl?: string;
}

export interface NewsDetailArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  tag: string;
  date: string;
  imageUrl?: string;
  readTimeMinutes?: number;
  author?: string;
}

export interface TeamMemberItem {
  id: string | number;
  name: string;
  role: string;
  institution: string;
  tag: string;
  imageSrc: string;
}

export interface VideoTutorialHighlight {
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  features: string[];
}

export interface DocumentationHighlightItem {
  id: string;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
  slug: string;
}

export interface LandingPageData {
  heroStudent: HeroStudentMockup;
  valueProps: ValuePropItem[];
  learningCycle: LearningCycleStep[];
  modules: LandingModuleItem[];
  tryoutPackages: LandingTryoutPackage[];
  diagnostics: LandingDiagnosticsData;
  recommendation: LandingRecommendationData;
  news: LandingNewsItem[];
  teamMembers?: TeamMemberItem[];
  videoTutorial?: VideoTutorialHighlight;
  documentationHighlights?: DocumentationHighlightItem[];
  testimonials?: UserTestimonialItem[];
}

// ============================================================================
// Documentation Page Data Types
// ============================================================================

export interface DocCategoryItem {
  id: string;
  label: string;
  count: number;
}

export interface DocArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: string;
  categoryColorClass?: string;
  readTimeMinutes: number;
  publishedDate: string;
  href: string;
}

export interface DocumentationPageData {
  popularKeywords: string[];
  categories: DocCategoryItem[];
  articles: DocArticleItem[];
}

// ============================================================================
// Tutorials Page Data Types
// ============================================================================

export interface TutorialCategoryItem {
  id: string;
  label: string;
  count: number;
}

export interface FeaturedVideoTutorial {
  id: string;
  title: string;
  description: string;
  moduleInfo: string;
  duration: string;
  badgeLabel: string;
  videoQuality: string;
  languageTrack: string;
  featureCheckpoints: string[];
  thumbnailUrl?: string;
  videoUrl?: string;
}

export interface VideoTutorialItem {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

export interface TutorialsPageData {
  popularKeywords: string[];
  categories: TutorialCategoryItem[];
  featuredVideo?: FeaturedVideoTutorial | null;
  videos: VideoTutorialItem[];
}

// ============================================================================
// Testimonials Page Data Types
// ============================================================================

export interface ImpactMetricItem {
  value: string;
  label: string;
  sublabel: string;
}

export interface FeaturedSpotlightTestimonial {
  name: string;
  role: string;
  school: string;
  province: string;
  academicTarget: string;
  quote: string;
  badges: string[];
  tryoutCompletedCount: number;
  calibratedScore: number;
  maxScore: number;
  avatarUrl?: string;
}

export interface UserTestimonialItem {
  id: string;
  authorName: string;
  authorRole: string;
  school?: string;
  province?: string;
  quote: string;
  categoryTag: string;
  rating?: number;
  avatarUrl?: string;
}

export interface TestimonialsPageData {
  impactMetrics: ImpactMetricItem[];
  featuredSpotlight?: FeaturedSpotlightTestimonial | null;
  testimonials: UserTestimonialItem[];
}
