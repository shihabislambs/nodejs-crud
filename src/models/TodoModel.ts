import { Model } from 'objection';

export default class Todo extends Model {
  static get tableName() {
      return 'todos';
  }
}
