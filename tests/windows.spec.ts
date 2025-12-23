import { test, expect } from '@playwright/test';
import { WindowsPage } from '../src/pages/WindowsPage';
import { attachScreenshot } from '../src/utils/evidence';

test('WIN-01 @smoke - Abrir nueva ventana y validar "New Window"', async ({ page }, testInfo) => {
  let popup;
  try {
    const win = new WindowsPage(page);
    await win.goto();

    popup = await win.openNewWindow();
    const text = await win.getNewWindowText(popup);

    console.log('WIN-01 New Window text:', text);
    await testInfo.attach('WIN-01 New Window text', {
      body: text,
      contentType: 'text/plain',
    });

    expect(text).toBe('New Window');
  } finally {
    // Screenshot página principal
    await attachScreenshot(page, testInfo, { label: 'main' });

    // Screenshot popup (si existe)
    if (popup) {
      await attachScreenshot(popup, testInfo, { label: 'popup' });
      await popup.close();
    }
  }
});

test('WIN-02 @component - Validar link Click Here visible y habilitado', async ({ page }, testInfo) => {
  try {
    const win = new WindowsPage(page);
    await win.goto();

    const visible = await win.isClickHereVisible();
    const enabled = await win.isClickHereEnabled();

    console.log('WIN-02 Click Here visible/enabled:', { visible, enabled });
    await testInfo.attach('WIN-02 Click Here state', {
      body: JSON.stringify({ visible, enabled }, null, 2),
      contentType: 'application/json',
    });

    expect(visible).toBeTruthy();
    expect(enabled).toBeTruthy();
  } finally {
    await attachScreenshot(page, testInfo, { label: 'main' });
  }
});

test('WIN-03 @component - Detectar nueva ventana (popup) al hacer click', async ({ page }, testInfo) => {
  let popup;
  try {
    const win = new WindowsPage(page);
    await win.goto();

    popup = await win.openNewWindow();

    console.log('WIN-03 Popup URL:', popup.url());
    await testInfo.attach('WIN-03 Popup URL', {
      body: popup.url(),
      contentType: 'text/plain',
    });

    expect(popup).toBeTruthy();
  } finally {
    await attachScreenshot(page, testInfo, { label: 'main' });

    if (popup) {
      await attachScreenshot(popup, testInfo, { label: 'popup' });
      await popup.close();
    }
  }
});

test('WIN-04 @regression - Abrir nueva ventana, cerrar la anterior y validar que la nueva sigue activa', async ({ page }, testInfo) => {
  let popup;
  try {
    const win = new WindowsPage(page);
    await win.goto();

    popup = await win.openNewWindow();
    const text = await win.getNewWindowText(popup);

    console.log('WIN-04 New Window text:', text);
    await testInfo.attach('WIN-04 New Window text', {
      body: text,
      contentType: 'text/plain',
    });

    expect(text).toBe('New Window');

    // Cierra la pestaña original
    await page.close();

    // La nueva ventana debe seguir activa
    await expect(popup.locator('h3')).toHaveText('New Window');
  } finally {
    if (popup) {
      await attachScreenshot(popup, testInfo, { label: 'popup' });
      await popup.close();
    }
  }
});

test('WIN-05 @regression - Repetir flujo de abrir nueva ventana (2 veces) y validar consistencia', async ({ page }, testInfo) => {
  try {
    const win = new WindowsPage(page);
    await win.goto();

    const results: string[] = [];

    // Iteración 1
    const popup1 = await win.openNewWindow();
    results.push(await win.getNewWindowText(popup1));
    await popup1.close();

    // Iteración 2
    const popup2 = await win.openNewWindow();
    results.push(await win.getNewWindowText(popup2));
    await popup2.close();

    console.log('WIN-05 Results:', results);
    await testInfo.attach('WIN-05 Results', {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json',
    });

    expect(results).toEqual(['New Window', 'New Window']);
  } finally {
    await attachScreenshot(page, testInfo, { label: 'main' });
  }
});
