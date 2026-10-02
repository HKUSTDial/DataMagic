import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const readText = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const readJson = (path) => JSON.parse(readText(path));

const reconstruction = readJson('../templates/source-to-reconstruction/sample-data.json');
const reconstructionSchema = readJson('../templates/source-to-reconstruction/schema.json');
const presenter = readJson('../templates/presenter-chart-stage/sample-data.json');
const presenterSchema = readJson('../templates/presenter-chart-stage/schema.json');

test('source reconstruction uses one traceable row collection for source and chart', () => {
  assert.ok(reconstruction.rows.length >= 3 && reconstruction.rows.length <= 5);
  assert.ok(reconstruction.rows.every((row) => row.label && Number.isFinite(row.value) && row.sourceText));
  assert.equal(new Set(reconstruction.rows.map((row) => row.label)).size, reconstruction.rows.length);
  assert.ok(reconstruction.highlightIndex >= 0 && reconstruction.highlightIndex < reconstruction.rows.length);
  assert.match(reconstruction.source, /演示|synthetic|demo|模拟/i);
  assert.deepEqual(reconstructionSchema.required.includes('rows'), true);
});

test('presenter stage resolves side and active narrative beat from editable props', () => {
  assert.ok(['left', 'right'].includes(presenter.presenterSide));
  assert.ok(presenter.chartData.length >= 3 && presenter.chartData.length <= 5);
  assert.ok(presenter.activeBeat >= 0 && presenter.activeBeat < presenter.chartData.length);
  assert.ok(presenter.chartData.every((item) => item.label && Number.isFinite(item.value) && item.context));
  assert.deepEqual(presenterSchema.properties.presenterSide.enum, ['left', 'right']);
  assert.ok(presenterSchema.required.includes('activeBeat'));
  assert.ok(presenterSchema.required.includes('chartData'));
  assert.ok(presenterSchema.required.includes('takeaway'));
});

test('both editorial templates are frame driven, asset independent and safe-area aware', () => {
  const files = [
    '../templates/source-to-reconstruction/SourceToReconstruction.tsx',
    '../templates/presenter-chart-stage/PresenterChartStage.tsx',
  ];
  for (const file of files) {
    const source = readText(file);
    assert.match(source, /useCurrentFrame/);
    assert.match(source, /useVideoConfig/);
    assert.match(source, /stableFrame = Math\.min\(frame, 6 \* fps\)/);
    assert.match(source, /Noto Sans SC/);
    assert.doesNotMatch(source, /animation\s*:/);
    assert.doesNotMatch(source, /<Img|staticFile\(|https?:\/\//);
  }
  assert.match(readText(files[0]), /interpolate\(frame, \[5\.05 \* fps, 5\.8 \* fps\]/);
  assert.match(readText(files[1]), /interpolate\(frame, \[4\.85 \* fps, 5\.7 \* fps\]/);
});

test('recipes state 1920x1080, 64px safety and a one-second static ending', () => {
  for (const file of ['../recipes/SourceToReconstruction.md', '../recipes/PresenterChartStage.md']) {
    const recipe = readText(file);
    assert.match(recipe, /1920×1080/);
    assert.match(recipe, /64px/);
    assert.match(recipe, /7\.0–8\.0 秒/);
    assert.match(recipe, /Noto Sans SC/);
  }
});
