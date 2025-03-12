import {Adapter} from './Adapter';

export class Persona extends Adapter {
  static TYPE = 'persona';
  static TYPE_ID = 'personaId';

  constructor(data: Partial<Persona>) {
    super(data);
  }

  getInput(): Partial<Persona> {
    return this.data as Partial<Persona>;
  }
}