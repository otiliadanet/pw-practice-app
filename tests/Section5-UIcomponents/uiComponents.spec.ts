//run command with UI: npx playwright test --ui

//if app doesn't run on localhost run the following 2 commands twice in a row:
// npm install --force
//npm start
//then if the app still doesn't start, run again the above commands!

import { NbOptionComponent } from '@nebular/theme'
import {test, expect} from '@playwright/test'
import { using } from 'rxjs'

test.beforeEach(async({page}) => {
    //await page.goto('http://localhost:4200/')
    await page.goto('http://localhost:4200/', {timeout: 30000})
})

test.describe('Form Layouts page', () => {

    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click({timeout: 30000})
        await page.getByText('Form Layouts').click()
    })

test('input fields', async({page}) => {
    const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})

    await usingTheGridEmailInput.fill('test@test.com')
    await usingTheGridEmailInput.clear()

    //another method to fill an input field if you want to simulate the keystrokes of the keyboard:
    //await usingTheGridEmailInput.pressSequentially('test2@test.com')  
        
    //also, you can add a delay between the key strokes:
    await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 300})  //aici da eroare pt 500 ms

    //make assertions of the input field:
    //generic assertion:
    const inputValue = await usingTheGridEmailInput.inputValue()
    expect(inputValue).toEqual('test2@test.com')  

    //locator assertion:
    await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')     
  })

  test('radio buttons', async({page}) => {
    const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})

    //varianta1:
    //await usingTheGridForm.getByLabel('Option 1').check({force: true}) //method check() will not work if element is marked as visually hidden
    
    //varianta2:
    await usingTheGridForm.getByRole('radio', {name: "Option 1"}).check({force: true})  

    const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked() 
    expect(radioStatus).toBeTruthy()

    //this is the 2nd way of validation of the status:
    await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked()

    await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
    expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
    expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
  })
})

test('checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click({timeout: 30000})
    await page.getByText('Toastr').click()

    //await page.getByRole('checkbox', {name: "Hide on click"}).click({force: true}) //click() doesn't validate the status of the checkbox, like the check() method
    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})  //if checkbox is already unchecked then it will not make any selection
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

    const allBoxes = page.getByRole('checkbox')
    for(const box of await allBoxes.all()){
        await box.check({force: true})
        expect(await box.isChecked()).toBeTruthy()
    }
})

test('lists and dropdowns', async({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    page.getByRole('list') //when the list has a UL tag
    page.getByRole('listitem') //when the list has LI tag; is an array

    //const optionList = page.getByRole('list').locator('nb-option')
    //but a more compact way is this:

    //const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])

    await optionList.filter({hasText: "Cosmic"}).click()

    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await dropDownMenu.click() //we need this in order to begin the loop
    for(const color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if (color != "Corporate")
        await dropDownMenu.click()
    }

})