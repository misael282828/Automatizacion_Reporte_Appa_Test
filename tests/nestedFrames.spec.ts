import { test, expect } from '@playwright/test';
import { NestedFramesPage } from '../src/pages/NestedFramesPage';
import { attachScreenshot } from '../src/utils/evidence';

test('NF-01 @smoke - Leer LEFT, MIDDLE, RIGHT y BOTTOM', async ({ page }, testInfo) => {
  try {
    const nested = new NestedFramesPage(page);
    await nested.goto();

    const texts = await nested.getAllTexts();

    console.log('NF-01 Textos:', texts);
    await testInfo.attach('NF-01 Textos (Nested Frames)', {
      body: JSON.stringify(texts, null, 2),
      contentType: 'application/json',
    });

    expect(texts.left).toBe('LEFT');
    expect(texts.middle).toBe('MIDDLE');
    expect(texts.right).toBe('RIGHT');
    expect(texts.bottom).toBe('BOTTOM');
  } finally {
    // Evidencia siempre (PASS / FAIL)
    await attachScreenshot(page, testInfo, { label: 'final' });
  }
});

test('NF-02 @component - Leer frame LEFT', async ({ page }, testInfo) => {
  try {
    const nested = new NestedFramesPage(page);
    await nested.goto();

    const left = await nested.getLeftText();

    console.log('NF-02 LEFT:', left);
    await testInfo.attach('NF-02 LEFT', {
      body: left,
      contentType: 'text/plain',
    });

    expect(left).toBe('LEFT');
  } finally {
    await attachScreenshot(page, testInfo, { label: 'final' });
  }
});

test('NF-03 @component - Leer frame MIDDLE', async ({ page }, testInfo) => {
  try {
    const nested = new NestedFramesPage(page);
    await nested.goto();

    const middle = await nested.getMiddleText();

    console.log('NF-03 MIDDLE:', middle);
    await testInfo.attach('NF-03 MIDDLE', {
      body: middle,
      contentType: 'text/plain',
    });

    expect(middle).toBe('MIDDLE');
  } finally {
    await attachScreenshot(page, testInfo, { label: 'final' });
  }
});



test('NF-04 @component - Leer frame RIGHT pintar color al identeficar frame', async ({ page }, testInfo) => {
  try {
    const nested = new NestedFramesPage(page);
    await nested.goto();

    const right = await nested.getRightText();

    console.log('NF-04 RIGHT:', right);
    await testInfo.attach('NF-04 RIGHT', {
      body: right,
      contentType: 'text/plain',
    });

    expect(right).toBe('RIGHT');

    // 🎨 Pintar el frame RIGHT de rojo (evidencia visual)
    const rightFrame = page
      .frameLocator('frame[name="frame-top"]')
      .frameLocator('frame[name="frame-right"]');

    await rightFrame.locator('body').evaluate((body) => {
      body.style.backgroundColor = 'red';
      body.style.color = 'white';
      body.style.fontWeight = 'bold';
    });

  } finally {
    // 📸 Screenshot con el frame RIGHT en rojo
    await attachScreenshot(page, testInfo, { label: 'RIGHT_highlighted' });
  }
});


test('NF-05 @regression - Leer todos los frames y validar no vacíos + correctos', async ({ page }, testInfo) => {
  try {
    const nested = new NestedFramesPage(page);
    await nested.goto();

    const texts = await nested.getAllTexts();

    console.log('NF-05 Textos:', texts);
    await testInfo.attach('NF-05 Textos (Nested Frames)', {
      body: JSON.stringify(texts, null, 2),
      contentType: 'application/json',
    });

    // No vacíos
    expect(texts.left).not.toBe('');
    expect(texts.middle).not.toBe('');
    expect(texts.right).not.toBe('');
    expect(texts.bottom).not.toBe('');

    // Correctos
    expect(texts.left).toBe('LEFT');
    expect(texts.middle).toBe('MIDDLE');
    expect(texts.right).toBe('RIGHT');
    expect(texts.bottom).toBe('BOTTOM');
  } finally {
    await attachScreenshot(page, testInfo, { label: 'final' });
  }
});
