// Type definitions for bem-cn-lite 3.0.0
// Project: https://github.com/mistakster/bem-cn-lite
// Documentation: https://github.com/mistakster/bem-cn-lite/blob/master/README.md
// Definitions by: Directum <https://github.com/directumrx>,
// TypeScript Version: 3.2

declare module 'bem-cn-lite' {
  function BemCnLite(name: string): BemCnLite.Block;

  namespace BemCnLite {
    function reset(): void;
    function setup(settings?: Settings): void;

    interface Modifications {
      [key: string]: (string | boolean) | undefined;
    }

    interface Block {
      // Блок
      (): string;
      // Блок с модификаторами
      (modifiers: Modifications): string;
      // Блок с модификаторами + микс
      (modifiers: Modifications | boolean | null, mixin?: string | string[]): string;
      // Элемент
      (elementName: string): string;
      // Элемент + микс
      (elementName: string, mixin?: string | string[]): string;
      // Элемент с модификатормаи
      (elementName: string, modifiers: Modifications): string;
      // Элемент с модификатормаи + микс
      (elementName: string, modifiers: Modifications | boolean | null, mixin?: string | string[]): string;
    }

    interface Settings {
      ns?: string;
      el?: string;
      mod?: string;
      modValue?: string;
      classMap?: { [className: string]: string } | null;
    }
  }

  export default BemCnLite;
}