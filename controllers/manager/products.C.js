const express = require('express'),
  router = express.Router();
const productModel = require('../../models/manager/product.M');
const upload = require('../../middlewares/upload');
var searchVal = undefined;

router.get('/', async(req, res) => {
  //  if (!req.user || parseInt(req.user.Role) != 3) return res.redirect('/');

  const limit = 3;
  const page = +req.query.page || 1;
  if(page < 0)
    page = 1;
  const offset = (page - 1)*limit;   
  const [total, list] = await Promise.all([
      productModel.count(),
      productModel.page(limit, offset)
  ]);

  for(var i = 0; i < list.length; i++)
  {
    var id = list[i].Id;
    list[i].images = await productModel.loadImage(id);
  }
  
  const nPages = Math.ceil(total[0].Size/3);   

  const page_items = [];
  for(let i = 1; i <= nPages; i++){
    const item = {
      value: i,
      isActive: i === page
    };
    page_items.push(item);
  };
  
  //req.session.activities.push(`${req.user.name} xem danh sách các sản phẩm nhu yếu`);
  //req.session.pathCur = `http://localhost:3000/manager/products`;
  res.render('manager/products/list', {
    title: 'Danh sách các sản phẩm nhu yếu phẩm',
    active: { products: true },
    products: list,
    empty: list.length===0,
    page_items: page_items,
    prev_value: page - 1,
    next_value: page + 1,
    can_go_prev: page > 1,
    can_go_next: page < nPages
  });
});

router.post('/delete/:Id', async(req, res) => {
  let product = {
      Id: parseInt(req.params.Id)
  }

  await productModel.delImage(product);
  await productModel.delProductPackage(product);
  await productModel.del(product);

  //req.session.activities.push(`${req.user.name} xóa sản phẩm nhu yếu`);
  res.redirect('/manager/products');
});

router.post('/update/:Id', async(req, res) => {
  let product = {
      Price: parseInt(req.body.productPrice),
      NameProduct: req.body.productName,     
      Unit: req.body.productUnit
  }

  await productModel.updateProduct(product, parseInt(req.params.Id));

  //req.session.activities.push(`${req.user.name} thay đổi thông tin sản phẩm nhu yếu`);
  res.redirect('/manager/products');
});

router.post('/add',  upload.array('productImage', 12), async(req, res) => {
  let product = {
      Price: parseInt(req.body.productPrice),
      NameProduct: req.body.productName,     
      Unit: req.body.productUnit
  };
  const rs = await productModel.add(product);

  for (let index = 0; index < req.files.length; index++) {
    let productImg = {
      IdProduct: rs.Id, 
      Img: req.files[index].originalname
    }   
    await productModel.addImg(productImg);
  }
  
  //req.session.activities.push(`${req.user.name} thêm sản phẩm nhu yếu ${product.NameProduct}`);
  res.redirect('/manager/products');
});

router.get('/search', async(req, res) => {
  //  if (!req.user || parseInt(req.user.Role) != 3) return res.redirect('/');
  const search = searchVal;
  if(search !== undefined)
  {
    const limit = 3;
    const page = +req.query.page || 1;
    if(page < 0)
      page = 1;
    const offset = (page - 1)*limit;   
    const [total, list] = await Promise.all([
        productModel.countSearch(search),
        productModel.loadSearch(search, limit, offset)
    ]);

    for(var i = 0; i < list.length; i++)
    {
      var id = list[i].Id;
      list[i].images = await productModel.loadImage(id);
    }
    
    const nPages = Math.ceil(total[0].Size/3);   

    const page_items = [];
    for(let i = 1; i <= nPages; i++){
      const item = {
        value: i,
        isActive: i === page&&search
      };
      page_items.push(item);
    };

    //req.session.activities.push(`${req.user.name} tìm kiếm các sản phẩm nhu yếu theo từ khóa ${search}`);
    //req.session.pathCur = `http://localhost:3000/manager/products/search?page=${page}`;
    res.render('manager/products/list', {
      title: 'Danh sách các sản phẩm nhu yếu phẩm',
      active: { products: true },
      products: list,
      empty: list.length===0,
      page_items: page_items,
      prev_value: page - 1,
      next_value: page + 1,
      can_go_prev: page > 1,
      can_go_next: page < nPages
    });
  }
  else {
    //req.session.activities.push(`${req.user.name} tìm kiếm các sản phẩm nhu yếu theo từ khóa ${search}`);
    //req.session.pathCur = `http://localhost:3000/manager/products/search?page=${page}`;
    res.render('manager/products/list', {
      title: 'Danh sách các sản phẩm nhu yếu phẩm',
      active: { products: true },
      empty: 0,
    });
  }
});

router.post('/search', async(req, res) => {
  const search = req.body.search;
  searchVal = search;
  const limit = 3;
  const page = +req.query.page || 1;
  if(page < 0)
    page = 1;
  const offset = (page - 1)*limit;   
  const [total, list] = await Promise.all([
      productModel.countSearch(search),
      productModel.loadSearch(search, limit, offset)
  ]);

  for(var i = 0; i < list.length; i++)
  {
    var id = list[i].Id;
    list[i].images = await productModel.loadImage(id);
  }
  
  const nPages = Math.ceil(total[0].Size/3);   

  const page_items = [];
  for(let i = 1; i <= nPages; i++){
    const item = {
      value: i,
      isActive: i === page&&search
    };
    page_items.push(item);
  };
  
  res.render('manager/products/list', {
    title: 'Danh sách các sản phẩm nhu yếu phẩm',
    active: { products: true },
    products: list,
    empty: list.length===0,
    page_items: page_items,
    prev_value: page - 1,
    next_value: page + 1,
    can_go_prev: page > 1,
    can_go_next: page < nPages
  });
});

router.get('/sort/byName', async(req, res) => {
  //  if (!req.user || parseInt(req.user.Role) != 3) return res.redirect('/');

  const limit = 3;
  const page = +req.query.page || 1;
  if(page < 0)
    page = 1;
  const offset = (page - 1)*limit;   
  const [total, list] = await Promise.all([
      productModel.count(),
      productModel.pageCondition(0, limit, offset)
  ]);

  for(var i = 0; i < list.length; i++)
  {
    var id = list[i].Id;
    list[i].images = await productModel.loadImage(id);
  }
  
  const nPages = Math.ceil(total[0].Size/3);   

  const page_items = [];
  for(let i = 1; i <= nPages; i++){
    const item = {
      value: i,
      isActive: i === page
    };
    page_items.push(item);
  };
  
  //req.session.activities.push(`${req.user.name} xem danh sách sản phẩm theo tên`);
  //req.session.pathCur = `http://localhost:3000/manager/products/sort/byName`;
  res.render('manager/products/list', {
    title: 'Danh sách các sản phẩm nhu yếu phẩm',
    active: { products: true },
    products: list,
    empty: list.length===0,
    page_items: page_items,
    prev_value: page - 1,
    next_value: page + 1,
    can_go_prev: page > 1,
    can_go_next: page < nPages
  });
});

router.get('/sort/byCost', async(req, res) => {
  //  if (!req.user || parseInt(req.user.Role) != 3) return res.redirect('/');

  const limit = 3;
  const page = +req.query.page || 1;
  if(page < 0)
    page = 1;
  const offset = (page - 1)*limit;   
  const [total, list] = await Promise.all([
      productModel.count(),
      productModel.pageCondition(1, limit, offset)
  ]);

  for(var i = 0; i < list.length; i++)
  {
    var id = list[i].Id;
    list[i].images = await productModel.loadImage(id);
  }
  
  const nPages = Math.ceil(total[0].Size/3);   

  const page_items = [];
  for(let i = 1; i <= nPages; i++){
    const item = {
      value: i,
      isActive: i === page
    };
    page_items.push(item);
  };
  
  //req.session.activities.push(`${req.user.name} xem danh sách sản phẩm theo giá tiền`);
  //req.session.pathCur = `http://localhost:3000/manager/products/sort/byCost`;
  res.render('manager/products/list', {
    title: 'Danh sách các sản phẩm nhu yếu phẩm',
    active: { products: true },
    products: list,
    empty: list.length===0,
    page_items: page_items,
    prev_value: page - 1,
    next_value: page + 1,
    can_go_prev: page > 1,
    can_go_next: page < nPages
  });
});
module.exports = router;
