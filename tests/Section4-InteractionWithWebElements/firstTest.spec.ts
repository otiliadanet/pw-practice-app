import {test} from '@playwright/test'


// test('the first test', async ({page}) => {
//     await page.goto('http://localhost:4200/')
// })


// test.beforeAll(() => {
// })


test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
})


test('The first test', async ({page}) => {
    await page.getByText('Form Layouts').click()
})


test('Navigate to datepicker page', async ({page}) => {
     await page.getByText('Datepicker').click()
 })


 //test.afterEach()