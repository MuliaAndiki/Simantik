/**
 * Query key terpusat untuk React Query.
 *
 * Setiap module memiliki hierarki:
 *   <module>Root → ["<module>"]
 *   <module>     → daftar key spesifik (list / detail / resource)
 *
 * Hook query/mutation TIDAK boleh membuat query key inline — selalu
 * gunakan konstanta di file ini agar invalidation konsisten.
 */
export const queryKey = {
  authRoot: () => ['auth'] as const,
  auth: {
    me: () => ['auth', 'me'] as const,
  },

  userRoot: () => ['user'] as const,
  user: {
    me: () => ['user', 'me'] as const,
    roles: () => ['user', 'roles'] as const,
    list: (query?: Record<string, any>) => ['user', 'list', query] as const,
    detail: (userId: string) => ['user', 'detail', userId] as const,
  },

  adminRoot: () => ['admin'] as const,
  admin: {
    dashboard: () => ['admin', 'dashboard'] as const,
    users: (query?: Record<string, any>) => ['admin', 'users', query] as const,
    detail: (userId: string) => ['admin', 'detail', userId] as const,
  },

  questionRoot: () => ['question'] as const,
  question: {
    competencies: (query?: Record<string, any>) => ['question', 'competencies', query] as const,
    competencyDetail: (id: string) => ['question', 'competencyDetail', id] as const,
    types: () => ['question', 'types'] as const,
    list: (query?: Record<string, any>) => ['question', 'list', query] as const,
    detail: (id: string) => ['question', 'detail', id] as const,
  },

  tryoutRoot: () => ['tryout'] as const,
  tryout: {
    list: (query?: Record<string, any>) => ['tryout', 'list', query] as const,
    detail: (id: string) => ['tryout', 'detail', id] as const,
    attempts: (query?: Record<string, any>) => ['tryout', 'attempts', query] as const,
    attemptStatus: (attemptId: string) => ['tryout', 'attemptStatus', attemptId] as const,
    attemptQuestion: (attemptId: string, number: number | string) =>
      ['tryout', 'attemptQuestion', attemptId, String(number)] as const,
  },

  practiceRoot: () => ['practice'] as const,
  practice: {
    list: (query?: Record<string, any>) => ['practice', 'list', query] as const,
    detail: (id: string) => ['practice', 'detail', id] as const,
    attempts: (query?: Record<string, any>) => ['practice', 'attempts', query] as const,
    attemptState: (attemptId: string) => ['practice', 'attemptState', attemptId] as const,
    result: (attemptId: string) => ['practice', 'result', attemptId] as const,
    packages: (query?: Record<string, any>) => ['practice', 'packages', query] as const,
    packageDetail: (id: string) => ['practice', 'packageDetail', id] as const,
  },

  evaluationRoot: () => ['evaluation'] as const,
  evaluation: {
    profile: () => ['evaluation', 'profile'] as const,
    list: (query?: Record<string, any>) => ['evaluation', 'list', query] as const,
    detail: (id: string) => ['evaluation', 'detail', id] as const,
    attemptEvaluation: (attemptId: string) =>
      ['evaluation', 'attemptEvaluation', attemptId] as const,
    attemptReview: (attemptId: string) => ['evaluation', 'attemptReview', attemptId] as const,
  },

  recommendationRoot: () => ['recommendation'] as const,
  recommendation: {
    list: (query?: Record<string, any>) => ['recommendation', 'list', query] as const,
  },

  learningRoot: () => ['learning'] as const,
  learning: {
    modules: (query?: Record<string, any>) => ['learning', 'modules', query] as const,
    moduleLabels: () => ['learning', 'moduleLabels'] as const,
    moduleDetail: (id: string) => ['learning', 'moduleDetail', id] as const,
    moduleProgress: (id: string) => ['learning', 'moduleProgress', id] as const,
    materials: (query?: Record<string, any>) => ['learning', 'materials', query] as const,
    materialDetail: (id: string) => ['learning', 'materialDetail', id] as const,
    myProgress: () => ['learning', 'myProgress'] as const,
  },

  contentRoot: () => ['content'] as const,
  content: {
    cmsNews: (query?: Record<string, any>) => ['content', 'cmsNews', query] as const,
    cmsNewsDetail: (id: string) => ['content', 'cmsNewsDetail', id] as const,
    cmsDocumentation: (query?: Record<string, any>) =>
      ['content', 'cmsDocumentation', query] as const,
    cmsDocumentationDetail: (id: string) => ['content', 'cmsDocumentationDetail', id] as const,
    cmsTestimonials: (query?: Record<string, any>) =>
      ['content', 'cmsTestimonials', query] as const,
    news: (query?: Record<string, any>) => ['content', 'news', query] as const,
    newsBySlug: (slug: string) => ['content', 'newsBySlug', slug] as const,
    documentation: (query?: Record<string, any>) => ['content', 'documentation', query] as const,
    documentationBySlug: (slug: string) => ['content', 'documentationBySlug', slug] as const,
    testimonials: (query?: Record<string, any>) => ['content', 'testimonials', query] as const,
  },

  notificationRoot: () => ['notification'] as const,
  notification: {
    list: (query?: Record<string, any>) => ['notification', 'list', query] as const,
    unreadCount: () => ['notification', 'unreadCount'] as const,
  },

  reportingRoot: () => ['reporting'] as const,
  reporting: {
    studentReportCard: () => ['reporting', 'studentReportCard'] as const,
    adminOverview: () => ['reporting', 'adminOverview'] as const,
    tryoutAnalytics: (id: string) => ['reporting', 'tryoutAnalytics', id] as const,
    questionAnalytics: (id: string) => ['reporting', 'questionAnalytics', id] as const,
    competencyAnalytics: () => ['reporting', 'competencyAnalytics'] as const,
    difficultyAnalytics: () => ['reporting', 'difficultyAnalytics'] as const,
  },

  schoolRoot: () => ['school'] as const,
  school: {
    list: (query?: Record<string, any>) => ['school', 'list', query] as const,
    detail: (id: string) => ['school', 'detail', id] as const,
  },
} as const;
