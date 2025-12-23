// import type { Page, TestInfo } from '@playwright/test';

// export function safeFileName(value: string): string {
//   return value.replace(/[^a-zA-Z0-9_-]/g, '_');
// }

// /**
//  * Toma screenshot SOLO si el test pasó.
//  * Guarda la evidencia dentro del output del test (test-results) con un nombre limpio.
//  */
// export async function screenshotOnPass(
//   page: Page,
//   testInfo: TestInfo,
//   options?: { label?: string; fullPage?: boolean }
// ): Promise<void> {
//   if (testInfo.status !== 'passed') return;

//   const title = safeFileName(testInfo.title);
//   const label = options?.label ? safeFileName(options.label) : 'page';
//   const fullPage = options?.fullPage ?? true;

//   await page.screenshot({
//     path: testInfo.outputPath(`${title}_${label}_passed_${Date.now()}.png`),
//     fullPage,
//   });
// }

import type { Page, TestInfo } from '@playwright/test';

export function safeFileName(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '_');
}

/**
 * Adjunta screenshot al HTML report:
 * - Si el test PASA: screenshot PASS
 * - Si el test FALLA: screenshot FAIL
 *
 * OJO: Para que también funcione cuando falla, debes llamarlo dentro de un `finally`.
 */
export async function attachScreenshot(
  page: Page,
  testInfo: TestInfo,
  options?: { label?: string; fullPage?: boolean }
): Promise<void> {
  const label = options?.label ? safeFileName(options.label) : 'page';
  const fullPage = options?.fullPage ?? true;

  // En runtime, testInfo.status al final será passed/failed
  const status = testInfo.status || 'unknown';
  const title = safeFileName(testInfo.title);

  const fileName = `${title}_${label}_${status}_${Date.now()}.png`;
  const filePath = testInfo.outputPath(fileName);

  try {
    await page.screenshot({ path: filePath, fullPage });
    await testInfo.attach(`Screenshot (${status.toUpperCase()}) - ${label}`, {
      path: filePath,
      contentType: 'image/png',
    });
  } catch {
    // Si no se puede tomar screenshot (page cerrada, etc.), no rompas el test.
  }
}
