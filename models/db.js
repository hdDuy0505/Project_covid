const pgp = require('pg-promise')({
  capSQL: true,
});
const schema = 'public';
const cn = {
user: 'postgres',
host: 'localhost',
database: 'covid', // điền tên db trên máy của mình vào
password: 'thaiduydo17',  // điền cái password master
port: 5432,
max: 30,
}
const db = pgp(cn);

exports.load = async (tbName, orderBy) => {
  const table = new pgp.helpers.TableName({table: tbName, schema: schema});
  const qStr = pgp.as.format(`SELECT * FROM $1 ORDER BY "${orderBy}" ASC `, table);
  
  try {
      const res = await db.any(qStr);
      return res;
  } catch (error) {
      console.log('error db/load: ', error);
  }
}

exports.loadPage = async (tbName, ID, limit, offset) => {
  const table = new pgp.helpers.TableName({table: tbName, schema: schema});
  const qStr = pgp.as.format(`SELECT * FROM $1 WHERE "CatID"='${ID}' LIMIT ${limit} OFFSET ${offset}`, table);
  //console.log(qStr);
  try {
      const res = await db.any(qStr);
      return res;
  } catch (error) {
      console.log('error db/loadPage: ', error);
  }
}

exports.loadPageofProduct = async (tbName, limit, offset) => {
  const table = new pgp.helpers.TableName({table: tbName, schema: schema});
  const qStr = pgp.as.format(`SELECT * FROM $1 LIMIT ${limit} OFFSET ${offset}`, table);
 
  try {
      const res = await db.any(qStr);
      return res;
  } catch (error) {
      console.log('error db/loadPage: ', error);
  }
}

exports.loadCondition = async (tbName, orderBy, condition) => {
  const table = new pgp.helpers.TableName({table: tbName, schema: schema});
  const qStr = pgp.as.format('SELECT * FROM $1', table) + condition + ` ORDER BY "${orderBy}" ASC`;
 
  try {
      const res = await db.any(qStr);
      return res;
  } catch (error) {
      console.log('error db/loadCondition: ', error);
  }
}

exports.loadCondition1 = async (tbName, condition, limit, offset) => {
  const table = new pgp.helpers.TableName({table: tbName, schema: schema});
  const qStr = pgp.as.format(`SELECT * FROM $1 `, table) + condition + `LIMIT ${limit} OFFSET ${offset}`;
 
  try {
      const res = await db.any(qStr);
      return res;
  } catch (error) {
      console.log('error db/loadCondition: ', error);
  }
}

exports.count = async (tbName, idFieldName, condition) => {
  const table = new pgp.helpers.TableName({table: tbName, schema: schema});
  const qStr = pgp.as.format(`SELECT count("${idFieldName}") AS "Size" FROM $1`, table) + condition;

  try {
      const res = await db.any(qStr);
      return res;
  } catch (error) {
      console.log('error db/count: ', error);
  }
}

exports.get = async (tbName, fieldName, value) => {
  const table = new pgp.helpers.TableName({table: tbName, schema: schema});
  const qStr = pgp.as.format(`SELECT * FROM $1 WHERE "${fieldName}"='${value}'`, table);
  try {
      const res = await db.any(qStr);
      return res;
  } catch (error) {
      console.log('error db/get: ', error);
  }
}

exports.add = async (tbName, entity) => {
  const table = new pgp.helpers.TableName({table: tbName, schema: schema});
  const qStr = pgp.helpers.insert(entity, null, table) + ' RETURNING *';
  try {
      const res = await db.one(qStr);
      return res;
  } catch (error) {
      console.log('error db/add: ', error);
  }
}

exports.patch = async (tbName, filedName, entity, condition) => {
  const table = new pgp.helpers.TableName({table: tbName, schema: schema});

  const conditionInput = pgp.as.format(condition, entity);
  const qStr = pgp.helpers.update(entity, filedName, table) + conditionInput;

  try {
      const res = await db.any(qStr);
      return res;
  } catch (error) {
      console.log('error db/patch: ', error);
  }
}

exports.del = async (tbName, condition) => {
  const table = new pgp.helpers.TableName({table: tbName, schema: schema});

  const qStr = pgp.as.format(`DELETE FROM $1 `, table) + condition;

  try {
      const res = await db.any(qStr);
      return res;
  } catch (error) {
      console.log('error db/del: ', error);
  }
}
