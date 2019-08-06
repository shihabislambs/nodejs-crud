import { Model } from 'objection';

export default class Todo extends Model {
  public user: number;
  static get tableName() {
      return 'todos';
  }
}
