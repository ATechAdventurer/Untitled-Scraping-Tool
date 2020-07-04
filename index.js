const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const instructions = require('./config.json');
(async () => {
    const browser = await puppeteer.launch({
        //executablePath: '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--disable-dev-shm-usage'],
        headless: !true,
        

    })
    const page = await browser.newPage();
    for(var i = 0; i < instructions.length; i++){
        const instruction = instructions[i];
        const {selector} = instruction;
        switch(instruction.action){
            case "config":
                const {width, height, deviceScaleFactor} = instruction;
                page.setViewport({width, height, deviceScaleFactor});
                break;
            case "navigate":
                const {waitFor} = instruction;
                if(waitFor){
                    await page.goto(instruction.url, {waitUntil: waitFor});
                }else{
                    await page.goto(instruction.url);
                }
                
                break;
            case "scrape":
                const bodyHTML = await page.evaluate(() => new XMLSerializer().serializeToString(document));
                const $ = cheerio.load(bodyHTML);
                console.log($(instruction.selector).text());
                break;
            case "type":
                let {data} = instruction;
                await page.type(selector, data);
                break;
            case "click":
                let {awaitNavigation = false} = instruction;
                await page.click(selector); 
                if(awaitNavigation){
                    await page.waitForNavigation();
                }
                break;
                
        }
    }
    await page.waitFor(300000);
    await page.close();
    await browser.close();
})();
