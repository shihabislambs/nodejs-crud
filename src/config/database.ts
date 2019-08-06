import * as Knex from 'knex';
import { Model } from 'objection';

const config = require('./knexfile');

export function connectToDatabase() {
  // Initialize knex.
  const knex = Knex(config.development);

  Model.knex(knex);
}
