import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/', {timeout: 30000})
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', async({page}) => {
    //by Tag name
    page.locator('input')
    //await page.locator('input').first().click()

    //by ID
    await page.locator('#inputEmail1').click()

    //by Class value
    page.locator('.shape-rectangle')

    //by attribute
    page.locator('[placeholder="Email"]')

    //by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition cdk-focused cdk-mouse-focused"]')

    //combine different selectors
    page.locator('input[placeholder="Email"].shape-rectangle[nbinput]')

    //by XPath (NOT RECOMMENDED!!!  because it easily breaks when the page changes)
    page.locator('//*[@id="inputEmail1"]')

    //by partial text match
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the Grid")')

    //to run the file use command:
    //npx playwright test --ui

})

test('User facing locators', async({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()
    
    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()

    await page.getByTestId('SignIn').click()  //we added the data-testid="SignIn" in the source code

    await page.getByTitle('IoT Dashboard').click()

})

test('locating child elements', async({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

    await page.locator('nb-card').nth(3).getByRole('button').click()
})


//run command with UI: npx playwright test --ui


//if app doesn't run on localhost run the following 2 commands twice in a row:
// npm install --force
//npm start
//then if the app still doesn't start, run again the above commands!


test('locating parent elements', async({page}) => {
    //approach #1:
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    //approach #2:
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()

    //the following example is a level up type of element search by using .. xpath approach, but is not recommended:
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()

})


//before executing the test, type and run this command in the Terminal:  npm start
//reusing the locator 'basicForm' in other lines from below
test('Reusing the locators', async({page}) => {

    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')
}) 

//or run this test by typin the command: npx playwright test --ui
test('Extracting values', async({page}) => {
    //single test value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()

    expect(buttonText).toEqual('Submit')

    //all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents() //grabs all the values and puts it in the array allRadioButtonsLabels
    expect(allRadioButtonsLabels).toContain("Option 1")

    //input values
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com') 

    //get the value of an attribute:
    //we want to validate that the 'placeholder' attribute has the value 'Email'
    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})


test('assertions', async({page}) => {
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

    //General assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    //Locator assertion
    await expect(basicFormButton).toHaveText('Submit')  //this type of assertion waits up to 5sec for the element to be available

    //Soft Assertion = is a type of assertion that continues even if it failed,
    //but still is not considered a very good practice!!!
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()
})