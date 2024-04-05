import{test} from '@playwright/test';

test('UI Test verification',async ({page})=>
{

  // Given access to the Sauce Demo website
  await page.goto('https://www.saucedemo.com/');

  // When logging in with the standard_user credentials
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');


  // Capture Product Information
  const products = await page.evaluate(() => {
    const productList = [];
    document.querySelectorAll('.inventory_item').forEach(item => {
      const name = item.querySelector('.inventory_item_name').innerText;
      const price = item.querySelector('.inventory_item_price').innerText;
      productList.push({ name, price });
    });
    return productList;
  });

  // Logout
  await page.click('#react-burger-menu-btn');
  await page.click('#logout_sidebar_link');

  // Log in as visual_user
  await page.fill('#user-name', 'visual_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Capture Product Information as visual_user
  const visualProducts = await page.evaluate(() => {
    const productList = [];
    document.querySelectorAll('.inventory_item').forEach(item => {
      const name = item.querySelector('.inventory_item_name').innerText;
      const price = item.querySelector('.inventory_item_price').innerText;
      productList.push({ name, price });
    });
    return productList;
  });

  // Verify Product Name and Price Consistency
  let allMatch = true;
  products.forEach((product, index) => {
    if (product.name !== visualProducts[index].name || product.price !== visualProducts[index].price) {
      console.error(`Product at index ${index} does not match between user accounts`);
      console.error(`Standard User: ${product.name} - ${product.price}`);
      console.error(`Visual User: ${visualProducts[index].name} - ${visualProducts[index].price}`);
      allMatch = false;
    }
  });

  if (allMatch) {
    console.log('All product names and prices match between user accounts');
  }
})
