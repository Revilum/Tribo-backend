const cheerio = require("cheerio")
const puppeteer = require("puppeteer")
const fs = require('fs')

async function fetch_page() {
    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage();
    await page.goto("https://www.hltv.org/events/5604/blast-premier-spring-final-2021");
    const pageContent = await page.evaluate(() => document.body.innerHTML)
    let $ = cheerio.load(pageContent)
    let api_response = $("div[class='slotted-bracket-placeholder']").attr("data-slotted-bracket-json")
    fs.writeFileSync('api_output.json', api_response)
    await page.close();
    await browser.close();

}

fetch_page()
