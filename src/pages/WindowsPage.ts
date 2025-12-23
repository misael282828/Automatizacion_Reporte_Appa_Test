import { expect, type Locator, type Page } from '@playwright/test';
import { URLS } from '../data/urls';

export class WindowsPage {
  readonly page: Page;

  private readonly clickHereLink: Locator;
  private readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.clickHereLink = page.getByRole('link', { name: 'Click Here' });
    this.heading = page.getByRole('heading', { name: 'Opening a new window' });
  }

  async goto(): Promise<void> {
    await this.page.goto(URLS.windows);
    await expect(this.heading).toBeVisible();
    await expect(this.clickHereLink).toBeVisible();
  }

  async isClickHereVisible(): Promise<boolean> {
    return await this.clickHereLink.isVisible();
  }

  async isClickHereEnabled(): Promise<boolean> {
    return await this.clickHereLink.isEnabled();
  }

  /**
   * Abre la nueva ventana/pestaña y retorna la Page del popup.
   */
  async openNewWindow(): Promise<Page> {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.clickHereLink.click(),
    ]);

    await popup.waitForLoadState();
    return popup;
  }

  async getNewWindowText(popup: Page): Promise<string> {
    // En la nueva página el texto aparece en un <h3>
    const h3 = popup.locator('h3');
    await expect(h3).toBeVisible();
    return (await h3.innerText()).trim();
  }
}
