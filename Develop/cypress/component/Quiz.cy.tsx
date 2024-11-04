import Quiz from '../../client/src/components/Quiz';

const mockQuestions = [
    {
        "question": "What is 1 + 1?",
        "answers": [
            { "text": "1", "isCorrect": false },
            { "text": "2", "isCorrect": true },
            { "text": "3", "isCorrect": false },
            { "text": "4", "isCorrect": false },
        ]
    },
]

describe('<Quiz />', () => {
    it('should render the start quiz button', () => {
        cy.mount(<Quiz />);
        cy.get('[data-cy="start"]').should('exist').and('have.text', 'Start Quiz');
    });

    context('Quiz Answering', () => {
        beforeEach(() => {
            cy.intercept('GET', '/api/questions/random', {
                delay: 1000,
                body: mockQuestions,
            }).as('getQuestions');

            cy.mount(<Quiz />)
            cy.get('[data-cy=start]').click();
        });

        it('should show a loading screen after clicking start quiz and disappears once first question loads in', () => {
            cy.get('.spinner-border', { timeout: 2000 }).should('be.visible');
            cy.wait('@getQuestions');
            cy.get('.spinner-border').should('not.exist');
            cy.contains("What is 1 + 1?").should('be.visible');
        });

        it('should increase the score when picking a correct answer', () => {
            cy.wait('@getQuestions');
            cy.get('.btn.btn-primary').contains("2").click();
            cy.get('.alert.alert-success').should('contain.text', 'Your score: 1/1');
        });

        it('should not increase the score when picking a wrong answer', () => {
            cy.wait('@getQuestions');
            cy.get('.btn.btn-primary').contains("1").click();
            cy.get('.alert.alert-success').should('contain.text', 'Your score: 0/1');
        });

        it('should display a button that starts up a new quiz after the first quiz is complete', () => {
            cy.wait('@getQuestions');
            cy.get('.btn.btn-primary').contains("2").click();
            cy.get('[data-cy=newQuiz]').should('contain.text', 'Take New Quiz');
            cy.get('[data-cy=newQuiz]').click();
            cy.wait('@getQuestions');
            cy.contains("What is 1 + 1?").should('be.visible');
        });
    });
});

