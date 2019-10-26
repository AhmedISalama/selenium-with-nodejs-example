const {Builder, By, Key, until} = require('selenium-webdriver');
const Json2csvParser = require('json2csv').Parser;
const fs = require('fs');
const config = require('./config');

(async function getProjects() {

  // root url
  const rootUrl = `file://${__dirname}/Input`;
  // classes
  const ProjectContainerClass = 'product-inner';
  const ProjectNameClass = 'product-title';
  const ProductDescriptionClass = 'product-desciption'; // company and address;
  const PriceRangeClass = 'product-price-list';
  // css selectors
  const CompanyNameSelector = 'body > div > div > div > p > a';
  const ProjectLinkSelector = 'body > div > div > div > a';
  const AddressOneSelector = 'body > div > div > div > p > strong:nth-child(3)';
  const AddressTwoSelector = 'body > div > div > div > p > strong:nth-child(4)';

  // init driver
  let driver = await new Builder().forBrowser('chrome').build();
  let ProjectsArr = [];
  try {
    const files = await fs.readdirSync(`${__dirname}/Input`);
    for (file of files) {
      const url = `${config.rootUrl}/${file}`;
      console.log(url);
      await driver.get(url);
      const selector = By.className(ProjectContainerClass);
      await driver.wait(until.elementLocated(selector));
      let ProjectsDom = await driver.findElements(selector);
      for (Project of ProjectsDom) {
        const ProjectName = await driver.findElement(By.className(ProjectNameClass)).getText();
        const PriceRange = await driver.findElement(By.className(PriceRangeClass)).getText();
        const CompanyName = await driver.findElement(By.css(CompanyNameSelector)).getText();
        const AddressOne = await driver.findElement(By.css(AddressOneSelector)).getText();
        const AddressTwo = await driver.findElement(By.css(AddressTwoSelector)).getText();
        const Address = `${AddressOne} ${AddressTwo}`;
        let Link = await driver.findElement(By.css(ProjectLinkSelector))
        .getAttribute('href');
        Link = Link.replace(`${rootUrl}`, '');
        Link = Link.replace(`file://`, '');
        const Obj = {
          ProjectName,
          CompanyName,
          Link,
          PriceRange,
          Address,
        };
        ProjectsArr.push(Obj)
      }

    }
  } catch (e) {
    console.log(e);
  } finally {
    console.log(ProjectsArr);
    await fs.writeFileSync('./Output/projects.json', JSON.stringify(ProjectsArr , null, 4), 'utf-8');
    await driver.quit();
  }
})();


function pageFunction(context) {
    // called on every page the crawler visits, use it to extract data from it
    var $ = context.jQuery;
    let ProjectsArr = [];
    for (element of elemsArr) {
      const projectData = {
          title: element.getElementsByClassName('product-title')[0].innerHTML,
          Project: element.getElementsByClassName('product-title')[0].innerHTML,
          priceRange: element.getElementsByClassName('product-price-list')[0].innerHTML,
          desciption: element.getElementsByClassName('product-desciption')[0].innerHTML,
          companyName: element.querySelector('p > a').innerHTML,
      };
      ProjectsArr.push(projectData)
    }

    return result;
}
