import { IChar } from '@src/Chars/types/IChar';
import { createArrayFromRange } from '@src/Common/utils/createArrayFromRange';
import { InputConfig } from '@src/InputConfig/InputConfig';

export class CharsValueModifier {
  public constructor(public readonly inputConfig: InputConfig) {}

  /**
   * @return IChar|undefined (IChar - (last inserted char) if input was succeeded, undefined - if wasn't)
   */
  public insertValue(
    chars: IChar[],
    value: string,
    insertIndex: number,
    prevInsertedChar?: IChar,
  ): IChar | undefined {
    const candidateChar = chars[insertIndex];

    if (!candidateChar) {
      return prevInsertedChar;
    }

    for (let i = 0; i < value.length; i += 1) {
      const valueChar = value[i] as string;

      const ableToInsert = candidateChar.isPermanent
        ? valueChar === candidateChar.value
        : !!candidateChar.regexp?.test(valueChar);

      if (ableToInsert) {
        candidateChar.value = valueChar;

        const restValue = value.slice(i + 1);

        if (restValue.length === 0) {
          return candidateChar;
        }

        return this.insertValue(
          chars,
          restValue,
          insertIndex + 1,
          candidateChar,
        );
      }

      if (candidateChar.isPermanent) {
        return this.insertValue(
          chars,
          value,
          insertIndex + 1,
          prevInsertedChar,
        );
      }
    }

    return prevInsertedChar;
  }

  /**
   * Delete value from chars by range. Range is set up by arguments.
   */
  public deleteValue(chars: IChar[], from: number, to = from): void {
    const range = from === to ? [from] : createArrayFromRange([from, to]);

    for (const index of range) {
      const candidateChar = chars[index];

      if (!candidateChar || candidateChar.isPermanent) {
        continue;
      }

      candidateChar.value = this.inputConfig.maskPlaceholder;
    }
  }

  /**
   * All the chars' changeable value is deleted.
   */
  public clear(chars: IChar[]): void {
    for (const char of chars) {
      if (char.isPermanent) {
        continue;
      }

      char.value = this.inputConfig.maskPlaceholder;
    }
  }

  /**
   * This method is like a insertValue method but in this case all the chars is changed value.
   */
  public changeAllChars(chars: IChar[], value: string): void {
    for (const [index, item] of chars.entries()) {
      if (item.isPermanent) {
        continue;
      }
      const candidateValue = value[index];

      if (!candidateValue) {
        continue;
      }

      if (item.regexp?.test(candidateValue)) {
        item.value = candidateValue;

        continue;
      }

      item.value = this.inputConfig.maskPlaceholder;
    }
  }
}
