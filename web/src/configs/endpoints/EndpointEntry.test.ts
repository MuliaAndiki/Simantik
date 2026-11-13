import { describe, expect, it } from 'bun:test';
import { EndpointEntry } from './EndpointEntry';

describe('EndpointEntry', () => {
  it('has all 11 business domains registered', () => {
    expect(EndpointEntry.admin).toBeDefined();
    expect(EndpointEntry.auth).toBeDefined();
    expect(EndpointEntry.content).toBeDefined();
    expect(EndpointEntry.evaluation).toBeDefined();
    expect(EndpointEntry.learning).toBeDefined();
    expect(EndpointEntry.geo).toBeDefined();
    expect(EndpointEntry.notification).toBeDefined();
    expect(EndpointEntry.question).toBeDefined();
    expect(EndpointEntry.recommendation).toBeDefined();
    expect(EndpointEntry.reporting).toBeDefined();
    expect(EndpointEntry.tryout).toBeDefined();
    expect(EndpointEntry.user).toBeDefined();
  });

  it('formats endpoint URLs correctly', () => {
    expect(EndpointEntry.auth.login).toBe('/auth/login');
    expect(EndpointEntry.user.getProfile).toBe('/users/me');
    expect(EndpointEntry.tryout.attemptQuestion('att-1', 3)).toBe('/attempts/att-1/questions/3');
    expect(EndpointEntry.reporting.questionAnalytics('q-1')).toBe('/admin/reports/questions/q-1');
    expect(EndpointEntry.geo.searchSchools).toBe('/geo/schools/search');
    expect(EndpointEntry.geo.reverse).toBe('/geo/reverse');
    expect(EndpointEntry.content.myTestimonialStatus).toBe('/testimonials/me/status');
  });
});
