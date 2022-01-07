const db = require('../db');

const tbName = 'Package';
const idFieldName = 'Id';
const fieldName = ['NamePackage', 'LimitProducts', 'LimitPeople', 'LimitTime'];

module.exports = {
  all: async () =>{
    const res = await db.load(tbName, idFieldName);
    return res;
  },
  allCondition: async (value) =>{
    var res = null;
    if(value == 0)
      res = await db.loadCondition(tbName, 'NamePackage',idFieldName);
    else if(value == 1)
      res = await db.loadCondition(tbName, 'LimitProducts',idFieldName);
    else if(value == 2)
      res = await db.loadCondition(tbName, 'LimitPeople',idFieldName);
    else if(value == 3)
      res = await db.loadCondition(tbName, 'LimitTime',idFieldName);
    return res;
  },
  allProduct: async () =>{
    const res = await db.load('Product', idFieldName);
    return res;
  },
  loadSearch: async (value) => {
    var condition =''; 
    if(!isNaN(value))
      condition = ` WHERE "LimitProducts" = ${value} OR "LimitPeople" = ${value} OR "LimitTime" = ${value} `;
    else
      condition = ` WHERE "NamePackage" ILIKE '%${value}%' `;
      
    const res = await db.loadCondition(tbName, idFieldName, condition);
    return res;
  },
  getListIdProductsOfPacket: async (PacketId) => {
    const condition =  ` WHERE "IdPackage" = ${PacketId} `;                  
    const res = await db.loadCondition('ProductPackage', idFieldName, condition);
    return res;
  },
  getNameProducts: async (ProductId) => {
    const res = await db.get('Product', 'Id', ProductId);
    return res;
  },
  add: async package =>{
    const res = await db.add(tbName, package);
    return res;
  },
  addProPacket: async productPackage =>{
    const res = await db.add('ProductPackage', productPackage);
    return res;
  },
  del: async package => {
    const pacId = package.Id;
    const condition = `WHERE "Id" = ${pacId}`;
    const res = await db.del(tbName, condition);
    return res;
  },
  delProductPackage: async package => {
    const pacId = package.Id;
    const condition = `WHERE "IdPackage" = ${pacId}`;              
    const res = await db.del('ProductPackage', condition);
    return res;
  },
  updatePackage: async (package, id )=> {
    const condition = ` WHERE "Id" = ${id} `;
    const res = await db.patch(tbName, fieldName, package, condition);
    return res;
  },
}