import type { Chars } from '@src/Chars/Chars';
import type { InputListeners } from '@src/InputListeners/InputListeners';

export class MaskedInput {
  #$input: HTMLInputElement;

  #chars: Chars;

  #listeners: InputListeners;

  public constructor(
    $input: HTMLInputElement,
    chars: Chars,
    listeners: InputListeners,
  ) {
    this.#$input = $input;
    this.#chars = chars;
    this.#listeners = listeners;

    this.init();
  }

  public get unmaskedValue(): string {
    return this.#chars.mutableStringify();
  }

  public on<Name extends keyof HTMLElementEventMap>(
    name: Name,
    handler: (
      this: MaskedInput,
      masked: MaskedInput,
      event: HTMLElementEventMap[Name],
    ) => void,
  ): MaskedInput {
    this.#listeners.on(name, (event) => handler.call(this, this, event));

    return this;
  }

  public off(name: keyof HTMLElementEventMap): void {
    this.#listeners.off(name);
  }

  public destroy(): void {
    this.#listeners.destroy();
    this.#$input.value = '';
  }

  private init(): void {
    this.#listeners.init();
    this.#$input.value = this.#chars.stringify();
  }
}