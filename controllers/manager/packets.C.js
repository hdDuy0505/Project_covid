const express = require('express'),
  router = express.Router();
const packetModel = require('../../models/manager/packet.M');
const productModel = require('../../models/manager/product.M');

function compareNumbers(a, b) {
  return a - b;
}

router.get('/', async (req, res) => {
  //if (!req.user || parseInt(req.user.Role) != 3) return res.redirect('/');
  
  const list = await packetModel.all();
  const allProducts = await packetModel.allProduct();

  for (let index = 0; index < list.length; index++) {
    const idProducts = await packetModel.getListIdProductsOfPacket(list[index].Id);
    const allProductsUnChecked = await packetModel.allProduct();

    var nameProducts = new Array();
    for (let j = 0; j < idProducts.length; j++) {
      var nameProduct = await packetModel.getNameProducts(idProducts[j].IdProduct);
      nameProduct[0].images = await productModel.loadImage(nameProduct[0].Id);
      nameProducts.push(nameProduct[0]);    
    }

    list[index].products = nameProducts;    // Lưu danh sách các sản phẩm có trong gói

    var indexUnchecked = new Array();   
    nameProducts.forEach(element => {
      allProductsUnChecked.forEach(e => {
        if(e.Id == element.Id)
          indexUnchecked.push(allProductsUnChecked.indexOf(e));
      });     
    });
    
    indexUnchecked.sort(compareNumbers);
 
    var minus = 0;
    indexUnchecked.forEach(element => {
      allProductsUnChecked.splice(element - minus, 1);
      minus++;
    });

    list[index].uncheckedProducts = allProductsUnChecked;     // lưu danh sách các sản phẩm không nằm trong gói
  }
  
  //req.session.activities.push(`${req.user.name} xem danh sách các gói nhu yếu phẩm`);
  //req.session.pathCur = `http://localhost:3000/manager/packets`;
  res.render('manager/packets/list', {
    title: 'Các gói nhu yếu phẩm',
    active: { packets: true },
    allProducts: allProducts,
    packets: list,
    empty: list.length===0
  });
});

router.post('/delete/:Id', async(req, res) => {
  const package = {
    Id: parseInt(req.params.Id)
  }

  await packetModel.delProductPackage(package);
  await packetModel.del(package);

  //req.session.activities.push(`${req.user.name} xóa gói nhu yếu`);
  res.redirect('/manager/packets');
});

router.post('/update/:Id', async(req, res) => {
  const id = parseInt(req.params.Id);
  let packet = {
    NamePackage: req.body.packetName,
    LimitProducts: parseInt(req.body.packetLimitProducts),
    LimitPeople: parseInt(req.body.packetLimitPacket),
    LimitTime: parseInt(req.body.limitTime)
  };
  await packetModel.updatePackage(packet, id);
  const options = req.body.options;
  options.sort(compareNumbers);

  await packetModel.delProductPackage({Id: id});

  for (let i = 0; i < options.length; i++) {
    let productPackage = {
      IdPackage: id,                  
      IdProduct: options[i]
    }
    await packetModel.addProPacket(productPackage);
  }
  //req.session.activities.push(`${req.user.name} thay đổi gói nhu yếu phẩm ${packet.NamePackage}`);
  res.redirect('/manager/packets');
});

router.post('/add', async(req, res) => {
  let packet = {
    NamePackage: req.body.packetName,
    LimitProducts: parseInt(req.body.packetLimitProducts),
    LimitPeople: parseInt(req.body.packetLimitPacket),
    LimitTime: parseInt(req.body.limitTime)
  };

  const rs = await packetModel.add(packet);
  const options = req.body.options;
  for (let i = 0; i < options.length; i++) {
    let productPackage = {
      IdPackage: rs.Id,                 
      IdProduct: options[i]
    }
    await packetModel.addProPacket(productPackage);
  }

  //req.session.activities.push(`${req.user.name} thêm gói nhu yếu phẩm ${packet.NamePackage}`);
  res.redirect('/manager/packets');
});

router.get('/sort/byName', async(req, res) => {
  //  if (!req.user || parseInt(req.user.Role) != 3) return res.redirect('/');

  const list = await packetModel.allCondition(0);
  const allProducts = await packetModel.allProduct();

  for (let index = 0; index < list.length; index++) {
    const idProducts = await packetModel.getListIdProductsOfPacket(list[index].Id);
    const allProductsUnChecked = await packetModel.allProduct();

    var nameProducts = new Array();
    for (let j = 0; j < idProducts.length; j++) {
      var nameProduct = await packetModel.getNameProducts(idProducts[j].IdProduct);
      nameProduct[0].images = await productModel.loadImage(nameProduct[0].Id);
      nameProducts.push(nameProduct[0]);    
    }

    list[index].products = nameProducts;    // Lưu danh sách các sản phẩm có trong gói

    var indexUnchecked = new Array();   
    nameProducts.forEach(element => {
      allProductsUnChecked.forEach(e => {
        if(e.Id == element.Id)
          indexUnchecked.push(allProductsUnChecked.indexOf(e));
      });     
    });

    indexUnchecked.sort(compareNumbers);
    var minus = 0;
    indexUnchecked.forEach(element => {
      allProductsUnChecked.splice(element - minus, 1);
      minus++;
    });

    list[index].uncheckedProducts = allProductsUnChecked;     // lưu danh sách các sản phẩm không nằm trong gói
  }
  
  //req.session.activities.push(`${req.user.name} xem danh sách các gói nhu yếu phẩm theo tên`);
  //req.session.pathCur = `http://localhost:3000/manager/packets/sort/byName`;

  res.render('manager/packets/list', {
    title: 'Các gói nhu yếu phẩm',
    active: { packets: true },
    allProducts: allProducts,
    packets: list,
    empty: list.length===0
  });
});

router.get('/sort/byLimitProducts', async(req, res) => {
  //  if (!req.user || parseInt(req.user.Role) != 3) return res.redirect('/');

  const list = await packetModel.allCondition(1);
  const allProducts = await packetModel.allProduct();

  for (let index = 0; index < list.length; index++) {
    const idProducts = await packetModel.getListIdProductsOfPacket(list[index].Id);
    const allProductsUnChecked = await packetModel.allProduct();

    var nameProducts = new Array();
    for (let j = 0; j < idProducts.length; j++) {
      var nameProduct = await packetModel.getNameProducts(idProducts[j].IdProduct);
      nameProduct[0].images = await productModel.loadImage(nameProduct[0].Id);
      nameProducts.push(nameProduct[0]);    
    }

    list[index].products = nameProducts;    // Lưu danh sách các sản phẩm có trong gói

    var indexUnchecked = new Array();   
    nameProducts.forEach(element => {
      allProductsUnChecked.forEach(e => {
        if(e.Id == element.Id)
          indexUnchecked.push(allProductsUnChecked.indexOf(e));
      });     
    });

    indexUnchecked.sort(compareNumbers);
    var minus = 0;
    indexUnchecked.forEach(element => {
      allProductsUnChecked.splice(element - minus, 1);
      minus++;
    });

    list[index].uncheckedProducts = allProductsUnChecked;     // lưu danh sách các sản phẩm không nằm trong gói
  }
  
  //req.session.activities.push(`${req.user.name} xem danh sách các gói nhu yếu phẩm theo mức giới hạn số sản phẩm`);
  //req.session.pathCur = `http://localhost:3000/manager/packets/sort/byLimitProducts`;
  res.render('manager/packets/list', {
    title: 'Các gói nhu yếu phẩm',
    active: { packets: true },
    allProducts: allProducts,
    packets: list,
    empty: list.length===0
  });
  
});

router.get('/sort/byLimitPeople', async(req, res) => {
  //  if (!req.user || parseInt(req.user.Role) != 3) return res.redirect('/');

  const list = await packetModel.allCondition(2);
  const allProducts = await packetModel.allProduct();

  for (let index = 0; index < list.length; index++) {
    const idProducts = await packetModel.getListIdProductsOfPacket(list[index].Id);
    const allProductsUnChecked = await packetModel.allProduct();

    var nameProducts = new Array();
    for (let j = 0; j < idProducts.length; j++) {
      var nameProduct = await packetModel.getNameProducts(idProducts[j].IdProduct);
      nameProduct[0].images = await productModel.loadImage(nameProduct[0].Id);
      nameProducts.push(nameProduct[0]);    
    }

    list[index].products = nameProducts;    // Lưu danh sách các sản phẩm có trong gói

    var indexUnchecked = new Array();   
    nameProducts.forEach(element => {
      allProductsUnChecked.forEach(e => {
        if(e.Id == element.Id)
          indexUnchecked.push(allProductsUnChecked.indexOf(e));
      });     
    });

    indexUnchecked.sort(compareNumbers);
    var minus = 0;
    indexUnchecked.forEach(element => {
      allProductsUnChecked.splice(element - minus, 1);
      minus++;
    });

    list[index].uncheckedProducts = allProductsUnChecked;     // lưu danh sách các sản phẩm không nằm trong gói
  }
  
  //req.session.activities.push(`${req.user.name} xem danh sách các gói nhu yếu phẩm theo mức giới hạn mỗi người`);
  //req.session.pathCur = `http://localhost:3000/manager/packets/sort/byLimitPeople`;
  res.render('manager/packets/list', {
    title: 'Các gói nhu yếu phẩm',
    active: { packets: true },
    allProducts: allProducts,
    packets: list,
    empty: list.length===0
  });
});

router.get('/sort/byLimitTime', async(req, res) => {
  //  if (!req.user || parseInt(req.user.Role) != 3) return res.redirect('/');

  const list = await packetModel.allCondition(3);
  const allProducts = await packetModel.allProduct();

  for (let index = 0; index < list.length; index++) {
    const idProducts = await packetModel.getListIdProductsOfPacket(list[index].Id);
    const allProductsUnChecked = await packetModel.allProduct();

    var nameProducts = new Array();
    for (let j = 0; j < idProducts.length; j++) {
      var nameProduct = await packetModel.getNameProducts(idProducts[j].IdProduct);
      nameProduct[0].images = await productModel.loadImage(nameProduct[0].Id);
      nameProducts.push(nameProduct[0]);    
    }

    list[index].products = nameProducts;    // Lưu danh sách các sản phẩm có trong gói

    var indexUnchecked = new Array();   
    nameProducts.forEach(element => {
      allProductsUnChecked.forEach(e => {
        if(e.Id == element.Id)
          indexUnchecked.push(allProductsUnChecked.indexOf(e));
      });     
    });

    indexUnchecked.sort(compareNumbers);
    var minus = 0;
    indexUnchecked.forEach(element => {
      allProductsUnChecked.splice(element - minus, 1);
      minus++;
    });

    list[index].uncheckedProducts = allProductsUnChecked;     // lưu danh sách các sản phẩm không nằm trong gói
  }
  
  //req.session.activities.push(`${req.user.name} xem danh sách các gói nhu yếu phẩm theo mức giới hạn thời gian`);
  //req.session.pathCur = `http://localhost:3000/manager/packets/sort/byLimitTime`;
  res.render('manager/packets/list', {
    title: 'Các gói nhu yếu phẩm',
    active: { packets: true },
    allProducts: allProducts,
    packets: list,
    empty: list.length===0
  });
});

router.get('/search', async(req, res) => {
  //  if (!req.user || parseInt(req.user.Role) != 3) return res.redirect('/');
  const search = req.query.search;
  const list = await packetModel.loadSearch(search);
  const allProducts = await packetModel.allProduct();

  for (let index = 0; index < list.length; index++) {
    const idProducts = await packetModel.getListIdProductsOfPacket(list[index].Id);
    const allProductsUnChecked = await packetModel.allProduct();

    var nameProducts = new Array();
    for (let j = 0; j < idProducts.length; j++) {
      var nameProduct = await packetModel.getNameProducts(idProducts[j].IdProduct);
      nameProduct[0].images = await productModel.loadImage(nameProduct[0].Id);
      nameProducts.push(nameProduct[0]);    
    }

    list[index].products = nameProducts;    // Lưu danh sách các sản phẩm có trong gói

    var indexUnchecked = new Array();   
    nameProducts.forEach(element => {
      allProductsUnChecked.forEach(e => {
        if(e.Id == element.Id)
          indexUnchecked.push(allProductsUnChecked.indexOf(e));
      });     
    });

    indexUnchecked.sort(compareNumbers);
    var minus = 0;
    indexUnchecked.forEach(element => {
      allProductsUnChecked.splice(element - minus, 1);
      minus++;
    });

    list[index].uncheckedProducts = allProductsUnChecked;     // lưu danh sách các sản phẩm không nằm trong gói
  }
  
  //req.session.activities.push(`${req.user.name} tìm kiếm gói nhu yếu có từ khóa ${search}`);
  //req.session.pathCur = `http://localhost:3000/manager/packets/search?search=${search}`;
  res.render('manager/packets/list', {
    title: 'Các gói nhu yếu phẩm',
    active: { packets: true },
    allProducts: allProducts,
    packets: list,
    empty: list.length===0
  });
});
module.exports = router;
