describe('Part 1 - Checking if the slideout panel appears', () => {
    it('Visit the "Sales Demo" page', () => {
        cy.visit('https://salesdemo.medikeeper.com/accounts/v8/salesdemo/login')       
    })
    it('Click "Forgot Password" and expect a slideout panel', () => {
        cy.contains('Forgot Password').click()
        cy.get('.offcanvas-panel--loaded')
    })
    it('See a panel with a "username" input and "next" button', () => {
        cy.get('#tbxUsername')
        cy.contains('Next')
        //used ids because classnames were overlapping with other input fields
    })
})


describe('Part 2 - Checking the functionality of all input fields in the slideout panel', () => {
    it('Submitting an empty username input yields an error message', () => {
        cy.visit('https://salesdemo.medikeeper.com/accounts/v8/salesdemo/login')
        cy.contains('Forgot Password').click()
        cy.get('.offcanvas-panel--loaded')
        cy.contains('Next').click()
        cy.get('#ctl00_MainContent_errorMessageAlert') 
    })

    it('Submitting a non-empty username input presents the date of birth input field', () => {
        cy.visit('https://salesdemo.medikeeper.com/accounts/v8/salesdemo/login')
        cy.contains('Forgot Password').click()
        cy.get('.offcanvas-panel--loaded')
        cy.get('#tbxUsername')
          .type('Testing Username')
          .should('have.value', 'Testing Username')
        cy.contains('Next').click()
        cy.get('#tbxDOB')
        cy.get('#btnForgotPDob')
    })

    it('Submitting an invalid date yields an error message', () => {
        cy.visit('https://salesdemo.medikeeper.com/accounts/v8/salesdemo/login')
        cy.contains('Forgot Password').click()
        cy.contains('Next').click()
        
        cy.get('#tbxDOB').click()
        cy.get(".input__group")
        const testDate = "04/1/2006"
        cy.get(".active").type(testDate)
          .type('{enter}').then( something => {
            cy.wrap(testDate).as('testDate')
          })
        cy.get('.selected').click()

        cy.get('@testDate').then(testDate => {
            var curDate = Cypress.moment().format("MM/DD/YYYY")
            var splitCurDate = curDate.split('/')
            var splitTestDate = testDate.split('/')
            var sixteenthYearFromCurYearInt = parseInt(splitCurDate[2]) - 16
            var sixteenYearsDateFromCurDate = new Date(sixteenthYearFromCurYearInt, splitCurDate[0], splitCurDate[1])
            var newTestDateFormat = new Date(splitTestDate[2], splitTestDate[0], splitTestDate[1])
            if (sixteenYearsDateFromCurDate.getTime() <= newTestDateFormat.getTime())
            {
                //test date is within the 16 years range from current date, which is invalid
                cy.get('#btnForgotPDob').click()
                cy.log('INVALID DATE')
                cy.get('#ctl00_MainContent_errorMessageAlert') 
            }
        })
    })

    it('Submitting an empty date yields an error message', () => {
        cy.visit('https://salesdemo.medikeeper.com/accounts/v8/salesdemo/login')
        cy.contains('Forgot Password').click()
        cy.contains('Next').click()
        cy.get('#btnForgotPDob').click()
        cy.get('#ctl00_MainContent_errorMessageAlert') 
        
    })
})

