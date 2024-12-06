const { Builder, By, until, Select } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { includes, add } = require("./file");

const scraperOptions = [
  "--disable-popups",
  //   "--headless",
  "--window-size=1920,1080",
  "--start-maximized",
  "--no-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
  "--disable-extensions",
  "--remote-debugging-port=9230",
  "--disable-search-engine-choice-screen",
];

const performActions = async (actions, url) => {
  let driver;
  try {
    console.log("Performing actions on ->", url);
    let options = new chrome.Options();
    options.addArguments(...scraperOptions);

    driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

    await driver.executeScript("Object.defineProperty(navigator, 'webdriver', {get: () => undefined});");

    await driver.get(url);

    for (const action of actions) {
      const selector = action.selector || "xpath";
      await performAction(driver, action, selector);
    }
  } catch (e) {
    console.log("error", e);
  } finally {
    // comment for testing to not login multiple times (bot detection)
    // await driver.quit();
  }
};

const performAction = async (driver, action, selector) => {
  await randomDelay(1000);
  if (action.type === "click") {
    await performClickAction(driver, action, selector);
  } else if (action.type === "selectOption") {
    await performSelectOptionAction(driver, action, selector);
  } else if (action.type === "input") {
    await performInputAction(driver, action, selector);
  } else if (action.type === "wait") {
    await driver.sleep(2000);
  } else if (action.type === "navigate") {
    await driver.get(action.url);
  } else if (action.type === "iterate_list") {
    await clickOnClassNameForListElements(driver, action, selector);
  } else if (action.type === "scroll") {
    await driver.executeScript(`window.scrollTo(0, ${action.scrollBy})`);
  }
};

const performClickAction = async (driver, action, selector) => {
  if (selector == "location") {
    return await driver.actions().move({ x: action.location[0], y: action.location[1] }).click().perform();
  }
  await driver.wait(until.elementLocated(By[selector](action[selector || "xpath"])), 4000);
  await driver.findElement(By[selector](action[selector || "xpath"])).click();
};

const performInputAction = async (driver, action, selector) => {
  if (selector == "location") {
    return typeByLocation(driver, action);
  }
  typeByXpath(driver, action);
};

const typeByLocation = async (driver, action) => {
  await driver.actions().move({ x: action.location[0], y: action.location[1] }).click().perform();

  for (const char of action.text) {
    await driver.actions().sendKeys(char).perform();
    await randomDelay();
  }
};

const typeByXpath = async (driver, action) => {
  await driver.wait(until.elementLocated(By.xpath(action.xpath)), 4000);
  const element = await driver.findElement(By.xpath(action.xpath));

  for (const char of action.text) {
    await element.sendKeys(char);
    await randomDelay();
  }
};

const randomDelay = async (max = 200) => {
  const delay = 0 + Math.random() * max;
  await sleep(delay);
};

const performSelectOptionAction = async (driver, action, selector) => {
  if (selector == "location") {
    await driver.actions().move({ x: action.location[0], y: action.location[1] }).click().perform();

    await driver.wait(until.elementsLocated(By.tagName("option")), 4000);
    const options = await driver.findElements(By.tagName("option"));

    for (const option of options) {
      const text = await option.getText();
      if (text === action.optionText) {
        await option.click();
        break;
      }
    }
    return;
  }

  const selectElement = await driver.findElement(By[selector](action.xpath));
  const select = new Select(selectElement);
  await select.selectByVisibleText(action.optionText);
};

const clickOnClassNameForListElements = async (driver, action, selector) => {
  const list = await driver.findElements(By[selector](action.xpath));
  const listElements = await list[0].findElements(By.tagName("li"));

  const originalWindow = await driver.getWindowHandle();

  for (const element of listElements) {
    try {
      console.log(element);
      const childElement = await element.findElement(By.className(action.className));
      const houseId = await element.findElement(By.className(action.idSelector));
      const href = await houseId.getAttribute("href");
      const hrefArray = href.split("/");

      const code = hrefArray[hrefArray.length - 2];
      const alreadyUsed = await includes(code);
      if (!alreadyUsed) {
        console.log("clicking on");
        await driver.executeScript('window.open(arguments[0], "_blank");', href)
        const windows = await driver.getAllWindowHandles();
        const newWindow = windows.find((handle) => handle !== originalWindow);
        await driver.switchTo().window(newWindow);
        await randomDelay();
        for (const subaction of action.actions) {
          const subselector = subaction.selector || "xpath";
          await performAction(driver, subaction, subselector);
        }
		add(code);
        await driver.close();
        await driver.switchTo().window(originalWindow);
      } else {
        console.log("skipping house");
      }
    } catch (e) {
      console.log("error", e);
    }
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = { performActions };
