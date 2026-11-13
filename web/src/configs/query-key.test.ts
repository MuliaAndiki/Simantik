import { describe, expect, it } from 'bun:test';
import { queryKey } from './query-key';

describe('queryKey architecture', () => {
  it('generates consistent hierarchical auth keys', () => {
    expect(queryKey.authRoot()).toEqual(['auth']);
    expect(queryKey.auth.me()).toEqual(['auth', 'me']);
  });

  it('generates user keys with parameters', () => {
    expect(queryKey.userRoot()).toEqual(['user']);
    expect(queryKey.user.me()).toEqual(['user', 'me']);
    expect(queryKey.user.roles()).toEqual(['user', 'roles']);
    expect(queryKey.user.detail('uuid-123')).toEqual(['user', 'detail', 'uuid-123']);
    expect(queryKey.user.list({ search: 'john' })).toEqual(['user', 'list', { search: 'john' }]);
  });

  it('generates tryout and attempt keys', () => {
    expect(queryKey.tryoutRoot()).toEqual(['tryout']);
    expect(queryKey.tryout.detail('tryout-1')).toEqual(['tryout', 'detail', 'tryout-1']);
    expect(queryKey.tryout.attemptStatus('att-1')).toEqual(['tryout', 'attemptStatus', 'att-1']);
    expect(queryKey.tryout.attemptQuestion('att-1', 5)).toEqual([
      'tryout',
      'attemptQuestion',
      'att-1',
      '5',
    ]);
  });

  it('generates reporting and analytics keys', () => {
    expect(queryKey.reportingRoot()).toEqual(['reporting']);
    expect(queryKey.reporting.studentReportCard()).toEqual(['reporting', 'studentReportCard']);
    expect(queryKey.reporting.adminOverview()).toEqual(['reporting', 'adminOverview']);
    expect(queryKey.reporting.tryoutAnalytics('t-1')).toEqual([
      'reporting',
      'tryoutAnalytics',
      't-1',
    ]);
  });

  it('generates geo and student testimonial status keys', () => {
    expect(queryKey.geoRoot()).toEqual(['geo']);
    expect(queryKey.geo.searchSchools('SMAN 1')).toEqual(['geo', 'searchSchools', 'SMAN 1']);
    expect(queryKey.geo.reverse(-6.8902123, 107.6131456)).toEqual([
      'geo',
      'reverse',
      -6.89021,
      107.61315,
    ]);
    expect(queryKey.content.myTestimonialStatus()).toEqual(['content', 'myTestimonialStatus']);
  });
});
