import { expect, type FrameLocator, type Locator, type Page } from '@playwright/test';
import { EditorColor, EditorColorHex } from '../data/editorColors';


export class TinyCloudEditorPage {
  readonly page: Page;

  // URL (solo la usa esta Page)
  readonly url = 'https://www.tiny.cloud/docs/tinymce/latest/basic-example/';

  // Locators principales
  private readonly editorFrame: FrameLocator;
  private readonly editorBody: Locator;

  // Toolbar / botones
  private readonly btnBgColorMenu: Locator;
  private readonly btnRevealMoreToolbar: Locator;

  constructor(page: Page) {
    this.page = page;

    this.editorFrame = page.frameLocator('iframe.tox-edit-area__iframe');
    this.editorBody = this.editorFrame.locator('body');

    this.btnBgColorMenu = page.getByRole('button', { name: 'Background color menu' });
    this.btnRevealMoreToolbar = page.getByRole('button', { name: /Reveal or hide additional toolbar items/i });
  }

  
  async goto(): Promise<void> {
  await this.page.setViewportSize({ width: 900, height: 700 });
  await this.page.goto(this.url);
  await expect(this.editorBody).toBeVisible();
  }

  /**
   * Enfoca el body dentro del iframe.
   * Útil para que shortcuts como Ctrl+A no fallen por falta de foco.
   */
  async focusEditor(): Promise<void> {
    await this.editorBody.click();
  }

  async clearEditor(): Promise<void> {
    await this.focusEditor();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Backspace');
  }

  async typeText(text: string): Promise<void> {
    await this.focusEditor();
    await this.editorBody.type(text);
  }

  async selectAllText(): Promise<void> {
    await this.focusEditor();
    await this.page.keyboard.press('Control+A');
  }

  /**
   * Selecciona un color por HEX usando el atributo data-mce-color.
   * Ej: '#E03E2D'
   */
  // async setBackgroundColorHex(hex: string): Promise<void> {
  //   await this.btnBgColorMenu.click();
  //   await this.page.locator(`[data-mce-color="${hex}"]`).click();
  //   // Cierra el menú para evitar bloqueos de UI
  //   await this.page.keyboard.press('Escape');
  //   await this.focusEditor();
  // }

  async setBackgroundColor(color: EditorColor): Promise<void> {
  const hex = EditorColorHex[color];

  await this.btnBgColorMenu.click();
  await this.page.locator(`[data-mce-color="${hex}"]`).click();

  // Cerrar menú para evitar bloqueos
  await this.page.keyboard.press('Escape');
  await this.focusEditor();
}




  /**
   * Centra el texto. Si el botón no está visible, abre el overflow ("...") y lo busca ahí.
   */
  async alignCenter(): Promise<void> {
    const alignCenterBtn = this.page.getByRole('button', { name: /align center/i });

    if (await alignCenterBtn.count()) {
      // A veces existe pero está oculto; intentamos click igual
      await alignCenterBtn.click();
      return;
    }

    // Fallback: abrir toolbar overflow
    await this.btnRevealMoreToolbar.click();
    await this.page.getByRole('button', { name: /align center/i }).click();

    // Cierra el overflow
    await this.page.keyboard.press('Escape');
    // Click fuera por si queda algún overlay
    await this.page.locator('body').click({ position: { x: 5, y: 5 } });
  }

  async getEditorHtml(): Promise<string> {
    return await this.editorBody.innerHTML();
  }

  /**
   * Screenshot opcional (si quieres mantener screenshots manuales).
   * Recomendación: usar evidencia automática en playwright.config.
   */
  async takeScreenshot(path: string): Promise<void> {
    await this.page.screenshot({ path });
  }
}
