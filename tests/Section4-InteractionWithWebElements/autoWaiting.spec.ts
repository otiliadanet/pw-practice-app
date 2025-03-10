//testing auto-waiting on this website:
// http://uitestingplayground.com/ajax
 
import {test, expect} from '@playwright/test'

test.beforeEach(async({page}, testInfo) => {
    await page.goto('http://uitestingplayground.com/ajax', {timeout: 30000})
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000)
})

test('auto waiting', async({page}) => {
    const successButton = page.locator('.bg-success')

    //await successButton.click()  //when this is commented run test having the following 2 lines of code

    const text = await successButton.textContent()
    expect(text).toEqual('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000}) //default timeout is 5 sec
})


//Alternative waits for elements that do not support autowaiting:
test('wait for element', async({page}) => {
    const successButton = page.locator('.bg-success')

    //wait for the element named button success:
    await page.waitForSelector('.bg-success')


    const text = await successButton.allTextContents() //example of a method that does not have wait
    expect(text).toContain('Data loaded with AJAX get request.')
})


test('wait for particular response', async({page}) => {
    const successButton = page.locator('.bg-success')

    //on the website we made a simulation of a networking request that we are waiting for
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')  //the URL of the response that we are waiting for 


    //and when the above line is executed and completed only then it'll go to the next lines of code:
    const text = await successButton.allTextContents() //example of a method that does not have wait
    //expect(text).toEqual('Data loaded with AJAX get request.')
    expect(text).toContain('Data loaded with AJAX get request.')
})


test('wait for network calls', async({page}) => {
    const successButton = page.locator('.bg-success')

    //wait for network calls to be completed ('NOT RECOMMENDED'):
    await page.waitForLoadState('networkidle') //waits that all the API calls in the Networking tab of the browser are completed

    //this wait is also not recommended:
    await page.waitForTimeout(5000)

    //await page.waitForURL('')  //this wait type is also useful when you navigate to a particular page and you wait for this URL to be available!!!

    const text = await successButton.allTextContents() 
    expect(text).toContain('Data loaded with AJAX get request.')
})


test('timeouts', async({page}) => {
    
    //test.setTimeout(16000) //when no test timeout use line ..

    //test.slow()  //multiplies by 3 the timeout from defineConfig in playwright.config.ts
    const successButton = page.locator('.bg-success')
    await successButton.click({timeout: 16000})   //default timeout for the click methos is 30 sec
    await successButton.click()

})