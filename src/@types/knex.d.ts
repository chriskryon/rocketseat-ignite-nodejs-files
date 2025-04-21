import { knex } from 'knex';

declare module 'knex/types/tables' {
  interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
      created_at: Date;
    };
    meals: {
      id: string;
      user_id: string;
      name: string;
      description: string;
      datetime: string;
      is_diet: boolean;
      created_at: Date;
    };
  }
}
