const db = require('../db');

const tbName = 'Product';
const idFieldName = 'Id';
const fieldName = ['Price', 'NameProduct', 'Unit'];

module.exports = {
  page: async (limit, offset) => {
    const res = await db.loadPageofProduct(tbName, limit, offset);
    return res;
  },
  pageCondition: async (value, limit, offset) => {
    var condition = '';

    if(value == 0)
      condition = 'ORDER BY "NameProduct" ASC ';
    else if(value == 1)
      condition = 'ORDER BY "Price" ASC ';

    const  res = await db.loadCondition1(tbName, condition, limit, offset);
    return res;
  },
  count: async () => {
    const condition = "";
    const res = await db.count(tbName, idFieldName, condition);
    return res;
  },
  loadImage: async ProId => {
    const condition = ` WHERE "IdProduct" = ${ProId} `;
    const res = await db.loadCondition('ProductImg', idFieldName, condition);
    return res;
  },
  countSearch: async (value) => {
    var condition =''; 
    if(!isNaN(value))
      condition = ` WHERE "Price" = ${value} `;
    else
      condition = ` WHERE "NameProduct" ILIKE '%${value}%' OR  "Unit" ILIKE '%${value}%' `;
    const res = await db.count(tbName, idFieldName, condition);
    return res;
  },
  loadSearch: async (value, limit, offset) => {
    var condition =''; 
    if(!isNaN(value))
      condition = ` WHERE "Price" = ${value} ORDER BY "Id" ASC `;
    else
      condition = ` WHERE "NameProduct" ILIKE '%${value}%' OR  "Unit" ILIKE '%${value}%' ORDER BY "Id" ASC `;
    const res = await db.loadCondition1(tbName, condition, limit, offset);
    return res;
  },
  add: async product =>{
    const res = await db.add(tbName, product);
    return res;
  },
  addImg: async productImg =>{
    const res = await db.add('ProductImg', productImg);
    return res;
  },
  del: async product => {
    const ProId = product.Id;
    const condition = `WHERE "Id" = ${ProId}`;
    const res = await db.del(tbName, condition);
    return res;
  },
  delImage: async product => {
    const ProId = product.Id;
    const condition = `WHERE "IdProduct" = ${ProId}`;
    const res = await db.del('ProductImg', condition);
    return res;
  },
  delProductPackage: async product => {
    const ProId = product.Id;
    const condition = `WHERE "IdProduct" = ${ProId}`;
    const res = await db.del('ProductPackage', condition);
    return res;
  },
  updateProduct: async (product, id )=> {
    const condition = `WHERE "Id" = ${id}`;
    const res = await db.patch(tbName, fieldName, product, condition);
    return res;
  },
}