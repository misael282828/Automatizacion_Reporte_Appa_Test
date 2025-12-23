import { expect, type FrameLocator, type Locator, type Page } from '@playwright/test';
import { URLS } from '../data/urls';

export type NestedFramesTexts = {
  left: string;
  middle: string;
  right: string;
  bottom: string;
};

export class NestedFramesPage {
  readonly page: Page;

  private readonly topFrame: FrameLocator;
  private readonly leftBody: Locator;
  private readonly middleBody: Locator;
  private readonly rightBody: Locator;
  private readonly bottomBody: Locator;

  constructor(page: Page) {
    this.page = page;

    // En esta página se usan <frame> (no <iframe>).
    // frame-top contiene 3 sub-frames: frame-left, frame-middle, frame-right
    this.topFrame = page.frameLocator('frame[name="frame-top"]');

    this.leftBody = this.topFrame.frameLocator('frame[name="frame-left"]').locator('body');
    this.middleBody = this.topFrame.frameLocator('frame[name="frame-middle"]').locator('body');
    this.rightBody = this.topFrame.frameLocator('frame[name="frame-right"]').locator('body');

    this.bottomBody = page.frameLocator('frame[name="frame-bottom"]').locator('body');
  }

  async goto(): Promise<void> {
    await this.page.goto(URLS.nestedFrames);
    // Espera mínima para asegurar que los frames estén listos
    await expect(this.leftBody).toBeVisible();
    await expect(this.bottomBody).toBeVisible();
  }

  private async readBodyText(body: Locator): Promise<string> {
    return (await body.innerText()).trim();
  }

  async getLeftText(): Promise<string> {
    return await this.readBodyText(this.leftBody);
  }

  async getMiddleText(): Promise<string> {
    return await this.readBodyText(this.middleBody);
  }

  async getRightText(): Promise<string> {
    return await this.readBodyText(this.rightBody);
  }

  async getBottomText(): Promise<string> {
    return await this.readBodyText(this.bottomBody);
  }

  async getAllTexts(): Promise<NestedFramesTexts> {
    const [left, middle, right, bottom] = await Promise.all([
      this.getLeftText(),
      this.getMiddleText(),
      this.getRightText(),
      this.getBottomText(),
    ]);

    return { left, middle, right, bottom };
  }
}
