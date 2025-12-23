import { test, expect } from '@playwright/test';
import { TinyCloudEditorPage } from '../src/pages/TinyCloudEditorPage';
import { EditorColor } from '../src/data/editorColors';
import { attachScreenshot } from '../src/utils/evidence';

// Helper mínimo para no repetir el frameLocator en 4 tests
async function getTinyEditorText(page: any): Promise<string> {
  return (await page
    .frameLocator('iframe.tox-edit-area__iframe')
    .locator('body')
    .innerText()).trim();
}

test('TC-00 @smoke - Modificar texto en el editor online Tiny', async ({ page }, testInfo) => {
  try {
    const tiny = new TinyCloudEditorPage(page);

    await tiny.goto();

    const expectedText = 'Hola soy Misael, automatizando texto para Appa.';
    await tiny.clearEditor();
    await tiny.typeText(expectedText);
    await tiny.selectAllText();
    await tiny.setBackgroundColor(EditorColor.ROJO);
    await tiny.alignCenter();

    const html = await tiny.getEditorHtml();
    expect(html).toContain('color:'); // mantengo tu validación tal cual

    const text = await getTinyEditorText(page);
    console.log('TC-00 text:', text);

    expect(text).toContain('Hola soy Misael');
    expect(text).toBe(expectedText);
  } finally {
    // ✅ Evidencia siempre (PASS / FAIL) en el HTML report
    await attachScreenshot(page, testInfo, { label: 'final', fullPage: true });
  }
});

test('TC-01 @smoke - Modificar texto y validar que no está vacío', async ({ page }, testInfo) => {
  try {
    const tiny = new TinyCloudEditorPage(page);
    await tiny.goto();

    const expectedText = 'Hola soy Misael, automatizando texto para Appa.';
    await tiny.clearEditor();
    await tiny.typeText(expectedText);

    const text = await getTinyEditorText(page);
    console.log('TC-01 text:', text);

    expect(text).not.toBe('');
    expect(text).toBe(expectedText);
  } finally {
    await attachScreenshot(page, testInfo, { label: 'final', fullPage: true });
  }
});

test('TC-02 @component - Validar que se puede limpiar el editor', async ({ page }, testInfo) => {
  try {
    const tiny = new TinyCloudEditorPage(page);
    await tiny.goto();

    await tiny.clearEditor();

    const text = await getTinyEditorText(page);
    console.log('TC-02 text after clear:', text);

    // No debe contener el texto base
    expect(text).not.toContain('Hola soy Misael');
  } finally {
    await attachScreenshot(page, testInfo, { label: 'final', fullPage: true });
  }
});

test('TC-03 @component - Aplicar color (NARANJA) y validar que se refleje en HTML', async ({ page }, testInfo) => {
  try {
    const tiny = new TinyCloudEditorPage(page);
    await tiny.goto();

    const expectedText = 'Color test - Misael';
    await tiny.clearEditor();
    await tiny.typeText(expectedText);
    await tiny.selectAllText();
    await tiny.setBackgroundColor(EditorColor.NARANJA);

    const html = await tiny.getEditorHtml();
    console.log('TC-03 html:', html);

    expect(html).toContain('color:');
  } finally {
    await attachScreenshot(page, testInfo, { label: 'final', fullPage: true });
  }
});

test('TC-04 @regression - Flujo completo repetido 2 veces y consistente', async ({ page }, testInfo) => {
  try {
    const tiny = new TinyCloudEditorPage(page);
    await tiny.goto();

    const runFlow = async (textValue: string) => {
      await tiny.clearEditor();
      await tiny.typeText(textValue);
      await tiny.selectAllText();
      await tiny.setBackgroundColor(EditorColor.NARANJA);
      await tiny.alignCenter();

      const html = await tiny.getEditorHtml();
      expect(html).toContain('color:');

      return await getTinyEditorText(page);
    };

    const text1 = await runFlow('Iteración 1 - Misael');
    const text2 = await runFlow('Iteración 2 - Misael');

    console.log('TC-04 results:', { text1, text2 });

    expect(text1).toBe('Iteración 1 - Misael');
    expect(text2).toBe('Iteración 2 - Misael');
  } finally {
    await attachScreenshot(page, testInfo, { label: 'final', fullPage: true });
  }
});
