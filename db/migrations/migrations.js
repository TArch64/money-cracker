// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_tough_james_howlett.sql';
import m0001 from './0001_elite_valeria_richards.sql';
import m0002 from './0002_black_marten_broadcloak.sql';

export default {
  journal,
  migrations: {
    m0000,
    m0001,
    m0002
  }
};
