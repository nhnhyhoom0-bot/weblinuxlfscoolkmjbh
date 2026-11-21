import test from 'node:test';
import assert from 'node:assert/strict';
import { DISTROS } from '../data/distros';
import {
  DEFAULT_FILTERS,
  computeCatalogStats,
  filterDistros,
  paginateDistros,
  recommendDistros,
} from './distroLogic';
import { executeTerminalCommand } from './terminalEngine';

test('dataset contains exactly 300 unique distributions with valid fields', () => {
  assert.equal(DISTROS.length, 300, `Expected 300 distributions, got ${DISTROS.length}`);

  const ids = new Set<string>();
  const names = new Set<string>();

  for (const distro of DISTROS) {
    assert.ok(distro.id.length > 0, 'Distro id must not be empty');
    assert.ok(!ids.has(distro.id), `Duplicate distro id: ${distro.id}`);
    ids.add(distro.id);

    assert.ok(distro.name.length > 0, 'Distro name must not be empty');
    assert.ok(!names.has(distro.name), `Duplicate distro name: ${distro.name}`);
    names.add(distro.name);

    assert.match(distro.officialUrl, /^https?:\/\//, `Invalid officialUrl on ${distro.id}`);
    assert.match(distro.downloadUrl, /^https?:\/\//, `Invalid downloadUrl on ${distro.id}`);
    assert.ok(distro.description.length >= 20, `Description too short on ${distro.id}`);
    assert.ok(distro.installSteps.length >= 2, `Missing installSteps on ${distro.id}`);
    assert.ok(distro.minRamMb > 0, `Invalid minRamMb on ${distro.id}`);
  }
});

test('filterDistros filters accurately by query, family, category, and RAM', () => {
  const byQuery = filterDistros(DISTROS, { ...DEFAULT_FILTERS, query: 'ubuntu' });
  assert.ok(byQuery.length > 0);
  assert.equal(byQuery[0].id, 'ubuntu');

  const archOnly = filterDistros(DISTROS, { ...DEFAULT_FILTERS, family: 'Arch' });
  assert.ok(archOnly.length >= 20);
  assert.ok(archOnly.every((d) => d.family === 'Arch'));

  const lowRam = filterDistros(DISTROS, { ...DEFAULT_FILTERS, maxRamMb: 512 });
  assert.ok(lowRam.length >= 10);
  assert.ok(lowRam.every((d) => d.minRamMb <= 512));
});

test('paginateDistros computes pages cleanly across 300 entries', () => {
  const page1 = paginateDistros(DISTROS, 1, 24);
  assert.equal(page1.items.length, 24);
  assert.equal(page1.totalPages, 13);
  assert.equal(page1.currentPage, 1);

  const page13 = paginateDistros(DISTROS, 13, 24);
  assert.equal(page13.items.length, 12);
  assert.equal(page13.currentPage, 13);
});

test('computeCatalogStats sums up to 300 across families and categories', () => {
  const stats = computeCatalogStats(DISTROS);
  assert.equal(stats.total, 300);

  const familySum = Object.values(stats.families).reduce((acc, n) => acc + n, 0);
  assert.equal(familySum, 300);

  const catSum = Object.values(stats.categories).reduce((acc, n) => acc + n, 0);
  assert.equal(catSum, 300);
});

test('recommendDistros returns tailored matches for beginner gaming and low-spec PC', () => {
  const gamingRecs = recommendDistros(DISTROS, {
    experience: 'beginner',
    useCase: 'gaming',
    hardware: 'high',
    updateStyle: 'immutable',
    desktopStyle: 'familiar',
  });
  assert.equal(gamingRecs.length, 6);
  assert.ok(gamingRecs.some((r) => r.distro.id === 'bazzite' || r.distro.id === 'nobara'));

  const oldPcRecs = recommendDistros(DISTROS, {
    experience: 'beginner',
    useCase: 'old_pc',
    hardware: 'low',
    updateStyle: 'stable',
    desktopStyle: 'lightweight',
  });
  assert.ok(oldPcRecs[0].distro.minRamMb <= 1024);
});

test('terminal simulator handles help, uname, fastfetch, cd, and distro lookup', () => {
  const helpRes = executeTerminalCommand('help', '/home/linux', DISTROS);
  assert.ok(helpRes.output.length > 5);

  const unameRes = executeTerminalCommand('uname -a', '/home/linux', DISTROS);
  assert.ok(unameRes.output[0].includes('Linux'));

  const cdRes = executeTerminalCommand('cd /etc', '/home/linux', DISTROS);
  assert.equal(cdRes.newCwd, '/etc');

  const distroRes = executeTerminalCommand('distro debian', '/home/linux', DISTROS);
  assert.ok(distroRes.output[0].includes('Debian'));

  const clearRes = executeTerminalCommand('clear', '/home/linux', DISTROS);
  assert.equal(clearRes.clear, true);
});
