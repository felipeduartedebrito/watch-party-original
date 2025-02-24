describe('Create Session', () => {
    it('should create a new session and redirect to watch page', () => {
        cy.visit('http://localhost:5050');
        cy.get('input[placeholder="Session Name"]').type('Test Session');
        cy.get('input[placeholder="Youtube Link"]').type('https://youtube.com/watch?v=dQw4w9WgXcQ');
        cy.get('button').contains('Create').click();

        cy.url().should('include', '/watch/');
        cy.contains('Test Session').should('be.visible');
    });
});