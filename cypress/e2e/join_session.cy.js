describe('Join Session', () => {
    it('should join an existing session and sync video', () => {
        cy.visit('http://localhost:5050/watch/1234');

        cy.contains('Test Session').should('be.visible');
        cy.get('button').contains('Play').click();
        cy.wait(1000);
        cy.get('button').contains('Pause').click();

        cy.get('button').contains('Play').should('be.visible');
    });
});