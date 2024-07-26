context('Visit All Sidebar Pages', () => {
  beforeEach(() => {
    cy.restoreLocalStorage()
    cy.accessPage()
  })

  afterEach(() => {
    cy.saveLocalStorage()
  })

  describe('Access Common Pages', () => {
    const clickSidebarItem = (key: string) =>
      cy.get(`[data-cy="sidebar-item-${key}"]`).click()

    it('able to access public library page', () => {
      cy.shouldNotCrash()
      cy.url().should('contain', '/public-library')
    })

    it('able to access dashboard page', () => {
      clickSidebarItem('dashboard')
      cy.waitLoadingDissmissed()
      cy.shouldNotCrash()
    })

    it('able to access management page', () => {
      clickSidebarItem('management')
      cy.shouldNotCrash()
    })

    it('able to access progress status page', () => {
      clickSidebarItem('progress-status')
      cy.waitLoadingDissmissed()
      cy.shouldNotCrash()
    })
  })

  describe('Sidebar Item Organization', () => {
    it('organization sidebar items exists and accessible', () => {
      cy.get('[data-cy^="sidebar-org-"]').each((org) => {
        const testId = org.attr('data-cy')

        const clickSidebarItem = (key: string) => {
          cy.get(`[data-cy="child-${testId}-${key}"]`).click()
        }

        const isPageItemActive = (
          key: string,
          { checkloading = true } = {}
        ) => {
          clickSidebarItem(key)
          checkloading && cy.waitLoadingDissmissed()
          cy.shouldNotCrash()
        }
        cy.get(`[data-cy=${testId}]`).click()
        isPageItemActive('assets-library')
        isPageItemActive('workspace')
        isPageItemActive('mood-board')
        isPageItemActive('thread-board', { checkloading: false })

        cy.get('[data-cy=upload-page]').click()
        cy.get('[data-cy="smart-upload-title"]').should('exist')
        cy.shouldNotCrash()
      })
    })
  })
})
